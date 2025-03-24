
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BotNotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-12 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">{t('bot.not-found')}</h2>
      <p className="text-muted-foreground mb-8">{t('bot.not-found-description')}</p>
      <Button asChild>
        <Link to="/bots">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('misc.back')}
        </Link>
      </Button>
    </div>
  );
};

export default BotNotFound;
