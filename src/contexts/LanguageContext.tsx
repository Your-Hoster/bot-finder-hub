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

// Define types for translations
interface DiscordTranslations {
  integration: string;
  "bot-setup": string;
  "bot-desc": string;
  "quick-setup": string;
  "setup-instructions": string;
  "invite-url": string;
  "invite-placeholder": string;
  generate: string;
  "commands-endpoint": string;
  "commands-placeholder": string;
  "setup-commands": string;
  "available-commands": string;
  "bump-desc": string;
  "invite-cmd-desc": string;
  "invite-generated": string;
  "invite-desc": string;
  "commands-setup": string;
  "commands-desc": string;
}

interface FooterTranslations {
  rights: string;
  privacy: string;
  terms: string;
  imprint: string;
  resources: string;
  account: string;
  legal: string;
  description: string;
  "built-with-love": string;
}

interface LanguageTranslations {
  [key: string]: string | DiscordTranslations | FooterTranslations;
  discord: DiscordTranslations;
  footer: FooterTranslations;
}

// Translations object
const translations: Record<Language, LanguageTranslations> = {
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
    'nav.servers': 'Servers',
    'nav.add-server': 'Add Server',
    'nav.account': 'Account',
    
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
    'auth.username-placeholder': 'Enter your username',
    'auth.forgot-password': 'Forgot Password?',
    'auth.already-account': 'Already have an account?',
    'auth.no-account': 'Don\'t have an account?',
    'auth.or': 'or',
    'auth.login-with-google': 'Log in with Google',
    'auth.register-with-google': 'Register with Google',
    'auth.login-with-discord': 'Log in with Discord',
    'auth.register-with-discord': 'Register with Discord',
    'auth.login-description': 'Sign in to your account to manage your bots and servers',
    'auth.register-description': 'Create an account to add your bots and servers to our directory',
    
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
    'bot.invite': 'Invite Bot',
    'bot.support': 'Support Server',
    'bot.github': 'GitHub Repository',
    'bot.tags': 'Tags',
    'bot.save': 'Save Bot',
    'bot.cancel': 'Cancel',
    'bot.owner': 'Owner',
    'bot.created': 'Created',
    'bot.updated': 'Updated',
    'bot.stars': 'stars',
    'bot.verified': 'Verified',
    'bot.no-description': 'No description provided',
    'bot.unknown': 'Unknown',
    'bot.not-found': 'Bot Not Found',
    'bot.not-found-description': 'The bot you\'re looking for doesn\'t exist or has been removed.',
    'bot.back-to-bots': 'Back to Bots',
    'bot.view-details': 'View Details',
    'bot.directory': 'Bot Directory',
    'bot.directory-desc': 'Browse and discover Discord bots for your server',
    'bot.none-found': 'No bots found',
    'bot.be-first': 'Be the first to add a bot!',
    'bot.add-yours': 'Add Your Bot',
    'bot.last-updated': 'Last Updated',
    'bot.bump': 'Bump',
    'bot.bumping': 'Bumping...',
    
    // Server
    'server.add': 'Add Server',
    'server.edit': 'Edit Server',
    'server.delete': 'Delete Server',
    'server.name': 'Server Name',
    'server.description': 'Description',
    'server.invite': 'Invite Link',
    'server.members': 'Members',
    'server.join': 'Join Server',
    'server.tags': 'Tags',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.users': 'Users',
    'admin.bots': 'Bots',
    'admin.reports': 'Reports',
    'admin.settings': 'Settings',
    'admin.pending': 'Pending Bots',
    'admin.servers': 'Discord Servers',
    'admin.overview': 'Overview',
    'admin.user-management': 'User Management',
    'admin.manage-users-permissions': 'Manage users and their permissions',
    'admin.verified-bots': 'Verified Bots',
    'admin.pending-bots': 'Pending Verification',
    'admin.bot-management': 'Manage verified bots',
    'admin.bot-review': 'Review and verify submitted bots',
    'admin.server-management': 'Server Management',
    'admin.total-users': 'Total Users',
    'admin.total-bots': 'Total Bots',
    'admin.total-servers': 'Total Servers',
    'admin.pending-verification': 'Pending Verification',
    'admin.registered-users': 'Registered Users',
    'admin.verification-required': 'Verification Required',
    'admin.refresh': 'Refresh',
    'admin.approve': 'Approve',
    'admin.decline': 'Decline',
    'admin.remove-admin': 'Remove Admin Rights',
    'admin.make-admin': 'Make Admin',
    'admin.last-updated': 'Last Updated',
    'admin.user-details': 'User Details',
    'admin.close': 'Close',
    'admin.error-fetching-bots': 'Error fetching bots',
    'admin.error-fetching-users': 'Error fetching users',
    'admin.error-fetching-servers': 'Error fetching servers',
    'admin.no-bots-found': 'No bots found',
    'admin.no-pending-bots': 'No pending bots found',
    'admin.no-users-found': 'No users found',
    'admin.no-servers-found': 'No servers found',
    'admin.actions': 'Actions',
    'admin.joined': 'Joined',
    'admin.added': 'Added',
    'admin.admin-status': 'Admin Status',
    'admin.administrator': 'Administrator',
    'admin.regular-user': 'Regular User',
    'admin.registered': 'Registered',
    'admin.admin-status-updated': 'Admin Status Updated',
    'admin.user-is-now-admin': 'User is now an admin',
    'admin.user-no-longer-admin': 'User is no longer an admin',
    'admin.error-updating-admin-status': 'Error updating admin status',
    'admin.bot-verified': 'Bot Verified',
    'admin.bot-verified-success': 'Bot has been successfully verified',
    'admin.error-verifying-bot': 'Error verifying bot',
    'admin.confirm-delete-bot': 'Are you sure you want to delete this bot?',
    'admin.bot-deleted': 'Bot Deleted',
    'admin.bot-deleted-success': 'Bot has been successfully deleted',
    'admin.error-deleting-bot': 'Error deleting bot',
    'admin.confirm-delete-server': 'Are you sure you want to delete this server?',
    'admin.server-deleted': 'Server Deleted',
    'admin.server-deleted-success': 'Server has been successfully deleted',
    'admin.error-deleting-server': 'Error deleting server',
    'admin.access-denied': 'Access Denied',
    'admin.no-admin-rights': 'You do not have admin rights to access this page',
    'admin.user-detailed-info': 'Detailed information about this user',
    
    // Discord integration-related translations
    discord: {
      "integration": "Discord Integration",
      "bot-setup": "Discord Bot Setup",
      "bot-desc": "Configure and manage your Discord bot for server integration.",
      "quick-setup": "Quick Setup",
      "setup-instructions": "Follow these steps to set up your Discord bot with bump and invite commands.",
      "invite-url": "Bot Invite URL",
      "invite-placeholder": "Generate an invite URL for your bot",
      "generate": "Generate URL",
      "commands-endpoint": "Commands Endpoint",
      "commands-placeholder": "Setup your bot's slash commands",
      "setup-commands": "Setup Commands",
      "available-commands": "Available Commands:",
      "bump-desc": "Bumps your server to the top of the list",
      "invite-cmd-desc": "Generates an invitation link for your server",
      "invite-generated": "Invite URL Generated",
      "invite-desc": "Use this URL to add the bot to your Discord server",
      "commands-setup": "Commands Setup",
      "commands-desc": "Slash commands are now ready to use in your server"
    },
    
    // Update footer translations
    footer: {
      "rights": "All rights reserved.",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "imprint": "Imprint",
      "resources": "Resources",
      "account": "Account",
      "legal": "Legal",
      "description": "Find and add Discord bots to enhance your server experience.",
      "built-with-love": "Built with ♥ for Discord communities"
    }
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
    'nav.servers': 'Server',
    'nav.add-server': 'Server hinzufügen',
    'nav.account': 'Konto',
    
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
    'auth.username-placeholder': 'Gib deinen Benutzernamen ein',
    'auth.forgot-password': 'Passwort vergessen?',
    'auth.already-account': 'Bereits ein Konto?',
    'auth.no-account': 'Noch kein Konto?',
    'auth.or': 'oder',
    'auth.login-with-google': 'Mit Google anmelden',
    'auth.register-with-google': 'Mit Google registrieren',
    'auth.login-with-discord': 'Mit Discord anmelden',
    'auth.register-with-discord': 'Mit Discord registrieren',
    'auth.login-description': 'Melde dich an, um deine Bots und Server zu verwalten',
    'auth.register-description': 'Erstelle ein Konto, um deine Bots und Server zu unserem Verzeichnis hinzuzufügen',
    
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
    'bot.invite': 'Bot einladen',
    'bot.support': 'Support-Server',
    'bot.github': 'GitHub-Repository',
    'bot.tags': 'Tags',
    'bot.save': 'Bot speichern',
    'bot.cancel': 'Abbrechen',
    'bot.owner': 'Besitzer',
    'bot.created': 'Erstellt',
    'bot.updated': 'Aktualisiert',
    'bot.stars': 'Sterne',
    'bot.verified': 'Verifiziert',
    'bot.no-description': 'Keine Beschreibung vorhanden',
    'bot.unknown': 'Unbekannt',
    'bot.not-found': 'Bot nicht gefunden',
    'bot.not-found-description': 'Der gesuchte Bot existiert nicht oder wurde entfernt.',
    'bot.back-to-bots': 'Zurück zu Bots',
    'bot.view-details': 'Details anzeigen',
    'bot.directory': 'Bot-Verzeichnis',
    'bot.directory-desc': 'Durchsuche und entdecke Discord-Bots für deinen Server',
    'bot.none-found': 'Keine Bots gefunden',
    'bot.be-first': 'Sei der Erste, der einen Bot hinzufügt!',
    'bot.add-yours': 'Füge deinen Bot hinzu',
    'bot.last-updated': 'Zuletzt aktualisiert',
    'bot.bump': 'Hochstufen',
    'bot.bumping': 'Wird hochgestuft...',
    
    // Server
    'server.add': 'Server hinzufügen',
    'server.edit': 'Server bearbeiten',
    'server.delete': 'Server löschen',
    'server.name': 'Server-Name',
    'server.description': 'Beschreibung',
    'server.invite': 'Einladungslink',
    'server.members': 'Mitglieder',
    'server.join': 'Server beitreten',
    'server.tags': 'Tags',
    
    // Admin
    'admin.title': 'Admin-Panel',
    'admin.users': 'Benutzer',
    'admin.bots': 'Bots',
    'admin.reports': 'Berichte',
    'admin.settings': 'Einstellungen',
    'admin.pending': 'Ausstehende Bots',
    'admin.servers': 'Discord-Server',
    'admin.overview': 'Übersicht',
    'admin.user-management': 'Benutzerverwaltung',
    'admin.manage-users-permissions': 'Verwalte Benutzer und ihre Berechtigungen',
    'admin.verified-bots': 'Verifizierte Bots',
    'admin.pending-bots': 'Ausstehende Verifizierung',
    'admin.bot-management': 'Verifizierte Bots verwalten',
    'admin.bot-review': 'Eingereichte Bots prüfen und verifizieren',
    'admin.server-management': 'Serververwaltung',
    'admin.total-users': 'Benutzer insgesamt',
    'admin.total-bots': 'Bots insgesamt',
    'admin.total-servers': 'Server insgesamt',
    'admin.pending-verification': 'Ausstehende Verifizierung',
    'admin.registered-users': 'Registrierte Benutzer',
    'admin.verification-required': 'Verifizierung erforderlich',
    'admin.refresh': 'Aktualisieren',
    'admin.approve': 'Genehmigen',
    'admin.decline': 'Ablehnen',
    'admin.remove-admin': 'Admin-Rechte entfernen',
    'admin.make-admin': 'Zum Admin machen',
    'admin.last-updated': 'Zuletzt aktualisiert',
    'admin.user-details': 'Benutzerdetails',
    'admin.close': 'Schließen',
    'admin.error-fetching-bots': 'Fehler beim Abrufen der Bots',
    'admin.error-fetching-users': 'Fehler beim Abrufen der Benutzer',
    'admin.error-fetching-servers': 'Fehler beim Abrufen der Server',
    'admin.no-bots-found': 'Keine Bots gefunden',
    'admin.no-pending-bots': 'Keine ausstehenden Bots gefunden',
    'admin.no-users-found': 'Keine Benutzer gefunden',
    'admin.no-servers-found': 'Keine Server gefunden',
    'admin.actions': 'Aktionen',
    'admin.joined': 'Beigetreten',
    'admin.added': 'Hinzugefügt',
    'admin.admin-status': 'Admin-Status',
    'admin.administrator': 'Administrator',
    'admin.regular-user': 'Regulärer Benutzer',
    'admin.registered': 'Registriert',
    'admin.admin-status-updated': 'Admin-Status aktualisiert',
    'admin.user-is-now-admin': 'Benutzer ist jetzt ein Administrator',
    'admin.user-no-longer-admin': 'Benutzer ist kein Administrator mehr',
    'admin.error-updating-admin-status': 'Fehler beim Aktualisieren des Admin-Status',
    'admin.bot-verified': 'Bot verifiziert',
    'admin.bot-verified-success': 'Bot wurde erfolgreich verifiziert',
    'admin.error-verifying-bot': 'Fehler beim Verifizieren des Bots',
    'admin.confirm-delete-bot': 'Sind Sie sicher, dass Sie diesen Bot löschen möchten?',
    'admin.bot-deleted': 'Bot gelöscht',
    'admin.bot-deleted-success': 'Bot wurde erfolgreich gelöscht',
    'admin.error-deleting-bot': 'Fehler beim Löschen des Bots',
    'admin.confirm-delete-server': 'Sind Sie sicher, dass Sie diesen Server löschen möchten?',
    'admin.server-deleted': 'Server gelöscht',
    'admin.server-deleted-success': 'Server wurde erfolgreich gelöscht',
    'admin.error-deleting-server': 'Fehler beim Löschen des Servers',
    'admin.access-denied': 'Zugriff verweigert',
    'admin.no-admin-rights': 'Sie haben keine Administratorrechte, um auf diese Seite zuzugreifen',
    'admin.user-detailed-info': 'Detaillierte Informationen zu diesem Benutzer',
    
    // Discord integration-related translations
    discord: {
      "integration": "Discord Integration",
      "bot-setup": "Discord Bot Einrichtung",
      "bot-desc": "Konfigurieren und verwalten Sie Ihren Discord-Bot für die Serverintegration.",
      "quick-setup": "Schnelleinrichtung",
      "setup-instructions": "Folgen Sie diesen Schritten, um Ihren Discord-Bot mit Bump- und Einladungsbefehlen einzurichten.",
      "invite-url": "Bot Einladungs-URL",
      "invite-placeholder": "Generieren Sie eine Einladungs-URL für Ihren Bot",
      "generate": "URL generieren",
      "commands-endpoint": "Befehls-Endpunkt",
      "commands-placeholder": "Richten Sie die Slash-Befehle Ihres Bots ein",
      "setup-commands": "Befehle einrichten",
      "available-commands": "Verfügbare Befehle:",
      "bump-desc": "Bringt Ihren Server an die Spitze der Liste",
      "invite-cmd-desc": "Erstellt einen Einladungslink für Ihren Server",
      "invite-generated": "Einladungs-URL generiert",
      "invite-desc": "Verwenden Sie diese URL, um den Bot zu Ihrem Discord-Server hinzuzufügen",
      "commands-setup": "Befehle eingerichtet",
      "commands-desc": "Slash-Befehle sind jetzt in Ihrem Server einsatzbereit"
    },
    
    // Update footer translations
    footer: {
      "rights": "Alle Rechte vorbehalten.",
      "privacy": "Datenschutz",
      "terms": "Nutzungsbedingungen",
      "imprint": "Impressum",
      "resources": "Ressourcen",
      "account": "Konto",
      "legal": "Rechtliches",
      "description": "Finden und fügen Sie Discord-Bots hinzu, um Ihr Servererlebnis zu verbessern.",
      "built-with-love": "Mit ♥ für Discord-Communities erstellt"
    }
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
    'nav.servers': 'Servidores',
    'nav.add-server': 'Añadir Servidor',
    'nav.account': 'Cuenta',
    
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
    'auth.username-placeholder': 'Introduce tu nombre de usuario',
    'auth.forgot-password': '¿Olvidaste tu contraseña?',
    'auth.already-account': '¿Ya tienes una cuenta?',
    'auth.no-account': '¿No tienes una cuenta?',
    'auth.or': 'o',
    'auth.login-with-google': 'Iniciar sesión con Google',
    'auth.register-with-google': 'Registrarse con Google',
    'auth.login-with-discord': 'Iniciar sesión con Discord',
    'auth.register-with-discord': 'Registrarse con Discord',
    'auth.login-description': 'Inicia sesión para gestionar tus bots y servidores',
    'auth.register-description': 'Crea una cuenta para añadir tus bots y servidores a nuestro directorio',
    
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
    'bot.invite': 'Invitar Bot',
    'bot.support': 'Servidor de Soporte',
    'bot.github': 'Repositorio GitHub',
    'bot.tags': 'Etiquetas',
    'bot.save': 'Guardar Bot',
    'bot.cancel': 'Cancelar',
    'bot.owner': 'Propietario',
    'bot.created': 'Creado',
    'bot.updated': 'Actualizado',
    'bot.stars': 'estrellas',
    'bot.verified': 'Verificado',
    'bot.no-description': 'Sin descripción',
    'bot.unknown': 'Desconocido',
    'bot.not-found': 'Bot no encontrado',
    'bot.not-found-description': 'El bot que buscas no existe o ha sido eliminado.',
    'bot.back-to-bots': 'Volver a los Bots',
    'bot.view-details': 'Ver Detalles',
    'bot.directory': 'Directorio de Bots',
    'bot.directory-desc': 'Explora y descubre bots de Discord para tu servidor',
    'bot.none-found': 'No se encontraron bots',
    'bot.be-first': '¡Sé el primero en añadir un bot!',
    'bot.add-yours': 'Añade tu Bot',
    'bot.last-updated': 'Última actualización',
    'bot.bump': 'Impulsar',
    'bot.bumping': 'Impulsando...',
    
    // Server
    'server.add': 'Añadir Servidor',
    'server.edit': 'Editar Servidor',
    'server.delete': 'Eliminar Servidor',
    'server.name': 'Nombre del Servidor',
    'server.description': 'Descripción',
    'server.invite': 'Enlace de Invitación',
    'server.members': 'Miembros',
    'server.join': 'Unirse al Servidor',
    'server.tags': 'Etiquetas',
    
    // Admin
    'admin.title': 'Panel de Administración',
    'admin.users': 'Usuarios',
    'admin.bots': 'Bots',
    'admin.reports': 'Reportes',
    'admin.settings': 'Configuración',
    'admin.pending': 'Bots Pendientes',
    'admin.servers': 'Servidores Discord',
    'admin.overview': 'Resumen',
    'admin.user-management': 'Gestión de Usuarios',
    'admin.manage-users-permissions': 'Gestionar usuarios y sus permisos',
    'admin.verified-bots': 'Bots Verificados',
    'admin.pending-bots': 'Verificación Pendiente',
    'admin.bot-management': 'Gestionar bots verificados',
    'admin.bot-review': 'Revisar y verificar bots enviados',
    'admin.server-management': 'Gestión de Servidores',
    'admin.total-users': 'Total de Usuarios',
    'admin.total-bots': 'Total de Bots',
    'admin.total-servers': 'Total de Servidores',
    'admin.pending-verification': 'Verificación Pendiente',
    'admin.registered-users': 'Usuarios Registrados',
    'admin.verification-required': 'Verificación Requerida',
    'admin.refresh': 'Actualizar',
    'admin.approve': 'Aprobar',
    'admin.decline': 'Rechazar',
    'admin.remove-admin': 'Quitar Derechos de Admin',
    'admin.make-admin': 'Hacer Admin',
    'admin.last-updated': 'Última actualización',
    'admin.user-details': 'Detalles del Usuario',
    'admin.close': 'Cerrar',
    'admin.error-fetching-bots': 'Error al obtener los bots',
    'admin.error-fetching-users': 'Error al obtener los usuarios',
    'admin.error-fetching-servers': 'Error al obtener los servidores',
    'admin.no-bots-found': 'No se encontraron bots',
    'admin.no-pending-bots': 'No hay bots pendientes',
    'admin.no-users-found': 'No se encontraron usuarios',
    'admin.no-servers-found': 'No se encontraron servidores',
    'admin.actions': 'Acciones',
    'admin.joined': 'Se unió',
    'admin.added': 'Añadido',
    'admin.admin-status': 'Estado de Administrador',
    'admin.administrator': 'Administrador',
    'admin.regular-user': 'Usuario Regular',
    'admin.registered': 'Registrado',
    'admin.admin-status-updated': 'Estado de Administrador Actualizado',
    'admin.user-is-now-admin': 'El usuario ahora es administrador',
    'admin.user-no-longer-admin': 'El usuario ya no es administrador',
    'admin.error-updating-admin-status': 'Error al actualizar el estado de administrador',
    'admin.bot-verified': 'Bot Verificado',
    'admin.bot-verified-success': 'El bot ha sido verificado con éxito',
    'admin.error-verifying-bot': 'Error al verificar el bot',
    'admin.confirm-delete-bot': '¿Está seguro de que desea eliminar este bot?',
    'admin.bot-deleted': 'Bot Eliminado',
    'admin.bot-deleted-success': 'El bot ha sido eliminado con éxito',
    'admin.error-deleting-bot': 'Error al eliminar el bot',
    'admin.confirm-delete-server': '¿Está seguro de que desea eliminar este servidor?',
    'admin.server-deleted': 'Servidor Eliminado',
    'admin.server-deleted-success': 'El servidor ha sido eliminado con éxito',
    'admin.error-deleting-server': 'Error al eliminar el servidor',
    'admin.access-denied': 'Acceso Denegado',
    'admin.no-admin-rights': 'No tiene derechos de administrador para acceder a esta página',
    'admin.user-detailed-info': 'Información detallada sobre este usuario',
    
    // Discord integration-related translations
    discord: {
      "integration": "Integración de Discord",
      "bot-setup": "Configuración del Bot de Discord",
      "bot-desc": "Configure y administre su bot de Discord para la integración del servidor.",
      "quick-setup": "Configuración Rápida",
      "setup-instructions": "Siga estos pasos para configurar su bot de Discord con comandos de impulso e invitación.",
      "invite-url": "URL de Invitación del Bot",
      "invite-placeholder": "Genere una URL de invitación para su bot",
      "generate": "Generar URL",
      "commands-endpoint": "Punto Final de Comandos",
      "commands-placeholder": "Configure los comandos slash de su bot",
      "setup-commands": "Configurar Comandos",
      "available-commands": "Comandos Disponibles:",
      "bump-desc": "Impulsa su servidor a la parte superior de la lista",
      "invite-cmd-desc": "Genera un enlace de invitación para su servidor",
      "invite-generated": "URL de Invitación Generada",
      "invite-desc": "Use esta URL para agregar el bot a su servidor de Discord",
      "commands-setup": "Comandos Configurados",
      "commands-desc": "Los comandos slash ahora están listos para usar en su servidor"
    },
    
    // Update footer translations
    footer: {
      "rights": "Todos los derechos reservados.",
      "privacy": "Política de Privacidad",
      "terms": "Términos de Servicio",
      "imprint": "Aviso Legal",
      "resources": "Recursos",
      "account": "Cuenta",
      "legal": "Legal",
      "description": "Finden und fügen Sie Discord-Bots hinzu, um Ihr Servererlebnis zu verbessern.",
      "built-with-love": "Construido con ♥ para comunidades de Discord"
    }
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
    const keyParts = key.split('.');
    let value: any = translations[language];
    
    for (const part of keyParts) {
      if (value === undefined) return key;
      value = value[part];
    }
    
    return value !== undefined ? String(value) : key;
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
