
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type DiscordBotConnectorProps = {
  serverId?: string;
  onBotConnected?: (data: any) => void;
};

const DiscordBotConnector = ({ serverId, onBotConnected }: DiscordBotConnectorProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);

  // This would be your Discord OAuth application's client ID
  const DISCORD_CLIENT_ID = "YOUR_DISCORD_CLIENT_ID";
  
  // These are the permissions your bot needs
  // 1024 - View server members
  // 8 - Administrator (includes most permissions)
  const PERMISSIONS = "1024";

  const handleConnectBot = () => {
    if (!user) {
      toast({
        title: t('misc.error'),
        description: t('misc.login-required'),
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    
    // Create the OAuth URL
    const redirectUri = encodeURIComponent(window.location.origin + "/auth-callback");
    const state = encodeURIComponent(JSON.stringify({ 
      type: 'bot_auth', 
      serverId: serverId || '' 
    }));
    
    // Discord OAuth2 URL to add a bot to a server
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${PERMISSIONS}&scope=bot&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    
    // Redirect to Discord's OAuth page
    window.location.href = authUrl;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('server.connect-bot')}</CardTitle>
        <CardDescription>
          {t('server.connect-bot-description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('server.important')}</AlertTitle>
          <AlertDescription>
            {t('server.bot-permissions-needed')}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnectBot} 
          disabled={connecting}
          className="w-full"
        >
          <Bot className="mr-2 h-4 w-4" />
          {connecting ? t('server.connecting') : t('server.connect-bot')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DiscordBotConnector;
