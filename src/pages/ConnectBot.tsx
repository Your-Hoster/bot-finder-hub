
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DiscordBotConnector from '@/components/DiscordBotConnector';

const ConnectBot = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServer = async () => {
      if (!user) {
        toast({
          title: t('misc.error'),
          description: t('misc.login-required'),
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("Server ID not provided");
        }
        
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Check if the user owns this server
        if (data.user_id !== user.id) {
          toast({
            title: t('misc.error'),
            description: t('server.not-owner'),
            variant: "destructive",
          });
          navigate('/servers');
          return;
        }
        
        setServer(data);
      } catch (error: any) {
        console.error('Error fetching server:', error);
        toast({
          title: t('misc.error'),
          description: error.message || t('misc.error'),
          variant: "destructive",
        });
        navigate('/servers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServer();
  }, [id, user, navigate, toast, t]);

  const handleBotConnected = (data: any) => {
    // Handle successful bot connection
    // This would be called after the OAuth flow is completed
    toast({
      title: t('server.bot-connected'),
      description: t('server.bot-connected-description'),
    });
    
    // Update the server with bot data
    // This would typically include the bot token, which should be securely stored
    // For security reasons, this should be handled on the server side
    
    navigate(`/servers`);
  };

  if (loading) {
    return <div className="container py-12 text-center">Loading...</div>;
  }

  if (!server) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('server.not-found')}</h2>
        <Button asChild>
          <Link to="/servers">{t('misc.back')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/servers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('misc.back-to-servers')}
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('server.connect-bot-to')} {server.name}</CardTitle>
          <CardDescription>
            {t('server.connect-bot-instructions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscordBotConnector 
            serverId={id} 
            onBotConnected={handleBotConnected} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectBot;
