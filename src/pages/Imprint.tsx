
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Imprint = () => {
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
            <CardTitle className="text-3xl">{t('legal.imprint')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <h2>{t('legal.company-information')}</h2>
            <p>
              BotSearch GmbH<br />
              Musterstraße 123<br />
              10115 Berlin<br />
              Deutschland
            </p>
            
            <h2>{t('legal.contact')}</h2>
            <p>
              {t('legal.email')}: contact@botsearch.example.com<br />
              {t('legal.phone')}: +49 30 123456789
            </p>
            
            <h2>{t('legal.registration')}</h2>
            <p>Handelsregister: Amtsgericht Berlin-Charlottenburg<br />
            Registernummer: HRB 123456</p>
            
            <h2>{t('legal.vat')}</h2>
            <p>USt-IdNr.: DE123456789</p>
            
            <h2>{t('legal.responsible-content')}</h2>
            <p>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br />
            Max Mustermann<br />
            Musterstraße 123<br />
            10115 Berlin</p>
            
            <h2>{t('legal.dispute-resolution')}</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a> finden. Wir sind nicht bereit und nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Imprint;
