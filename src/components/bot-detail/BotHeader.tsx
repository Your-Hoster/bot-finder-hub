
import { Bot } from '@/types/bot';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

type BotHeaderProps = {
  bot: Bot;
  isOwner: boolean;
};

const BotHeader = ({ bot, isOwner }: BotHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-row items-start gap-6">
      <Avatar className="h-24 w-24 border-2 border-primary">
        <AvatarImage src={bot?.image_url || ''} alt={bot?.name} />
        <AvatarFallback className="text-2xl">{bot?.name?.substring(0, 2)}</AvatarFallback>
      </Avatar>
      
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl">{bot?.name}</CardTitle>
            <CardDescription className="text-lg">{bot?.short_description}</CardDescription>
          </div>
          
          {isOwner && (
            <Button variant="outline" asChild>
              <Link to={`/bot/${bot?.id}/edit`}>{t('bot.edit')}</Link>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            {bot?.stars || 0} {t('bot.stars')}
          </div>
          
          <div>
            {t('bot.prefix')}: <span className="font-mono bg-muted px-1 rounded">{bot?.prefix || '/'}</span>
          </div>
          
          {bot?.verified && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {t('bot.verified')}
            </Badge>
          )}
        </div>
        
        {bot?.tags && bot.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bot.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotHeader;
