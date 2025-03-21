
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  bumpBot: (botId: string) => Promise<void>;
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
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
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
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
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
        title: "Discord sign in failed",
        description: error.message || "An error occurred during sign in with Discord.",
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
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred during sign out.",
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
          title: "Authentication required",
          description: "You need to be logged in to bump a bot.",
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
        title: "Bot bumped successfully!",
        description: "Your bot has been bumped to the top of the list.",
      });
    } catch (error: any) {
      console.error('Error bumping bot:', error);
      toast({
        title: "Error bumping bot",
        description: error.message || "An error occurred while bumping your bot.",
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
    signOut,
    loading,
    isAdmin,
    bumpBot,
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
