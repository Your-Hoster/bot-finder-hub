
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CookieProvider } from "./contexts/CookieContext";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import additional pages when created
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Bots from "./pages/Bots";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CookieProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Add additional routes here */}
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/register" element={<Register />} /> */}
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
          </BrowserRouter>
        </TooltipProvider>
      </CookieProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
