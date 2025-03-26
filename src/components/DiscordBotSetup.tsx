
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bot, Zap } from 'lucide-react';

export const DiscordBotSetup = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [botInviteUrl, setBotInviteUrl] = useState('');
  const [commandsUrl, setCommandsUrl] = useState('');

  const generateBotInviteUrl = () => {
    // Replace this with your actual Discord application ID once available
    const applicationId = import.meta.env.VITE_DISCORD_APPLICATION_ID || 'YOUR_DISCORD_APPLICATION_ID';
    
    // Required permissions for the bot to function
    const permissions = '2147486720'; // Includes sending messages, creating invites, etc.
    
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${applicationId}&permissions=${permissions}&scope=bot%20applications.commands`;
    
    setBotInviteUrl(inviteUrl);
    
    toast({
      title: t('discord.invite-generated'),
      description: t('discord.invite-desc'),
    });
  };

  const setupSlashCommands = () => {
    // In a production environment, this would be an API call to register commands
    setCommandsUrl('/api/discord/register-commands');
    
    toast({
      title: t('discord.commands-setup'),
      description: t('discord.commands-desc'),
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          {t('discord.bot-setup')}
        </CardTitle>
        <CardDescription>
          {t('discord.bot-desc')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertTitle>{t('discord.quick-setup')}</AlertTitle>
          <AlertDescription>
            {t('discord.setup-instructions')}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-url">{t('discord.invite-url')}</Label>
            <div className="flex gap-2">
              <Input 
                id="invite-url" 
                value={botInviteUrl} 
                readOnly 
                placeholder={t('discord.invite-placeholder')} 
              />
              <Button onClick={generateBotInviteUrl}>
                {t('discord.generate')}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="commands-url">{t('discord.commands-endpoint')}</Label>
            <div className="flex gap-2">
              <Input 
                id="commands-url" 
                value={commandsUrl} 
                readOnly 
                placeholder={t('discord.commands-placeholder')} 
              />
              <Button onClick={setupSlashCommands}>
                {t('discord.setup-commands')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col items-start gap-2">
        <h3 className="text-sm font-medium">{t('discord.available-commands')}</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><code>/bump</code> - {t('discord.bump-desc')}</li>
          <li><code>/invite</code> - {t('discord.invite-cmd-desc')}</li>
        </ul>
      </CardFooter>
    </Card>
  );
};
