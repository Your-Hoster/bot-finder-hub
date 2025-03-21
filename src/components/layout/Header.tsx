import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Search, Menu, X, Globe, User, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
        isScrolled 
          ? "bg-background/80 shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/"
          className="text-xl font-bold flex items-center space-x-2 mr-8"
        >
          <span className="text-primary">Bot</span>
          <span>Search</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink 
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors",
                    isActive('/') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-primary/5"
                  )}
                >
                  {t('nav.home')}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/bots">
                <NavigationMenuLink 
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors",
                    isActive('/bots') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-primary/5"
                  )}
                >
                  {t('nav.bots')}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/add-bot">
                <NavigationMenuLink 
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors",
                    isActive('/add-bot') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-primary/5"
                  )}
                >
                  {t('nav.add-bot')}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link to="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">{t('nav.search')}</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={language === lang.code ? "bg-primary/10 text-primary" : ""}
                  onClick={() => setLanguage(lang.code as Language)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/auth" className="w-full cursor-pointer">
                  {t('nav.login')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/auth" className="w-full cursor-pointer">
                  {t('nav.register')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/"
                  className={cn(
                    "px-4 py-3 rounded-md transition-colors",
                    isActive('/') ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/bots"
                  className={cn(
                    "px-4 py-3 rounded-md transition-colors",
                    isActive('/bots') ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  {t('nav.bots')}
                </Link>
                <Link 
                  to="/add-bot"
                  className={cn(
                    "px-4 py-3 rounded-md transition-colors",
                    isActive('/add-bot') ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  {t('nav.add-bot')}
                </Link>
                <div className="pt-2 border-t">
                  <Link 
                    to="/auth"
                    className="px-4 py-3 rounded-md transition-colors flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/auth"
                    className="px-4 py-3 rounded-md transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('nav.register')}
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
