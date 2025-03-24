
import { useLanguage } from '@/contexts/LanguageContext';

type BotDescriptionProps = {
  description: string | null;
  shortDescription: string | null;
};

const BotDescription = ({ description, shortDescription }: BotDescriptionProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{t('bot.description')}</h3>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {description || shortDescription || t('bot.no-description')}
      </div>
    </div>
  );
};

export default BotDescription;
