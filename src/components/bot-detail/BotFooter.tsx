
import { useLanguage } from '@/contexts/LanguageContext';

type BotFooterProps = {
  username: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const BotFooter = ({ username, createdAt, updatedAt }: BotFooterProps) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('misc.unknown');
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border-t pt-6 flex flex-col items-start gap-2">
      <div className="text-sm text-muted-foreground">
        {t('bot.owner')}: <span className="font-medium">{username || t('bot.unknown')}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {t('bot.created')}: {formatDate(createdAt)}
      </div>
      <div className="text-sm text-muted-foreground">
        {t('bot.updated')}: {formatDate(updatedAt)}
      </div>
    </div>
  );
};

export default BotFooter;
