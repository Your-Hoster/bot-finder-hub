
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiscordIntegration } from '@/components/DiscordIntegration';
import { ArrowLeft, Star, Clock, ExternalLink, Github, MessageSquare, Edit, Trash2, RefreshCw, Shield } from 'lucide-react';

const BotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [bot, setBot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [stars, setStars] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  
  useEffect(() => {
    fetchBot();
  }, [id]);
  
  const fetchBot = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setBot(data);
      setStars(data.stars || 0);
      setIsOwner(user && data.user_id === user.id);
      
      // Check if user has starred this bot
      if (user) {
        // This would require a stars table in your database
        // const { data: starData } = await supabase
        //   .from('stars')
        //   .select('*')
        //   .eq('bot_id', id)
        //   .eq('user_id', user.id)
        //   .single();
        
        // setIsStarred(!!starData);
      }
    } catch (error: any) {
      console.error('Error fetching bot:', error);
      toast({
        title: t('misc.error'),
        description: t('bot.error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStarBot = async () => {
    if (!user) {
      toast({
        title: t('auth.login-required'),
        description: t('auth.login-required'),
        variant: "destructive",
      });
      return navigate('/auth');
    }
    
    try {
      // Toggle star status
      const newStatus = !isStarred;
      setIsStarred(newStatus);
      setStars(prev => newStatus ? prev + 1 : prev - 1);
      
      // This would require a stars table in your database
      // if (newStatus) {
      //   await supabase.from('stars').insert({
      //     bot_id: id,
      //     user_id: user.id
      //   });
      //   
      //   await supabase.from('bots').update({
      //     stars: stars + 1
      //   }).eq('id', id);
      // } else {
      //   await supabase.from('stars').delete().match({
      //     bot_id: id,
      //     user_id: user.id
      //   });
      //   
      //   await supabase.from('bots').update({
      //     stars: stars - 1
      //   }).eq('id', id);
      // }
      
      toast({
        title: t('misc.success'),
        description: newStatus ? t('bot.star-success') : t('bot.unstar-success'),
      });
    } catch (error) {
      console.error('Error starring bot:', error);
      // Revert optimistic update
      setIsStarred(!isStarred);
      setStars(prev => isStarred ? prev + 1 : prev - 1);
      
      toast({
        title: t('misc.error'),
        description: t('bot.error'),
        variant: "destructive",
      });
    }
  };
  
  const handleBumpBot = async () => {
    if (!user) {
      toast({
        title: t('auth.login-required'),
        description: t('auth.login-required'),
        variant: "destructive",
      });
      return navigate('/auth');
    }
    
    if (!isOwner) {
      toast({
        title: t('misc.error'),
        description: "Only the bot owner can bump this bot.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsBumping(true);
      
      // Update the bot's updated_at field
      const { error } = await supabase
        .from('bots')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: t('misc.success'),
        description: t('bot.bump-success'),
      });
      
      // Refresh the bot data
      fetchBot();
    } catch (error: any) {
      console.error('Error bumping bot:', error);
      toast({
        title: t('misc.error'),
        description: t('bot.bump-error'),
        variant: "destructive",
      });
    } finally {
      setIsBumping(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/bots">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('misc.back')}
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4">{t('misc.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (!bot) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/bots">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('misc.back')}
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">{t('bot.none-found')}</h2>
          <p className="text-muted-foreground mt-2">
            The requested bot could not be found.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/bots">{t('bot.directory')}</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/bots">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('misc.back')}
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
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
                          <Shield className="h-3 w-3 mr-1" />
                          {t('bot.verified')}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {bot.short_description || t('bot.no-description')}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bot.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  variant={isStarred ? "default" : "outline"}
                  size="sm"
                  onClick={handleStarBot}
                  disabled={!user}
                >
                  <Star className={`h-4 w-4 mr-1 ${isStarred ? 'fill-current' : ''}`} />
                  {stars}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t('bot.discord-id')}
                  </p>
                  <p>{bot.discord_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t('bot.prefix')}
                  </p>
                  <p>{bot.prefix || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t('bot.updated')}
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatDate(bot.updated_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {bot.invite_url && (
                  <Button asChild size="sm">
                    <a href={bot.invite_url} target="_blank" rel="noopener noreferrer">
                      {t('bot.invite')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
                
                {bot.support_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={bot.support_url} target="_blank" rel="noopener noreferrer">
                      {t('bot.support')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
                
                {bot.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={bot.website_url} target="_blank" rel="noopener noreferrer">
                      {t('bot.website')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
                
                {bot.github_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={bot.github_url} target="_blank" rel="noopener noreferrer">
                      {t('bot.github')}
                      <Github className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
            {isOwner && (
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/bot/${bot.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      {t('bot.edit')}
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t('bot.delete')}
                  </Button>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleBumpBot}
                  disabled={isBumping}
                >
                  {isBumping ? (
                    <>
                      <div className="animate-spin mr-1">
                        <RefreshCw className="h-4 w-4" />
                      </div>
                      {t('bot.bumping')}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {t('bot.bump')}
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="description">{t('bot.description')}</TabsTrigger>
              <TabsTrigger value="reviews">
                {t('bot.reviews')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    {bot.description ? (
                      <div>{bot.description}</div>
                    ) : (
                      <p className="text-muted-foreground">{t('bot.no-description')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>{t('bot.reviews')}</CardTitle>
                  <CardDescription>
                    {t('bot.feedback')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">{t('bot.no-reviews')}</p>
                    {user && (
                      <Button className="mt-4">
                        {t('bot.write-review')}
                      </Button>
                    )}
                    {!user && (
                      <Button className="mt-4" asChild>
                        <Link to="/auth">{t('auth.login')}</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <DiscordIntegration botInviteUrl={`https://discord.com/api/oauth2/authorize?client_id=${bot.discord_id}&permissions=2147485696&scope=bot%20applications.commands`} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('bot.invite')}</CardTitle>
              <CardDescription>
                Add this bot to your Discord server
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bot.invite_url ? (
                <Button className="w-full" asChild>
                  <a href={bot.invite_url} target="_blank" rel="noopener noreferrer">
                    {t('bot.invite')}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">This bot doesn't have an invite link set up yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BotDetail;
