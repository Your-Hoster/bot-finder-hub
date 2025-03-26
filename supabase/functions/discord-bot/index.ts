
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  InteractionType, 
  InteractionResponseType,
  verifyKey
} from "https://deno.land/x/discord_interactions@v0.4.0/mod.ts";

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
    const isValid = verifyKey(
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

async function handleBumpCommand(body: any) {
  try {
    // Update the server's bumped time in our database
    const { data: { session } } = await supabaseAdmin.auth.getSession();
    
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

// Initialize Supabase Admin client for database operations
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);
