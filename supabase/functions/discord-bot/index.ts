
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  InteractionType, 
  InteractionResponseType
} from "npm:discord-interactions";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get Discord auth headers
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  
  if (!signature || !timestamp) {
    console.error('Missing signature or timestamp headers');
    return new Response(JSON.stringify({ error: 'Invalid request' }), { 
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  try {
    // Get request body as text for verification
    const bodyText = await req.text();
    
    // Verify the request is coming from Discord
    // Using native crypto methods instead of external library
    const isValid = await verifyDiscordRequest(
      bodyText,
      signature,
      timestamp,
      Deno.env.get('DISCORD_PUBLIC_KEY') || ''
    );

    if (!isValid) {
      console.error('Invalid signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Parse the body text to JSON
    const body = JSON.parse(bodyText);

    // Handle Discord's ping to verify endpoint
    if (body.type === InteractionType.PING) {
      return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle slash commands
    if (body.type === InteractionType.APPLICATION_COMMAND) {
      const { name } = body.data;

      if (name === 'bump') {
        await handleBumpCommand(body);
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '🚀 Server bumped successfully! Your server will now be at the top of the list for more visibility.'
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (name === 'invite') {
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Here's your invite link: https://discord.gg/${body.guild_id || 'Not available'}\nShare this with friends to grow your community!`
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Unknown command
      return new Response(
        JSON.stringify({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Unknown command. Available commands: /bump, /invite'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unhandled interaction type' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing Discord interaction:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Verify Discord request using native crypto
async function verifyDiscordRequest(body: string, signature: string, timestamp: string, clientPublicKey: string): Promise<boolean> {
  try {
    // Convert the Discord public key to a crypto key
    const publicKey = await crypto.subtle.importKey(
      'raw',
      hexToUint8Array(clientPublicKey),
      {
        name: 'NODE-ED25519',
        namedCurve: 'NODE-ED25519',
      },
      false,
      ['verify']
    );
    
    // Create the message to verify
    const message = new TextEncoder().encode(timestamp + body);
    
    // Verify the signature
    return await crypto.subtle.verify(
      'NODE-ED25519',
      publicKey,
      hexToUint8Array(signature),
      message
    );
  } catch (err) {
    console.error('Error verifying request:', err);
    return false;
  }
}

// Helper function to convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const pairs = hex.match(/[\dA-F]{2}/gi) || [];
  return new Uint8Array(
    pairs.map((s) => parseInt(s, 16))
  );
}

async function handleBumpCommand(body: any) {
  try {
    // Update the server's bumped time in our database
    // Initialize Supabase Admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    if (!body.guild_id) {
      console.error('No guild_id provided in bump command');
      return;
    }

    // Find the server by Discord ID and update its updated_at timestamp
    const { error } = await supabaseAdmin
      .from('servers')
      .update({ updated_at: new Date().toISOString() })
      .eq('discord_id', body.guild_id);

    if (error) {
      console.error('Error bumping server:', error);
    }
  } catch (error) {
    console.error('Error in bump command:', error);
  }
}

// Define constants from discord-interactions
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5,
};

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
  MODAL: 9,
};

// Initialize Supabase Admin client for database operations
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
