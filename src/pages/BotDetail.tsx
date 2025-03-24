
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import BotHeader from '@/components/bot-detail/BotHeader';
import BotDescription from '@/components/bot-detail/BotDescription';
import BotLinks from '@/components/bot-detail/BotLinks';
import BotFooter from '@/components/bot-detail/BotFooter';
import BotDetailSkeleton from '@/components/bot-detail/BotDetailSkeleton';
import BotNotFound from '@/components/bot-detail/BotNotFound';
import { Bot } from '@/types/bot';

const BotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBot = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("Bot ID not provided");
        }
        
        const { data, error } = await supabase
          .from('bots')
          .select('*, profiles:user_id(username)')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Make sure data contains all required fields by checking and setting default values
        const botData = {
          ...data,
          // Explicitly add support_url even if it might not exist in data
          support_url: data.support_url || null,
          // Properly handle profiles data
          profiles: data.profiles && typeof data.profiles === 'object' 
            ? data.profiles 
            : { username: null }
        };
        
        setBot(botData as Bot);
      } catch (error: any) {
        console.error('Error fetching bot:', error);
        toast({
          title: t('misc.error'),
          description: error.message || t('misc.error'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBot();
  }, [id, toast, t]);
  
  const isOwner = (botUserId: string | null) => {
    return user && botUserId === user.id;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <BotDetailSkeleton />
      </div>
    );
  }

  if (!bot) {
    return <BotNotFound />;
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/bots">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('misc.back-to-bots')}
        </Link>
      </Button>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <BotHeader bot={bot} isOwner={isOwner(bot?.user_id)} />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <BotDescription 
            description={bot.description} 
            shortDescription={bot.short_description} 
          />
          
          <BotLinks 
            inviteUrl={bot.invite_url}
            supportUrl={bot.support_url}
            websiteUrl={bot.website_url}
            githubUrl={bot.github_url}
          />
        </CardContent>
        
        <CardFooter>
          <BotFooter 
            username={bot.profiles?.username || null}
            createdAt={bot.created_at}
            updatedAt={bot.updated_at}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default BotDetail;
