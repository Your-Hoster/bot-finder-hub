import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, Github, Globe, Star, MessageSquare } from 'lucide-react';

type Bot = {
  id: string;
  name: string;
  discord_id: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  invite_url: string | null;
  support_url: string | null;
  website_url: string | null;
  github_url: string | null;
  prefix: string | null;
  user_id: string | null;
  stars: number | null;
  verified: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  profiles?: {
    username: string | null;
  } | null;
};

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
        
        // Handle the profiles data safely and ensure support_url exists
        const botData: Bot = {
          ...data,
          // Ensure support_url is included, even if it's null
          support_url: data.support_url || null,
          profiles: data.profiles && typeof data.profiles === 'object' 
            ? data.profiles 
            : { username: null }
        };
        
        setBot(botData);
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
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('misc.unknown');
    return new Date(dateString).toLocaleDateString();
  };
  
  const isOwner = (botUserId: string | null) => {
    return user && botUserId === user.id;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-start gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{t('bot.not-found')}</h2>
        <p className="text-muted-foreground mb-8">{t('bot.not-found-description')}</p>
        <Button asChild>
          <Link to="/bots">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('misc.back')}
          </Link>
        </Button>
      </div>
    );
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
        <CardHeader className="flex flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={bot?.image_url || ''} alt={bot?.name} />
            <AvatarFallback className="text-2xl">{bot?.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{bot?.name}</CardTitle>
                <CardDescription className="text-lg">{bot?.short_description}</CardDescription>
              </div>
              
              {isOwner(bot?.user_id) && (
                <Button variant="outline" asChild>
                  <Link to={`/bot/${bot?.id}/edit`}>{t('bot.edit')}</Link>
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {bot?.stars || 0} {t('bot.stars')}
              </div>
              
              <div>
                {t('bot.prefix')}: <span className="font-mono bg-muted px-1 rounded">{bot?.prefix || '/'}</span>
              </div>
              
              {bot?.verified && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {t('bot.verified')}
                </Badge>
              )}
            </div>
            
            {bot?.tags && bot.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bot.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t('bot.description')}</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {bot?.description || bot?.short_description || t('bot.no-description')}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bot?.invite_url && (
              <Button className="w-full" asChild>
                <a href={bot.invite_url} target="_blank" rel="noopener noreferrer">
                  {t('bot.invite')}
                </a>
              </Button>
            )}
            
            {bot?.support_url && (
              <Button variant="outline" className="w-full" asChild>
                <a href={bot.support_url} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t('bot.support')}
                </a>
              </Button>
            )}
            
            {bot?.website_url && (
              <Button variant="outline" className="w-full" asChild>
                <a href={bot.website_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  {t('bot.website')}
                </a>
              </Button>
            )}
            
            {bot?.github_url && (
              <Button variant="outline" className="w-full" asChild>
                <a href={bot.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('bot.github')}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-2">
          <div className="text-sm text-muted-foreground">
            {t('bot.owner')}: <span className="font-medium">{bot?.profiles?.username || t('bot.unknown')}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('bot.created')}: {formatDate(bot?.created_at)}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('bot.updated')}: {formatDate(bot?.updated_at)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BotDetail;
