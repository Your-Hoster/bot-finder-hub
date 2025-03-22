
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
              {t('legal.company-name') || "Discord Bot Directory"}<br />
              {t('legal.company-address') || "123 Bot Street"}<br />
              {t('legal.company-city') || "Bot City, 10115"}<br />
              {t('legal.company-country') || "Botland"}
            </p>
            
            <h2>{t('legal.contact')}</h2>
            <p>
              {t('legal.email')}: contact@example.com<br />
              {t('legal.phone')}: +1 234 567 890
            </p>
            
            <h2>{t('legal.registration')}</h2>
            <p>
              {t('legal.registration-text') || 
                "Registered in the Commercial Register of Bot City. Registration Number: BOT123456"}
            </p>
            
            <h2>{t('legal.vat')}</h2>
            <p>
              {t('legal.vat-text') || 
                "VAT Identification Number according to § 27a of the Value Added Tax Act: DE123456789"}
            </p>
            
            <h2>{t('legal.responsible-content')}</h2>
            <p>
              {t('legal.responsible-content-text') || 
                "Person responsible for content in accordance with § 55 Abs. 2 RStV: John Doe, 123 Bot Street, Bot City, 10115 Botland"}
            </p>
            
            <h2>{t('legal.dispute-resolution')}</h2>
            <p>
              {t('legal.dispute-resolution-text') || 
                "The European Commission provides a platform for online dispute resolution (OS): https://ec.europa.eu/consumers/odr. We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Imprint;
