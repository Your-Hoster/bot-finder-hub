
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold flex items-center space-x-2">
              <span className="text-primary">Bot</span>
              <span>Search</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Find and add Discord bots to enhance your server experience.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/bots" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.bots')}
                </Link>
              </li>
              <li>
                <Link to="/add-bot" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.add-bot')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.search')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.register')}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.profile')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/imprint" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.imprint')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} BotSearch. {t('footer.rights')}
          </p>
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            Built with ♥ for Discord communities
          </div>
        </div>
      </div>
    </footer>
  );
};
