
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the supported languages
export type Language = 'en' | 'de' | 'es';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.bots': 'Bots',
    'nav.add-bot': 'Add Bot',
    'nav.admin': 'Admin',
    'nav.profile': 'Profile',
    'nav.login': 'Log In',
    'nav.register': 'Register',
    'nav.logout': 'Log Out',
    'nav.search': 'Search',
    
    // Home page
    'home.title': 'Discover Discord Bots',
    'home.subtitle': 'Find the perfect bot for your Discord server',
    'home.search-placeholder': 'Search by name, category, or feature',
    'home.explore': 'Explore Bots',
    'home.popular': 'Popular Bots',
    'home.recent': 'Recently Added',
    'home.featured': 'Featured Bots',
    
    // Auth
    'auth.login': 'Log In',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm-password': 'Confirm Password',
    'auth.username': 'Username',
    'auth.forgot-password': 'Forgot Password?',
    'auth.already-account': 'Already have an account?',
    'auth.no-account': 'Don\'t have an account?',
    'auth.or': 'or',
    
    // Bot details
    'bot.add': 'Add Bot',
    'bot.edit': 'Edit Bot',
    'bot.delete': 'Delete Bot',
    'bot.name': 'Bot Name',
    'bot.description': 'Description',
    'bot.id': 'Bot ID',
    'bot.prefix': 'Prefix',
    'bot.category': 'Category',
    'bot.website': 'Website',
    'bot.invite': 'Invite Link',
    'bot.support': 'Support Server',
    'bot.github': 'GitHub Repository',
    'bot.tags': 'Tags',
    'bot.save': 'Save Bot',
    'bot.cancel': 'Cancel',
    'bot.owner': 'Owner',
    'bot.created': 'Created',
    'bot.updated': 'Updated',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.users': 'Users',
    'admin.bots': 'Bots',
    'admin.reports': 'Reports',
    'admin.settings': 'Settings',
    
    // Footer
    'footer.privacy': 'Privacy Policy',
    'footer.imprint': 'Imprint',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.language': 'Language',
    
    // Misc
    'misc.loading': 'Loading...',
    'misc.error': 'An error occurred',
    'misc.success': 'Success!',
    'misc.search': 'Search',
    'misc.save': 'Save',
    'misc.cancel': 'Cancel',
    'misc.delete': 'Delete',
    'misc.edit': 'Edit',
    'misc.view': 'View',
    'misc.create': 'Create',
    'misc.submit': 'Submit',
    'misc.back': 'Back',
    'misc.next': 'Next',
    'misc.previous': 'Previous',
    
    // Cookie banner
    'cookie.title': 'Cookie Notice',
    'cookie.description': 'We use cookies to ensure you get the best experience on our website.',
    'cookie.accept': 'Accept All',
    'cookie.decline': 'Decline',
    'cookie.preferences': 'Customize',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.bots': 'My Bots',
    'profile.settings': 'Settings',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.bots': 'Bots',
    'nav.add-bot': 'Bot hinzufügen',
    'nav.admin': 'Admin',
    'nav.profile': 'Profil',
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    'nav.logout': 'Abmelden',
    'nav.search': 'Suchen',
    
    // Home page
    'home.title': 'Entdecke Discord Bots',
    'home.subtitle': 'Finde den perfekten Bot für deinen Discord-Server',
    'home.search-placeholder': 'Suche nach Name, Kategorie oder Funktion',
    'home.explore': 'Bots erkunden',
    'home.popular': 'Beliebte Bots',
    'home.recent': 'Kürzlich hinzugefügt',
    'home.featured': 'Empfohlene Bots',
    
    // Auth
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirm-password': 'Passwort bestätigen',
    'auth.username': 'Benutzername',
    'auth.forgot-password': 'Passwort vergessen?',
    'auth.already-account': 'Bereits ein Konto?',
    'auth.no-account': 'Noch kein Konto?',
    'auth.or': 'oder',
    
    // Bot details
    'bot.add': 'Bot hinzufügen',
    'bot.edit': 'Bot bearbeiten',
    'bot.delete': 'Bot löschen',
    'bot.name': 'Bot-Name',
    'bot.description': 'Beschreibung',
    'bot.id': 'Bot-ID',
    'bot.prefix': 'Präfix',
    'bot.category': 'Kategorie',
    'bot.website': 'Webseite',
    'bot.invite': 'Einladungslink',
    'bot.support': 'Support-Server',
    'bot.github': 'GitHub-Repository',
    'bot.tags': 'Tags',
    'bot.save': 'Bot speichern',
    'bot.cancel': 'Abbrechen',
    'bot.owner': 'Besitzer',
    'bot.created': 'Erstellt',
    'bot.updated': 'Aktualisiert',
    
    // Admin
    'admin.title': 'Admin-Panel',
    'admin.users': 'Benutzer',
    'admin.bots': 'Bots',
    'admin.reports': 'Meldungen',
    'admin.settings': 'Einstellungen',
    
    // Footer
    'footer.privacy': 'Datenschutz',
    'footer.imprint': 'Impressum',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.contact': 'Kontakt',
    'footer.language': 'Sprache',
    
    // Misc
    'misc.loading': 'Wird geladen...',
    'misc.error': 'Ein Fehler ist aufgetreten',
    'misc.success': 'Erfolg!',
    'misc.search': 'Suchen',
    'misc.save': 'Speichern',
    'misc.cancel': 'Abbrechen',
    'misc.delete': 'Löschen',
    'misc.edit': 'Bearbeiten',
    'misc.view': 'Ansehen',
    'misc.create': 'Erstellen',
    'misc.submit': 'Senden',
    'misc.back': 'Zurück',
    'misc.next': 'Weiter',
    'misc.previous': 'Zurück',
    
    // Cookie banner
    'cookie.title': 'Cookie-Hinweis',
    'cookie.description': 'Wir verwenden Cookies, um sicherzustellen, dass Sie die beste Erfahrung auf unserer Website haben.',
    'cookie.accept': 'Alle akzeptieren',
    'cookie.decline': 'Ablehnen',
    'cookie.preferences': 'Anpassen',
    
    // Profile
    'profile.title': 'Profil',
    'profile.edit': 'Profil bearbeiten',
    'profile.bots': 'Meine Bots',
    'profile.settings': 'Einstellungen',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.bots': 'Bots',
    'nav.add-bot': 'Añadir Bot',
    'nav.admin': 'Admin',
    'nav.profile': 'Perfil',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'nav.search': 'Buscar',
    
    // Home page
    'home.title': 'Descubre Bots de Discord',
    'home.subtitle': 'Encuentra el bot perfecto para tu servidor de Discord',
    'home.search-placeholder': 'Buscar por nombre, categoría o función',
    'home.explore': 'Explorar Bots',
    'home.popular': 'Bots Populares',
    'home.recent': 'Añadidos Recientemente',
    'home.featured': 'Bots Destacados',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirm-password': 'Confirmar Contraseña',
    'auth.username': 'Nombre de Usuario',
    'auth.forgot-password': '¿Olvidaste tu contraseña?',
    'auth.already-account': '¿Ya tienes una cuenta?',
    'auth.no-account': '¿No tienes una cuenta?',
    'auth.or': 'o',
    
    // Bot details
    'bot.add': 'Añadir Bot',
    'bot.edit': 'Editar Bot',
    'bot.delete': 'Eliminar Bot',
    'bot.name': 'Nombre del Bot',
    'bot.description': 'Descripción',
    'bot.id': 'ID del Bot',
    'bot.prefix': 'Prefijo',
    'bot.category': 'Categoría',
    'bot.website': 'Sitio Web',
    'bot.invite': 'Enlace de Invitación',
    'bot.support': 'Servidor de Soporte',
    'bot.github': 'Repositorio GitHub',
    'bot.tags': 'Etiquetas',
    'bot.save': 'Guardar Bot',
    'bot.cancel': 'Cancelar',
    'bot.owner': 'Propietario',
    'bot.created': 'Creado',
    'bot.updated': 'Actualizado',
    
    // Admin
    'admin.title': 'Panel de Administración',
    'admin.users': 'Usuarios',
    'admin.bots': 'Bots',
    'admin.reports': 'Reportes',
    'admin.settings': 'Configuración',
    
    // Footer
    'footer.privacy': 'Política de Privacidad',
    'footer.imprint': 'Aviso Legal',
    'footer.terms': 'Términos de Servicio',
    'footer.contact': 'Contacto',
    'footer.language': 'Idioma',
    
    // Misc
    'misc.loading': 'Cargando...',
    'misc.error': 'Ha ocurrido un error',
    'misc.success': '¡Éxito!',
    'misc.search': 'Buscar',
    'misc.save': 'Guardar',
    'misc.cancel': 'Cancelar',
    'misc.delete': 'Eliminar',
    'misc.edit': 'Editar',
    'misc.view': 'Ver',
    'misc.create': 'Crear',
    'misc.submit': 'Enviar',
    'misc.back': 'Atrás',
    'misc.next': 'Siguiente',
    'misc.previous': 'Anterior',
    
    // Cookie banner
    'cookie.title': 'Aviso de Cookies',
    'cookie.description': 'Utilizamos cookies para garantizar que obtenga la mejor experiencia en nuestro sitio web.',
    'cookie.accept': 'Aceptar Todo',
    'cookie.decline': 'Rechazar',
    'cookie.preferences': 'Personalizar',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.edit': 'Editar Perfil',
    'profile.bots': 'Mis Bots',
    'profile.settings': 'Configuración',
  }
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get browser language or use English as default
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'de' || browserLang === 'es') ? browserLang as Language : 'en';
  };

  // Get stored language or browser language
  const getInitialLanguage = (): Language => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage || getBrowserLanguage();
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Translate a key
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // Set document language on initial load
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
