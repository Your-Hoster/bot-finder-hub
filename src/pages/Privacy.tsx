
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
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
            <CardTitle className="text-3xl">{t('legal.privacy-policy')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <h2>1. {t('legal.information-collection')}</h2>
            <p>Beim Besuch unserer Website erheben wir automatisch bestimmte Informationen über Ihr Gerät, einschließlich Informationen über Ihren Webbrowser, IP-Adresse, Zeitzone und einige der auf Ihrem Gerät installierten Cookies. Darüber hinaus erfassen wir beim Durchsuchen unserer Website Informationen über die einzelnen Webseiten oder Produkte, die Sie anzeigen, welche Websites oder Suchbegriffe Sie auf unsere Website verwiesen haben und wie Sie mit der Website interagieren.</p>
            
            <h2>2. {t('legal.information-usage')}</h2>
            <p>Wir verwenden die gesammelten Informationen, um:</p>
            <ul>
              <li>Unsere Website zu betreiben und zu pflegen</li>
              <li>Unsere Website zu verbessern, zu personalisieren und zu erweitern</li>
              <li>Zu verstehen und zu analysieren, wie Sie unsere Website nutzen</li>
              <li>Neue Produkte, Dienste, Funktionen und Funktionalitäten zu entwickeln</li>
              <li>Mit Ihnen zu kommunizieren, entweder direkt oder über einen unserer Partner, auch für den Kundendienst</li>
              <li>Ihnen Aktualisierungen und andere Informationen im Zusammenhang mit der Website zu senden</li>
              <li>Betrügerische Aktivitäten zu erkennen und zu verhindern</li>
            </ul>
            
            <h2>3. {t('legal.information-protection')}</h2>
            <p>Wir setzen angemessene Sicherheitsmaßnahmen ein, um persönliche Informationen vor Verlust, Missbrauch und unbefugtem Zugriff, Offenlegung, Änderung oder Zerstörung zu schützen. Jedoch können keine Übertragungsmethoden über das Internet oder elektronische Speichermethoden zu 100% sicher sein. Daher können wir ihre absolute Sicherheit nicht garantieren.</p>
            
            <h2>4. {t('legal.cookie-usage')}</h2>
            <p>Wir verwenden Cookies und ähnliche Tracking-Technologien, um Ihre Browsing-Aktivitäten auf unserer Website zu verfolgen und bestimmte Informationen zu speichern. Cookies sind Dateien mit geringen Datenmengen, die möglicherweise eine anonyme eindeutige Kennung enthalten. Cookies werden von einer Website an Ihren Browser gesendet und auf Ihrem Gerät gespeichert. Sie können Ihren Browser anweisen, alle Cookies abzulehnen oder anzuzeigen, wann ein Cookie gesendet wird. Wenn Sie jedoch keine Cookies akzeptieren, können Sie möglicherweise einige Teile unserer Website nicht nutzen.</p>
            
            <h2>5. {t('legal.third-party-disclosure')}</h2>
            <p>Wir verkaufen, handeln oder übertragen Ihre persönlich identifizierbaren Informationen nicht an externe Parteien. Dies schließt nicht vertrauenswürdige Dritte ein, die uns beim Betrieb unserer Website, der Durchführung unseres Geschäfts oder der Bereitstellung von Diensten für Sie unterstützen, solange diese Parteien zustimmen, diese Informationen vertraulich zu behandeln.</p>
            
            <h2>6. {t('legal.third-party-links')}</h2>
            <p>Unsere Website kann Links zu externen Websites enthalten. Wir haben keine Kontrolle über den Inhalt und die Praktiken dieser Websites und können keine Verantwortung für deren jeweilige Datenschutzrichtlinien übernehmen.</p>
            
            <h2>7. {t('legal.gdpr-compliance')}</h2>
            <p>Wir verarbeiten Ihre Daten in Übereinstimmung mit der Datenschutz-Grundverordnung (DSGVO). Sie haben das Recht, auf Ihre personenbezogenen Daten zuzugreifen, diese zu korrigieren, zu löschen oder deren Verarbeitung einzuschränken. Sie haben auch das Recht, der Verarbeitung Ihrer Daten zu widersprechen und das Recht auf Datenübertragbarkeit.</p>
            
            <h2>8. {t('legal.childrens-privacy')}</h2>
            <p>Unsere Website richtet sich nicht an Personen unter 16 Jahren. Wir sammeln nicht wissentlich personenbezogene Daten von Kindern unter 16 Jahren. Wenn Sie ein Elternteil oder Vormund sind und wissen, dass Ihr Kind uns personenbezogene Daten zur Verfügung gestellt hat, kontaktieren Sie uns bitte.</p>
            
            <h2>9. {t('legal.changes-to-policy')}</h2>
            <p>Wir können unsere Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über Änderungen informieren, indem wir die neue Datenschutzrichtlinie auf dieser Seite veröffentlichen. Änderungen treten in Kraft, sobald sie auf dieser Seite veröffentlicht wurden.</p>
            
            <h2>10. {t('legal.contact-us')}</h2>
            <p>Wenn Sie Fragen zu unserer Datenschutzrichtlinie haben, kontaktieren Sie uns bitte unter: datenschutz@botsearch.example.com</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Privacy;
