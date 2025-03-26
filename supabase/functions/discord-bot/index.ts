
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";
import { 
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "https://esm.sh/discord-interactions@3.4.0";

// Constants for interacting with Discord API
const DISCORD_PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY") || "";
const DISCORD_BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create a Supabase client with the service role key
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// Commands for the Discord bot
const BUMP_COMMAND = {
  name: "bump",
  description: "Bump this server to increase its visibility on Bot Finder Hub",
  type: 1,
};

const INVITE_COMMAND = {
  name: "invite",
  description: "Generate a new invite link for this server",
  type: 1,
  options: [
    {
      name: "expiry",
      description: "Expiry time in hours (default: 24)",
      type: 4, // INTEGER
      required: false,
    },
    {
      name: "uses",
      description: "Maximum number of uses (default: unlimited)",
      type: 4, // INTEGER
      required: false,
    },
  ],
};

// Discord API endpoints
const DISCORD_API = "https://discord.com/api/v10";

// Function to register commands with a Discord application
async function registerCommands() {
  const applicationId = Deno.env.get("DISCORD_APPLICATION_ID");
  if (!applicationId) {
    console.error("Missing DISCORD_APPLICATION_ID environment variable");
    return;
  }

  try {
    const url = `${DISCORD_API}/applications/${applicationId}/commands`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify([BUMP_COMMAND, INVITE_COMMAND]),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Error registering commands:", text);
      return;
    }

    const json = await response.json();
    console.log("Commands registered successfully:", json);
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

// Function to handle the bump command
async function handleBumpCommand(guildId: string) {
  try {
    // Get the server from the database
    const { data: server, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .eq("id", guildId)
      .single();

    if (fetchError) {
      // Server not in database, create a new entry
      return {
        content: "This server isn't registered on Bot Finder Hub yet. Register at https://bot-finder-hub.lovable.app/add-server",
      };
    }

    // Update the server's updated_at field to bump it
    const { error: updateError } = await supabase
      .from("servers")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", guildId);

    if (updateError) {
      console.error("Error bumping server:", updateError);
      return {
        content: "Failed to bump server. Please try again later.",
      };
    }

    return {
      content: "🚀 Server successfully bumped on Bot Finder Hub! It will now appear higher in listings.",
    };
  } catch (error) {
    console.error("Error in handleBumpCommand:", error);
    return {
      content: "An error occurred while processing your request.",
    };
  }
}

// Function to handle the invite command
async function handleInviteCommand(guildId: string, options: any[]) {
  try {
    // Parse command options
    const expiryHours = options.find(opt => opt.name === "expiry")?.value || 24;
    const maxUses = options.find(opt => opt.name === "uses")?.value || 0;

    // Calculate expiry in seconds
    const expiry = expiryHours * 3600;

    // Create an invite through Discord API
    const url = `${DISCORD_API}/guilds/${guildId}/channels`;
    
    // Get channels in the guild
    const channelsResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    if (!channelsResponse.ok) {
      return {
        content: "Failed to get channels. Make sure the bot has the necessary permissions.",
      };
    }

    const channels = await channelsResponse.json();
    
    // Find a text channel to create an invite for
    const textChannel = channels.find((channel: any) => channel.type === 0);
    
    if (!textChannel) {
      return {
        content: "No suitable text channel found to create an invite.",
      };
    }

    // Create the invite
    const inviteResponse = await fetch(`${DISCORD_API}/channels/${textChannel.id}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        max_age: expiry,
        max_uses: maxUses,
        temporary: false,
      }),
    });

    if (!inviteResponse.ok) {
      return {
        content: "Failed to create invite. Make sure the bot has the 'Create Invite' permission.",
      };
    }

    const invite = await inviteResponse.json();
    
    return {
      content: `Here's your invite link: https://discord.gg/${invite.code}\nExpires: ${expiryHours} hours, Max uses: ${maxUses || "unlimited"}`,
    };
  } catch (error) {
    console.error("Error in handleInviteCommand:", error);
    return {
      content: "An error occurred while creating the invite.",
    };
  }
}

// Main handler for Discord Interactions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  // Verify the request is coming from Discord
  const signature = req.headers.get("X-Signature-Ed25519") || "";
  const timestamp = req.headers.get("X-Signature-Timestamp") || "";
  const body = await req.text();
  
  try {
    const isValidRequest = verifyKey(
      body,
      signature,
      timestamp,
      DISCORD_PUBLIC_KEY
    );
    
    if (!isValidRequest) {
      return new Response("Invalid request signature", { status: 401 });
    }
  } catch (err) {
    return new Response("Error verifying request", { status: 401 });
  }

  // Parse the request body
  const interaction = JSON.parse(body);

  // Handle ping from Discord during registration
  if (interaction.type === InteractionType.PING) {
    return new Response(
      JSON.stringify({ type: InteractionResponseType.PONG }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Handle slash commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = interaction.data;
    const guildId = interaction.guild_id;

    let responseData;
    
    if (name === "bump") {
      responseData = await handleBumpCommand(guildId);
    } else if (name === "invite") {
      responseData = await handleInviteCommand(guildId, options || []);
    } else {
      responseData = {
        content: "Unknown command",
      };
    }

    return new Response(
      JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: responseData,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Handle unknown interaction types
  return new Response(
    JSON.stringify({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Unsupported interaction type",
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});

// Try to register commands on startup
registerCommands().catch(console.error);
