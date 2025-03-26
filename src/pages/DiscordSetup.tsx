
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiscordBotSetup } from '@/components/DiscordBotSetup';
import { Navigate } from 'react-router-dom';

const DiscordSetup = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  // Only admins should access this page
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t('discord.integration')}</h1>
      <DiscordBotSetup />
    </div>
  );
};

export default DiscordSetup;
