import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure of our translations
interface Translations {
  [key: string]: any;
}

// Define the context type
interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key, // Default translation returns the key
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // English translations
  const enTranslations = {
    misc: {
      'error': 'Error',
      'success': 'Success',
      'back': 'Back',
      'unknown': 'Unknown',
      'loading': 'Loading...',
      'login-required': 'You must be logged in to perform this action.',
      'back-to-bots': 'Back to Bots',
      'back-to-servers': 'Back to Servers',
    },
    auth: {
      'login': 'Login',
      'logout': 'Logout',
      'register': 'Register',
      'username': 'Username',
      'email': 'Email',
      'password': 'Password',
      'confirm-password': 'Confirm Password',
      'username-taken': 'This username is already taken.',
      'email-taken': 'This email is already taken.',
      'password-mismatch': 'Passwords do not match.',
      'invalid-email': 'Invalid email address.',
      'login-success': 'Login successful!',
      'logout-success': 'Logout successful!',
      'register-success': 'Registration successful!',
      'profile-updated': 'Profile updated successfully!',
      'profile': 'Profile',
      'edit-profile': 'Edit Profile',
      'update-profile': 'Update Profile',
    },
    bot: {
      'directory': 'Bot Directory',
      'directory-desc': 'Browse and discover awesome Discord bots',
      'add': 'Add Bot',
      'add-yours': 'Add Yours',
      'edit': 'Edit',
      'stars': 'Stars',
      'prefix': 'Prefix',
      'verified': 'Verified',
      'description': 'Description',
      'invite': 'Invite Bot',
      'support': 'Support Server',
      'website': 'Website',
      'github': 'GitHub',
      'owner': 'Owner',
      'created': 'Created',
      'updated': 'Updated',
      'unknown': 'Unknown',
      'last-updated': 'Last Updated',
      'view-details': 'View Details',
      'none-found': 'No bots found',
      'be-first': 'Be the first to add a bot to our directory!',
      'not-found': 'Bot not found',
      'not-found-description': 'The bot you are looking for does not exist or has been removed.',
      'bumping': 'Bumping...',
      'bump': 'Bump',
    },
    server: {
      'servers': 'Servers',
      'add': 'Add Server',
      'name': 'Name',
      'description': 'Description',
      'invite-url': 'Invite URL',
      'icon-url': 'Icon URL',
      'tags': 'Tags',
      'member-count': 'Member Count',
      'add-server': 'Add Server',
      'edit-server': 'Edit Server',
      'view-server': 'View Server',
      'no-description': 'No description provided',
      'connect-bot': 'Connect Discord Bot',
      'connect-bot-description': 'Connect a Discord bot to fetch server information automatically',
      'connect-bot-to': 'Connect Discord Bot to',
      'connect-bot-instructions': 'Add our Discord bot to your server to automatically sync member count, invite link and server icon.',
      'bot-permissions-needed': 'The bot needs permissions to view server members and access server information.',
      'connecting': 'Connecting...',
      'bot-connected': 'Bot Connected',
      'bot-connected-description': 'Discord bot has been successfully connected to your server.',
      'not-owner': 'You are not the owner of this server',
      'important': 'Important',
      'not-found': 'Server not found',
    },
    admin: {
      'dashboard': 'Dashboard',
      'users': 'Users',
      'bots': 'Bots',
      'servers': 'Servers',
      'reviews': 'Reviews',
      'settings': 'Settings',
      'logout': 'Logout',
      'error-fetching-bots': 'Error fetching bots',
    },
  };

  // German translations
  const deTranslations = {
    misc: {
      'error': 'Fehler',
      'success': 'Erfolg',
      'back': 'Zurück',
      'unknown': 'Unbekannt',
      'loading': 'Laden...',
      'login-required': 'Du musst angemeldet sein, um diese Aktion auszuführen.',
      'back-to-bots': 'Zurück zu den Bots',
      'back-to-servers': 'Zurück zu den Servern',
    },
    auth: {
      'login': 'Anmelden',
      'logout': 'Abmelden',
      'register': 'Registrieren',
      'username': 'Benutzername',
      'email': 'E-Mail',
      'password': 'Passwort',
      'confirm-password': 'Passwort bestätigen',
      'username-taken': 'Dieser Benutzername ist bereits vergeben.',
      'email-taken': 'Diese E-Mail ist bereits vergeben.',
      'password-mismatch': 'Passwörter stimmen nicht überein.',
      'invalid-email': 'Ungültige E-Mail-Adresse.',
      'login-success': 'Anmeldung erfolgreich!',
      'logout-success': 'Abmeldung erfolgreich!',
      'register-success': 'Registrierung erfolgreich!',
      'profile-updated': 'Profil erfolgreich aktualisiert!',
      'profile': 'Profil',
      'edit-profile': 'Profil bearbeiten',
      'update-profile': 'Profil aktualisieren',
    },
    bot: {
      'directory': 'Bot Verzeichnis',
      'directory-desc': 'Durchsuchen und entdecke tolle Discord Bots',
      'add': 'Bot hinzufügen',
      'add-yours': 'Füge deinen hinzu',
      'edit': 'Bearbeiten',
      'stars': 'Sterne',
      'prefix': 'Präfix',
      'verified': 'Verifiziert',
      'description': 'Beschreibung',
      'invite': 'Bot einladen',
      'support': 'Support Server',
      'website': 'Webseite',
      'github': 'GitHub',
      'owner': 'Besitzer',
      'created': 'Erstellt',
      'updated': 'Aktualisiert',
      'unknown': 'Unbekannt',
      'last-updated': 'Zuletzt aktualisiert',
      'view-details': 'Details ansehen',
      'none-found': 'Keine Bots gefunden',
      'be-first': 'Sei der Erste, der einen Bot zu unserem Verzeichnis hinzufügt!',
      'not-found': 'Bot nicht gefunden',
      'not-found-description': 'Der Bot, den du suchst, existiert nicht oder wurde entfernt.',
      'bumping': 'Wird aktualisiert...',
      'bump': 'Aktualisieren',
    },
    server: {
      'servers': 'Server',
      'add': 'Server hinzufügen',
      'name': 'Name',
      'description': 'Beschreibung',
      'invite-url': 'Einladungslink',
      'icon-url': 'Icon URL',
      'tags': 'Tags',
      'member-count': 'Mitgliederzahl',
      'add-server': 'Server hinzufügen',
      'edit-server': 'Server bearbeiten',
      'view-server': 'Server ansehen',
      'no-description': 'Keine Beschreibung vorhanden',
      'connect-bot': 'Discord Bot verbinden',
      'connect-bot-description': 'Verbinde einen Discord-Bot, um Serverinformationen automatisch zu aktualisieren',
      'connect-bot-to': 'Discord Bot verbinden mit',
      'connect-bot-instructions': 'Füge unseren Discord-Bot zu deinem Server hinzu, um die Mitgliederzahl, den Einladungslink und das Server-Icon automatisch zu synchronisieren.',
      'bot-permissions-needed': 'Der Bot benötigt Berechtigungen, um Servermitglieder und Serverinformationen einzusehen.',
      'connecting': 'Verbinden...',
      'bot-connected': 'Bot verbunden',
      'bot-connected-description': 'Discord-Bot wurde erfolgreich mit deinem Server verbunden.',
      'not-owner': 'Du bist nicht der Besitzer dieses Servers',
      'important': 'Wichtig',
      'not-found': 'Server nicht gefunden',
    },
    admin: {
      'dashboard': 'Dashboard',
      'users': 'Benutzer',
      'bots': 'Bots',
      'servers': 'Server',
      'reviews': 'Bewertungen',
      'settings': 'Einstellungen',
      'logout': 'Abmelden',
      'error-fetching-bots': 'Fehler beim Abrufen der Bots',
    },
  };

  // Translation function
  const t = (key: string, params?: { [key: string]: string | number }): string => {
    const translations: Translations = language === 'de' ? deTranslations : enTranslations;
    let translation = key
      .split('.')
      .reduce((obj: any, i: string) => (obj && obj[i] ? obj[i] : null), translations);

    if (translation && params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }

    return translation || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
