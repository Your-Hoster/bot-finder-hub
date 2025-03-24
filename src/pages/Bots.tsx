
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon, StarIcon, RefreshCwIcon } from 'lucide-react';

type Bot = {
  id: string;
  name: string;
  discord_id: string;
  short_description: string | null;
  image_url: string | null;
  tags: string[] | null;
  user_id: string | null;
  stars: number | null;
  verified: boolean | null;
  updated_at: string | null;
};

const Bots = () => {
  const { t } = useLanguage();
  const { user, bumpBot } = useAuth();
  const { toast } = useToast();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bumpingBot, setBumpingBot] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const { data, error } = await supabase
          .from('bots')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setBots(data || []);
      } catch (error: any) {
        console.error('Error fetching bots:', error);
        toast({
          title: t('admin.error-fetching-bots'),
          description: error.message || t('misc.error'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBots();
  }, [toast, t]);
  
  const handleBumpBot = async (botId: string) => {
    setBumpingBot(botId);
    try {
      await bumpBot(botId);
      
      // Refresh bots list after successful bump
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setBots(data || []);
    } catch (error) {
      // Error is already handled in bumpBot function
    } finally {
      setBumpingBot(null);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };
  
  const isUserBot = (botUserId: string | null) => {
    return user && botUserId === user.id;
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('bot.directory')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('bot.directory-desc')}
          </p>
        </div>
        <Button asChild>
          <Link to="/add-bot">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('bot.add')}
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-80">
              <CardHeader className="flex flex-col space-y-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : bots.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">{t('bot.none-found')}</h2>
          <p className="text-muted-foreground mt-2">{t('bot.be-first')}</p>
          <Button className="mt-4" asChild>
            <Link to="/add-bot">{t('bot.add-yours')}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Card key={bot.id} className="flex flex-col h-full overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={bot.image_url || ''} alt={bot.name} />
                      <AvatarFallback>{bot.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <StarIcon className="h-3 w-3 mr-1 text-yellow-500" />
                        {bot.stars || 0} {t('bot.stars')}
                        {bot.verified && (
                          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {t('bot.verified')}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {bot.short_description || t('bot.no-description')}
                </p>
                {bot.tags && bot.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bot.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  {t('bot.last-updated')}: {formatDate(bot.updated_at)}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/bot/${bot.id}`}>{t('bot.view-details')}</Link>
                </Button>
                {isUserBot(bot.user_id) && (
                  <Button 
                    variant="secondary"
                    onClick={() => handleBumpBot(bot.id)}
                    disabled={bumpingBot === bot.id}
                  >
                    {bumpingBot === bot.id ? (
                      t('bot.bumping')
                    ) : (
                      <>
                        <RefreshCwIcon className="mr-1 h-4 w-4" />
                        {t('bot.bump')}
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bots;
