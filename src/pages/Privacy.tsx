
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
            <p>
              {t('legal.information-collection-text')}
            </p>
            
            <h2>2. {t('legal.information-usage')}</h2>
            <p>
              {t('legal.information-usage-text')}
            </p>
            
            <h2>3. {t('legal.information-protection')}</h2>
            <p>
              {t('legal.information-protection-text')}
            </p>
            
            <h2>4. {t('legal.cookie-usage')}</h2>
            <p>
              {t('legal.cookie-usage-text')}
            </p>
            
            <h2>5. {t('legal.third-party-disclosure')}</h2>
            <p>
              {t('legal.third-party-disclosure-text')}
            </p>
            
            <h2>6. {t('legal.third-party-links')}</h2>
            <p>
              {t('legal.third-party-links-text')}
            </p>
            
            <h2>7. {t('legal.gdpr-compliance')}</h2>
            <p>
              {t('legal.gdpr-compliance-text')}
            </p>
            
            <h2>8. {t('legal.childrens-privacy')}</h2>
            <p>
              {t('legal.childrens-privacy-text')}
            </p>
            
            <h2>9. {t('legal.changes-to-policy')}</h2>
            <p>
              {t('legal.changes-to-policy-text')}
            </p>
            
            <h2>10. {t('legal.contact-us')}</h2>
            <p>
              {t('legal.contact-us-text')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Privacy;
