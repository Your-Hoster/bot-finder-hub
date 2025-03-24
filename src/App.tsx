import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CookieProvider } from '@/contexts/CookieContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import Layout from '@/layout/Layout';
import Index from '@/pages';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import AccountManager from '@/pages/AccountManager';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Imprint from '@/pages/Imprint';
import Profile from '@/pages/Profile';
import Bots from '@/pages/Bots';
import BotDetail from '@/pages/BotDetail';
import AddBot from '@/pages/AddBot';
import Servers from '@/pages/Servers';
import AddServer from '@/pages/AddServer';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import ConnectBot from '@/pages/ConnectBot';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>
        <CookieProvider>
          <AuthProvider>
            <BrowserRouter>
              <Toaster />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth-callback" element={<AuthCallback />} />
                  <Route path="/account" element={<AccountManager />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/imprint" element={<Imprint />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/bots" element={<Bots />} />
                  <Route path="/bot/:id" element={<BotDetail />} />
                  <Route path="/add-bot" element={<AddBot />} />
                  <Route path="/servers" element={<Servers />} />
                  <Route path="/add-server" element={<AddServer />} />
                  <Route path="/connect-bot/:id" element={<ConnectBot />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </CookieProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
