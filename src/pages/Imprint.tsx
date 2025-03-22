
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
              {t('legal.company-name')}<br />
              {t('legal.company-address')}<br />
              {t('legal.company-city')}<br />
              {t('legal.company-country')}
            </p>
            
            <h2>{t('legal.contact')}</h2>
            <p>
              {t('legal.email')}: contact@example.com<br />
              {t('legal.phone')}: +1 234 567 890
            </p>
            
            <h2>{t('legal.registration')}</h2>
            <p>
              {t('legal.registration-text')}
            </p>
            
            <h2>{t('legal.vat')}</h2>
            <p>
              {t('legal.vat-text')}
            </p>
            
            <h2>{t('legal.responsible-content')}</h2>
            <p>
              {t('legal.responsible-content-text')}
            </p>
            
            <h2>{t('legal.dispute-resolution')}</h2>
            <p>
              {t('legal.dispute-resolution-text')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Imprint;
