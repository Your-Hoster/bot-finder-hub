
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CookieProvider } from "./contexts/CookieContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Import additional pages when created
// import Bots from "./pages/Bots";
// import Register from "./pages/Register";
// import Bots from "./pages/Bots";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <CookieProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  {/* Redirects for login and register */}
                  <Route path="/login" element={<Navigate to="/auth" />} />
                  <Route path="/register" element={<Navigate to="/auth" />} />
                  {/* Add additional routes here */}
                  {/* <Route path="/bots" element={<Bots />} /> */}
                  {/* <Route path="/bots/:id" element={<BotDetail />} /> */}
                  {/* <Route path="/add-bot" element={<AddBot />} /> */}
                  {/* <Route path="/admin/*" element={<Admin />} /> */}
                  {/* <Route path="/profile" element={<Profile />} /> */}
                  {/* <Route path="/search" element={<Search />} /> */}
                  {/* <Route path="/privacy" element={<Privacy />} /> */}
                  {/* <Route path="/terms" element={<Terms />} /> */}
                  {/* <Route path="/imprint" element={<Imprint />} /> */}
                  
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </TooltipProvider>
          </AuthProvider>
        </CookieProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
