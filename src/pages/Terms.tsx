
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
            <p>{t('legal.terms-acceptance-text')}</p>
            
            <h2>2. {t('legal.eligibility')}</h2>
            <p>{t('legal.eligibility-text')}</p>
            
            <h2>3. {t('legal.user-accounts')}</h2>
            <p>{t('legal.user-accounts-text')}</p>
            
            <h2>4. {t('legal.user-content')}</h2>
            <p>{t('legal.user-content-text')}</p>
            
            <h2>5. {t('legal.prohibited-conduct')}</h2>
            <p>{t('legal.prohibited-conduct-text')}</p>
            
            <h2>6. {t('legal.intellectual-property')}</h2>
            <p>{t('legal.intellectual-property-text')}</p>
            
            <h2>7. {t('legal.termination')}</h2>
            <p>{t('legal.termination-text')}</p>
            
            <h2>8. {t('legal.disclaimer')}</h2>
            <p>{t('legal.disclaimer-text')}</p>
            
            <h2>9. {t('legal.limitation-liability')}</h2>
            <p>{t('legal.limitation-liability-text')}</p>
            
            <h2>10. {t('legal.governing-law')}</h2>
            <p>{t('legal.governing-law-text')}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Terms;
