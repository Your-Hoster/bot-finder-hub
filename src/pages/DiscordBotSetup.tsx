import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Check, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscordBotSetup = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    
    toast({
      title: t('misc.success'),
      description: t('misc.copied'),
      duration: 2000,
    });
    
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Discord Bot Setup</h1>
      <p className="text-muted-foreground mb-8">
        Follow these instructions to set up and configure your Discord bot for integration with Bot Finder Hub.
      </p>
      
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="setup">Bot Setup</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="integration">Website Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                You'll need to create a Discord application and bot to use with Bot Finder Hub. Follow the steps below to get started.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Create a Discord Application</CardTitle>
                  <CardDescription>
                    Create a new application on the Discord Developer Portal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord Developer Portal</a></li>
                    <li>Click on "New Application" and give it a name</li>
                    <li>Save your application's Client ID (you'll need it later)</li>
                    <li>Navigate to the "Bot" tab</li>
                    <li>Click "Add Bot" and confirm</li>
                    <li>Under the Token section, click "Reset Token" to generate a new bot token</li>
                    <li>Save your Bot Token securely (you'll need it later)</li>
                  </ol>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer">
                      Discord Developer Portal
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Configure Bot Permissions</CardTitle>
                  <CardDescription>
                    Set the necessary permissions for your bot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Your bot needs the following permissions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Read Messages/View Channels</li>
                    <li>Send Messages</li>
                    <li>Create Invite</li>
                    <li>Manage Server (for some advanced features)</li>
                    <li>Application Commands (for slash commands)</li>
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    You can configure these on the Bot page in the Discord Developer Portal, or use the OAuth2 URL Generator.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Register Commands</CardTitle>
                  <CardDescription>
                    Set up slash commands for your bot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Your bot needs to register slash commands. You can use our edge function to handle this automatically.
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    Make sure to set your environment variables (DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, etc.) in the Supabase dashboard.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to="/admin">
                      Go to Admin Panel
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Step 4: Add Bot to Your Server</CardTitle>
                  <CardDescription>
                    Create an invite link and add your bot to your Discord server
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Use the OAuth2 URL Generator in the Discord Developer Portal to create an invite link:
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Go to OAuth2 → URL Generator</li>
                    <li>Select scopes: <strong>bot</strong> and <strong>applications.commands</strong></li>
                    <li>Select the bot permissions from Step 2</li>
                    <li>Copy the generated URL and open it in your browser</li>
                    <li>Select your server and authorize the bot</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="commands">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Commands</CardTitle>
                <CardDescription>
                  Your bot comes with these built-in commands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <code>/bump</code>
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Bump your server on Bot Finder Hub to increase its visibility in listings.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <code>
                      /bump
                    </code>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <code>/invite</code>
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Generate a new invite link for your server with custom expiry and usage limits.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm space-y-2">
                    <div><code>/invite</code> - Creates an invite with default settings (24 hour expiry, unlimited uses)</div>
                    <div><code>/invite expiry:48</code> - Creates an invite that expires in 48 hours</div>
                    <div><code>/invite uses:5</code> - Creates an invite limited to 5 uses</div>
                    <div><code>/invite expiry:12 uses:10</code> - Creates an invite that expires in 12 hours and is limited to 10 uses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="integration">
          <div className="space-y-6">
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Keep your bot token and application secrets secure. Never share them publicly or commit them to version control.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Set these environment variables in your Supabase project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">DISCORD_BOT_TOKEN</label>
                    <div className="flex">
                      <Input type="password" value="••••••••••••••••••••••" readOnly className="flex-1" />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleCopy("Set your actual token in Supabase Edge Function secrets", "bot_token")} 
                        className="ml-2"
                      >
                        {copied === "bot_token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Discord bot token from the Discord Developer Portal
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">DISCORD_APPLICATION_ID</label>
                    <div className="flex">
                      <Input value="123456789012345678" readOnly className="flex-1" />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleCopy("Set your actual application ID in Supabase Edge Function secrets", "app_id")} 
                        className="ml-2"
                      >
                        {copied === "app_id" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Discord application ID from the Discord Developer Portal
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">DISCORD_PUBLIC_KEY</label>
                    <div className="flex">
                      <Input value="abcdef123456789..." readOnly className="flex-1" />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleCopy("Set your actual public key in Supabase Edge Function secrets", "public_key")} 
                        className="ml-2"
                      >
                        {copied === "public_key" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Discord application public key from the Discord Developer Portal
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a href="https://supabase.com/dashboard/project/mecnawqhmoduwpchgbee/settings/functions" target="_blank" rel="noopener noreferrer">
                    Set Edge Function Secrets
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Test Your Bot</CardTitle>
                <CardDescription>
                  Verify that your bot is working correctly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Ensure your bot is added to your Discord server</li>
                  <li>Try running the <code>/bump</code> command in your server</li>
                  <li>Try running the <code>/invite</code> command in your server</li>
                  <li>Check the logs in Supabase Edge Functions for any errors</li>
                </ol>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a href="https://supabase.com/dashboard/project/mecnawqhmoduwpchgbee/functions/discord-bot/logs" target="_blank" rel="noopener noreferrer">
                    View Function Logs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscordBotSetup;
