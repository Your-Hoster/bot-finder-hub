
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
}

interface CookieContextType {
  cookieConsent: boolean | null;
  cookieSettings: CookieSettings;
  acceptAllCookies: () => void;
  declineCookies: () => void;
  updateCookieSettings: (settings: Partial<CookieSettings>) => void;
  showCookieSettings: boolean;
  setShowCookieSettings: (show: boolean) => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for cookie consent (true = accepted, false = declined, null = not decided)
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  
  // State for individual cookie settings
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true, // Always true, can't be changed
    analytics: false,
    preferences: false,
    marketing: false,
  });
  
  // State for showing cookie settings modal
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  // Load cookie consent from localStorage on initial render
  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent !== null) {
      setCookieConsent(storedConsent === 'true');
      
      // Also load the cookie settings if they exist
      const storedSettings = localStorage.getItem('cookieSettings');
      if (storedSettings) {
        setCookieSettings(JSON.parse(storedSettings));
      }
    }
  }, []);
  
  // Accept all cookies
  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    
    setCookieConsent(true);
    setCookieSettings(allAccepted);
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookieSettings', JSON.stringify(allAccepted));
    
    toast({
      title: "Cookies accepted",
      description: "Thank you for accepting all cookies.",
    });
  };
  
  // Decline all cookies except necessary ones
  const declineCookies = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    
    setCookieConsent(false);
    setCookieSettings(onlyNecessary);
    localStorage.setItem('cookieConsent', 'false');
    localStorage.setItem('cookieSettings', JSON.stringify(onlyNecessary));
    
    toast({
      title: "Cookies declined",
      description: "Only necessary cookies will be used.",
    });
  };
  
  // Update individual cookie settings
  const updateCookieSettings = (settings: Partial<CookieSettings>) => {
    const newSettings = { ...cookieSettings, ...settings };
    
    // Necessary cookies are always true
    newSettings.necessary = true;
    
    setCookieConsent(true);
    setCookieSettings(newSettings);
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookieSettings', JSON.stringify(newSettings));
    
    toast({
      title: "Cookie preferences saved",
      description: "Your cookie preferences have been updated.",
    });
  };
  
  return (
    <CookieContext.Provider 
      value={{ 
        cookieConsent, 
        cookieSettings, 
        acceptAllCookies, 
        declineCookies, 
        updateCookieSettings,
        showCookieSettings,
        setShowCookieSettings
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};
