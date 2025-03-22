
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
            <p>
              {t('legal.terms-acceptance-text') || 
                "By accessing and using this Discord Bot Directory, you accept and agree to be bound by the terms and provisions of this agreement."}
            </p>
            
            <h2>2. {t('legal.eligibility')}</h2>
            <p>
              {t('legal.eligibility-text') || 
                "To use our services, you must be at least 13 years of age and comply with Discord's Terms of Service."}
            </p>
            
            <h2>3. {t('legal.user-accounts')}</h2>
            <p>
              {t('legal.user-accounts-text') || 
                "Users are responsible for maintaining the security of their account and password. The platform cannot and will not be liable for any loss or damage from your failure to comply with this security obligation."}
            </p>
            
            <h2>4. {t('legal.user-content')}</h2>
            <p>
              {t('legal.user-content-text') || 
                "You are responsible for all content and activity that occurs under your account. Harmful or abusive content is strictly prohibited."}
            </p>
            
            <h2>5. {t('legal.prohibited-conduct')}</h2>
            <p>
              {t('legal.prohibited-conduct-text') || 
                "Users may not engage in any activity that interferes with or disrupts the services or servers connected to the platform."}
            </p>
            
            <h2>6. {t('legal.intellectual-property')}</h2>
            <p>
              {t('legal.intellectual-property-text') || 
                "The service and its original content, features, and functionality are owned by the platform and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws."}
            </p>
            
            <h2>7. {t('legal.termination')}</h2>
            <p>
              {t('legal.termination-text') || 
                "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation."}
            </p>
            
            <h2>8. {t('legal.disclaimer')}</h2>
            <p>
              {t('legal.disclaimer-text') || 
                "Your use of the service is at your sole risk. The service is provided on an \"AS IS\" and \"AS AVAILABLE\" basis without any warranty of any kind."}
            </p>
            
            <h2>9. {t('legal.limitation-liability')}</h2>
            <p>
              {t('legal.limitation-liability-text') || 
                "In no event shall the platform, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages."}
            </p>
            
            <h2>10. {t('legal.governing-law')}</h2>
            <p>
              {t('legal.governing-law-text') || 
                "These Terms shall be governed and construed in accordance with the laws applicable in the jurisdiction where the platform is registered."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Terms;
