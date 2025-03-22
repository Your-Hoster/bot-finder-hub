
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
              {t('legal.information-collection-text') || 
                "We collect information you provide directly to us when registering for an account, adding bots, or interacting with our platform. This includes email addresses, usernames, and Discord IDs."}
            </p>
            
            <h2>2. {t('legal.information-usage')}</h2>
            <p>
              {t('legal.information-usage-text') || 
                "We use information about you to provide, maintain, and improve our services, develop new features, and protect the platform and our users."}
            </p>
            
            <h2>3. {t('legal.information-protection')}</h2>
            <p>
              {t('legal.information-protection-text') || 
                "We implement measures designed to ensure the security of your personal information. However, no method of transmission over the Internet is 100% secure."}
            </p>
            
            <h2>4. {t('legal.cookie-usage')}</h2>
            <p>
              {t('legal.cookie-usage-text') || 
                "We use cookies and similar technologies to collect information about how you interact with our services and to remember certain preferences."}
            </p>
            
            <h2>5. {t('legal.third-party-disclosure')}</h2>
            <p>
              {t('legal.third-party-disclosure-text') || 
                "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent."}
            </p>
            
            <h2>6. {t('legal.third-party-links')}</h2>
            <p>
              {t('legal.third-party-links-text') || 
                "Our service may contain links to third-party websites or services. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services."}
            </p>
            
            <h2>7. {t('legal.gdpr-compliance')}</h2>
            <p>
              {t('legal.gdpr-compliance-text') || 
                "For users in the European Union, we provide rights regarding your personal data, including the right to access, correct, or delete your personal information."}
            </p>
            
            <h2>8. {t('legal.childrens-privacy')}</h2>
            <p>
              {t('legal.childrens-privacy-text') || 
                "Our services are not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13."}
            </p>
            
            <h2>9. {t('legal.changes-to-policy')}</h2>
            <p>
              {t('legal.changes-to-policy-text') || 
                "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page."}
            </p>
            
            <h2>10. {t('legal.contact-us')}</h2>
            <p>
              {t('legal.contact-us-text') || 
                "If you have any questions about this Privacy Policy, please contact us through the platform or via the provided contact information."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Privacy;
