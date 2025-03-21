
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        toast({
          title: "Successfully authenticated",
          description: "You have been logged in successfully.",
        });
        
        navigate('/');
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication error",
          description: error.message || "An error occurred during authentication.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
};

export default AuthCallback;
