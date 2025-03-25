
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, Github, RefreshCw, Star, Trash2, PenLine, Check } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Bot = {
  id: string;
  name: string;
  discord_id: string;
  prefix: string;
  short_description: string | null;
  description: string | null;
  invite_url: string | null;
  website_url: string | null;
  github_url: string | null;
  support_url: string | null;
  image_url: string | null;
  tags: string[] | null;
  user_id: string | null;
  stars: number;
  verified: boolean;
  created_at: string;
  updated_at: string | null;
  profiles: {
    username: string | null;
  } | null;
};

const BotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bumpingBot, setBumpingBot] = useState(false);
  
  useEffect(() => {
    const fetchBot = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('bots')
          .select('*, profiles(username)')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError(t('bot.not-found'));
          setLoading(false);
          return;
        }
        
        setBot({
          id: data.id,
          name: data.name,
          discord_id: data.discord_id,
          prefix: data.prefix,
          short_description: data.short_description,
          description: data.description,
          invite_url: data.invite_url,
          website_url: data.website_url,
          github_url: data.github_url,
          support_url: data.support_url ?? null,
          image_url: data.image_url,
          tags: data.tags,
          user_id: data.user_id,
          stars: data.stars || 0,
          verified: data.verified || false,
          created_at: data.created_at,
          updated_at: data.updated_at,
          profiles: data.profiles,
        });
      } catch (error: any) {
        console.error('Error fetching bot:', error);
        setError(error.message || t('misc.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBot();
  }, [id, t]);
  
  const handleBumpBot = async () => {
    if (!id || !user) return;
    
    setBumpingBot(true);
    try {
      const { error } = await supabase
        .from('bots')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Bot Bumped!',
        description: 'Your bot has been successfully bumped to the top of the list.',
      });
      
      // Refresh bot data
      const { data, error: fetchError } = await supabase
        .from('bots')
        .select('*, profiles(username)')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (data) {
        setBot({
          ...bot as Bot,
          updated_at: data.updated_at,
        });
      }
    } catch (error: any) {
      console.error('Error bumping bot:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to bump the bot. Please try again later.',
        variant: "destructive",
      });
    } finally {
      setBumpingBot(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id || !user) return;
    
    try {
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Bot Deleted',
        description: 'Your bot has been successfully removed.',
      });
      
      navigate('/bots');
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete the bot. Please try again later.',
        variant: "destructive",
      });
    }
  };
  
  const verifyBot = async () => {
    if (!id || !isAdmin) return;
    
    try {
      const { error } = await supabase
        .from('bots')
        .update({ verified: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Bot Verified',
        description: 'This bot has been verified successfully.',
      });
      
      // Refresh bot data
      const { data, error: fetchError } = await supabase
        .from('bots')
        .select('*, profiles(username)')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (data) {
        setBot({
          ...bot as Bot,
          verified: true,
        });
      }
    } catch (error: any) {
      console.error('Error verifying bot:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify the bot. Please try again later.',
        variant: "destructive",
      });
    }
  };
  
  const isOwner = user && bot?.user_id === user.id;
  const formatDate = (date: string | null) => {
    if (!date) return t('bot.unknown');
    return new Date(date).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !bot) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>{t('bot.not-found')}</CardTitle>
            <CardDescription>{t('bot.not-found-description')}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/bots">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('bot.back-to-bots')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-start justify-between mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/bots">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('bot.back-to-bots')}
            </Link>
          </Button>
          
          <div className="flex space-x-2">
            {isOwner && (
              <>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleBumpBot}
                  disabled={bumpingBot}
                >
                  {bumpingBot ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {t('bot.bumping')}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t('bot.bump')}
                    </>
                  )}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('bot.delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your bot.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/edit-bot/${bot.id}`}>
                    <PenLine className="mr-2 h-4 w-4" />
                    {t('bot.edit')}
                  </Link>
                </Button>
              </>
            )}
            
            {isAdmin && !bot.verified && (
              <Button variant="outline" size="sm" onClick={verifyBot}>
                <Check className="mr-2 h-4 w-4" />
                {t('admin.approve')}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={bot.image_url || ''} alt={bot.name} />
                    <AvatarFallback>{bot.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      {bot.name}
                      {bot.verified && (
                        <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {t('bot.verified')}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {bot.stars} {t('bot.stars')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('bot.owner')}</h3>
                  <p>{bot.profiles?.username || t('bot.unknown')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('bot.prefix')}</h3>
                  <p>{bot.prefix || t('bot.unknown')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('bot.created')}</h3>
                  <p>{formatDate(bot.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('bot.updated')}</h3>
                  <p>{formatDate(bot.updated_at)}</p>
                </div>
                
                {bot.tags && bot.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('bot.tags')}</h3>
                    <div className="flex flex-wrap gap-1">
                      {bot.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" asChild>
                  <a href={bot.invite_url || `https://discord.com/oauth2/authorize?client_id=${bot.discord_id}&scope=bot&permissions=0`} target="_blank" rel="noopener noreferrer">
                    {t('bot.invite')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                
                <div className="grid grid-cols-2 gap-2 w-full">
                  {bot.website_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={bot.website_url} target="_blank" rel="noopener noreferrer">
                        {t('bot.website')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  
                  {bot.support_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={bot.support_url} target="_blank" rel="noopener noreferrer">
                        {t('bot.support')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  
                  {bot.github_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={bot.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1 h-3 w-3" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Card className="h-full">
              <Tabs defaultValue="description" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="h-[calc(100%-40px)]">
                  <CardHeader>
                    <CardTitle>{t('bot.description')}</CardTitle>
                    {bot.short_description && (
                      <CardDescription>{bot.short_description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {bot.description ? (
                        <div dangerouslySetInnerHTML={{ __html: bot.description.replace(/\n/g, '<br>') }} />
                      ) : (
                        <p className="text-muted-foreground">{t('bot.no-description')}</p>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="reviews" className="h-[calc(100%-40px)]">
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>See what others think about this bot</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Reviews coming soon!</p>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BotDetail;
