
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  bumpBot: (botId: string) => Promise<void>;
  updateProfile: (profile: Partial<ProfileData>) => Promise<void>;
};

type ProfileData = {
  username?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        if (currentSession?.user) {
          checkIfAdmin(currentSession.user.id);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Got existing session:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      if (currentSession?.user) {
        checkIfAdmin(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching admin status:', error);
        return;
      }

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Willkommen zurück!",
        description: "Sie haben sich erfolgreich angemeldet.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Bei der Anmeldung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Konto erstellt!",
        description: "Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu bestätigen.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bei der Registrierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithDiscord = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Discord sign in error:', error);
      toast({
        title: "Discord-Anmeldung fehlgeschlagen",
        description: error.message || "Bei der Anmeldung mit Discord ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google-Anmeldung fehlgeschlagen",
        description: error.message || "Bei der Anmeldung mit Google ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message || "Beim Abmelden ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bumpBot = async (botId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentifizierung erforderlich",
          description: "Sie müssen angemeldet sein, um einen Bot zu bumpen.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('bots')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', botId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Bot erfolgreich gebumpt!",
        description: "Ihr Bot wurde an die Spitze der Liste gebumpt.",
      });
    } catch (error: any) {
      console.error('Error bumping bot:', error);
      toast({
        title: "Fehler beim Bumpen des Bots",
        description: error.message || "Beim Bumpen Ihres Bots ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (profile: Partial<ProfileData>) => {
    try {
      if (!user) {
        toast({
          title: "Authentifizierung erforderlich",
          description: "Sie müssen angemeldet sein, um Ihr Profil zu aktualisieren.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profil aktualisiert",
        description: "Ihr Profil wurde erfolgreich aktualisiert.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Fehler beim Aktualisieren des Profils",
        description: error.message || "Beim Aktualisieren Ihres Profils ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signInWithDiscord,
    signInWithGoogle,
    signOut,
    loading,
    isAdmin,
    bumpBot,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
