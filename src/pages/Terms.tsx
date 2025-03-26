
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{t('legal.terms-of-service')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <h2>1. {t('legal.acceptance')}</h2>
            <p>Durch den Zugriff auf oder die Nutzung unserer Website erklären Sie sich mit diesen Nutzungsbedingungen einverstanden. Wenn Sie mit einem Teil der Bedingungen nicht einverstanden sind, dürfen Sie unsere Website nicht nutzen.</p>
            
            <h2>2. {t('legal.eligibility')}</h2>
            <p>Sie müssen mindestens 16 Jahre alt sein, um unsere Website zu nutzen. Durch die Nutzung unserer Website erklären und garantieren Sie, dass Sie mindestens 16 Jahre alt sind und die volle rechtliche Befugnis haben, die Bedingungen dieser Vereinbarung zu akzeptieren.</p>
            
            <h2>3. {t('legal.user-accounts')}</h2>
            <p>Wenn Sie ein Konto bei uns erstellen, müssen Sie uns genaue, vollständige und aktuelle Informationen zur Verfügung stellen. Die Nichteinhaltung dieser Anforderung stellt einen Verstoß gegen die Nutzungsbedingungen dar, der zur sofortigen Beendigung Ihres Kontos führen kann.</p>
            
            <h2>4. {t('legal.user-content')}</h2>
            <p>Inhalte, die Sie auf unserer Website veröffentlichen, unterliegen unseren Richtlinien und dürfen keine illegalen, beleidigenden, bedrohlichen, diffamierenden, verleumderischen oder anderweitig anstößigen Inhalte enthalten. Wir behalten uns das Recht vor, Inhalte zu entfernen, die gegen diese Richtlinien verstoßen.</p>
            
            <h2>5. {t('legal.prohibited-conduct')}</h2>
            <p>Sie dürfen unsere Website nicht für illegale Zwecke oder zum Verstoß gegen lokale, staatliche, nationale oder internationale Gesetze nutzen. Sie dürfen unsere Website nicht verwenden, um:</p>
            <ul>
              <li>Schadsoftware zu verbreiten</li>
              <li>Informationen illegal zu sammeln</li>
              <li>Andere Nutzer zu belästigen oder zu bedrohen</li>
              <li>Die normale Funktion der Website zu stören</li>
            </ul>
            
            <h2>6. {t('legal.intellectual-property')}</h2>
            <p>Die Website und ihre ursprünglichen Inhalte, Funktionen und Funktionalitäten sind und bleiben das ausschließliche Eigentum von BotSearch GmbH und seinen Lizenzgebern. Die Website ist durch Urheberrecht, Markenrecht und andere Gesetze in Deutschland und im Ausland geschützt.</p>
            
            <h2>7. {t('legal.termination')}</h2>
            <p>Wir können Ihren Zugang zu unserer Website jederzeit aus beliebigem Grund, einschließlich, aber nicht beschränkt auf einen Verstoß gegen diese Nutzungsbedingungen, beenden oder aussetzen.</p>
            
            <h2>8. {t('legal.disclaimer')}</h2>
            <p>Unsere Website und ihre Inhalte werden "wie besehen" und "wie verfügbar" ohne jegliche Garantien bereitgestellt, weder ausdrücklich noch stillschweigend. Wir übernehmen keine Garantie dafür, dass die Website ununterbrochen, pünktlich, sicher oder fehlerfrei sein wird.</p>
            
            <h2>9. {t('legal.limitation-liability')}</h2>
            <p>In keinem Fall haften BotSearch GmbH, seine Direktoren, leitenden Angestellten, Mitarbeiter oder Vertreter für direkte, indirekte, zufällige, besondere oder Folgeschäden, die sich aus der Nutzung oder der Unfähigkeit zur Nutzung dieser Website ergeben.</p>
            
            <h2>10. {t('legal.governing-law')}</h2>
            <p>Diese Bedingungen unterliegen den Gesetzen Deutschlands und werden in Übereinstimmung mit diesen ausgelegt, ohne Berücksichtigung von Kollisionsnormen. Alle Streitigkeiten im Zusammenhang mit diesen Bedingungen unterliegen der ausschließlichen Zuständigkeit der Gerichte in Berlin, Deutschland.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Terms;
