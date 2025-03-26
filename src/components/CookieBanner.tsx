
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCookies } from '@/contexts/CookieContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';

export const CookieBanner = () => {
  const { cookieConsent, cookieSettings, acceptAllCookies, declineCookies, updateCookieSettings, showCookieSettings, setShowCookieSettings } = useCookies();
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  
  // Only show the banner if cookieConsent is null (not decided yet)
  useEffect(() => {
    if (cookieConsent === null) {
      // Slight delay to prevent banner from showing immediately on page load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [cookieConsent]);
  
  const handleSavePreferences = () => {
    updateCookieSettings({
      analytics: cookieSettings.analytics,
      preferences: cookieSettings.preferences,
      marketing: cookieSettings.marketing,
    });
    setShowCookieSettings(false);
  };
  
  return (
    <>
      {/* Cookie Settings Dialog */}
      <Dialog open={showCookieSettings} onOpenChange={setShowCookieSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('cookie.title')}</DialogTitle>
            <DialogDescription>
              {t('cookie.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3 pb-4 border-b">
              <Checkbox id="necessary" checked disabled />
              <div className="grid gap-1.5">
                <Label htmlFor="necessary" className="font-medium">
                  {t('cookie.necessary')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookie.necessary_description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-4 border-b">
              <Checkbox 
                id="analytics" 
                checked={cookieSettings.analytics} 
                onCheckedChange={(checked) => 
                  updateCookieSettings({ analytics: checked === true })
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="analytics" className="font-medium">
                  {t('cookie.analytics')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookie.analytics_description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-4 border-b">
              <Checkbox 
                id="preferences" 
                checked={cookieSettings.preferences} 
                onCheckedChange={(checked) => 
                  updateCookieSettings({ preferences: checked === true })
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="preferences" className="font-medium">
                  {t('cookie.preferences')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookie.preferences_description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="marketing" 
                checked={cookieSettings.marketing} 
                onCheckedChange={(checked) => 
                  updateCookieSettings({ marketing: checked === true })
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="marketing" className="font-medium">
                  {t('cookie.marketing')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookie.marketing_description')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCookieSettings(false)}>
              {t('misc.cancel')}
            </Button>
            <Button onClick={handleSavePreferences}>
              {t('cookie.save_preferences')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-0 right-0 mx-auto max-w-md z-50 px-4"
          >
            <Card className="shadow-xl border-primary/10 glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('cookie.title')}</CardTitle>
                <CardDescription>
                  {t('cookie.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  {t('cookie.customize_notice')}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCookieSettings(true)}
                  className="w-full sm:w-auto order-3 sm:order-1"
                >
                  {t('cookie.preferences')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={declineCookies}
                  className="w-full sm:w-auto order-2"
                >
                  {t('cookie.decline')}
                </Button>
                <Button 
                  size="sm" 
                  onClick={acceptAllCookies}
                  className="w-full sm:w-auto order-1 sm:order-3"
                >
                  {t('cookie.accept')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
