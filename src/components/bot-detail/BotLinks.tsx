
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, Globe, Github } from 'lucide-react';

type BotLinksProps = {
  inviteUrl: string | null;
  supportUrl: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
};

const BotLinks = ({ inviteUrl, supportUrl, websiteUrl, githubUrl }: BotLinksProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inviteUrl && (
        <Button className="w-full" asChild>
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
            {t('bot.invite')}
          </a>
        </Button>
      )}
      
      {supportUrl && (
        <Button variant="outline" className="w-full" asChild>
          <a href={supportUrl} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('bot.support')}
          </a>
        </Button>
      )}
      
      {websiteUrl && (
        <Button variant="outline" className="w-full" asChild>
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
            <Globe className="mr-2 h-4 w-4" />
            {t('bot.website')}
          </a>
        </Button>
      )}
      
      {githubUrl && (
        <Button variant="outline" className="w-full" asChild>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            {t('bot.github')}
          </a>
        </Button>
      )}
    </div>
  );
};

export default BotLinks;
