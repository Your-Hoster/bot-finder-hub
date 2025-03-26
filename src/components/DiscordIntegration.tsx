
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, Bot, ExternalLink } from 'lucide-react';

interface DiscordIntegrationProps {
  botInviteUrl?: string;
}

export const DiscordIntegration = ({ botInviteUrl }: DiscordIntegrationProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Default invite URL if none is provided
  const defaultBotInviteUrl = 'https://discord.com/api/oauth2/authorize?client_id=1234567890&permissions=2147485696&scope=bot%20applications.commands';
  const inviteUrl = botInviteUrl || defaultBotInviteUrl;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast({
      title: t('misc.success'),
      description: t('misc.copied'),
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Discord Bot Integration
        </CardTitle>
        <CardDescription>
          Add our Discord bot to your server to enhance your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Available Commands:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
            <li><code>/bump</code> - Bump your server on Bot Finder Hub to increase visibility</li>
            <li><code>/invite</code> - Quickly generate an invite link with custom expiry and usage limits</li>
          </ul>
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium mb-2">Bot Invite URL:</h3>
          <div className="flex">
            <Input 
              value={inviteUrl} 
              readOnly 
              className="flex-1" 
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopyInvite} 
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
            Add to Discord <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
