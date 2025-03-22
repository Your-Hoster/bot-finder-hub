
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, ExternalLink, Github, Globe, MessageSquare, Calendar, 
  Star, Share2, ArrowUpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const BotDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user, bumpBot } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bot, setBot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchBotDetails();
  }, [id]);

  const fetchBotDetails = async () => {
    try {
      setLoading(true);
      
      // First fetch the bot details
      const { data: botData, error: botError } = await supabase
        .from('bots')
        .select('*')
        .eq('id', id)
        .single();
      
      if (botError) {
        throw botError;
      }
      
      setBot(botData);
      setIsOwner(user?.id === botData.user_id);
      
      // Then fetch owner profile separately
      if (botData.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', botData.user_id)
          .single();
        
        if (!profileError) {
          setOwner(profileData);
        }
      }
    } catch (error: any) {
      console.error('Error fetching bot details:', error);
      toast({
        title: "Error",
        description: "Failed to load bot details. Please try again.",
        variant: "destructive",
      });
      navigate('/bots');
    } finally {
      setLoading(false);
    }
  };

  const handleBumpBot = async () => {
    if (!id) return;
    
    try {
      await bumpBot(id);
      toast({
        title: "Success",
        description: "Bot has been bumped successfully!",
      });
      fetchBotDetails(); // Refresh to show updated timestamp
    } catch (error) {
      console.error('Error bumping bot:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Bot link has been copied to clipboard!",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div>{t('misc.loading')}</div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">{t('bots.not-found')}</h2>
            <p className="text-muted-foreground mb-6">{t('bots.bot-not-found')}</p>
            <Button onClick={() => navigate('/bots')}>
              {t('misc.back-to-bots')}
            </Button>
          </CardContent>
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
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Bot details card */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{bot.name}</CardTitle>
                    {bot.verified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('bots.verified')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {isOwner && (
                      <Button variant="outline" size="sm" onClick={handleBumpBot}>
                        <ArrowUpCircle className="h-4 w-4 mr-2" />
                        {t('bots.bump')}
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription className="text-base">{bot.short_description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bot image */}
                {bot.image_url && (
                  <div className="mb-6 overflow-hidden rounded-lg border">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={bot.image_url} 
                        alt={bot.name} 
                        className="w-full h-full object-cover" 
                      />
                    </AspectRatio>
                  </div>
                )}
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('bots.description')}</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    {bot.description || t('bots.no-description')}
                  </div>
                </div>
                
                {/* Meta info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prefix */}
                  {bot.prefix && (
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground">{t('bots.prefix')}</div>
                      <div className="font-mono mt-1">{bot.prefix}</div>
                    </div>
                  )}
                  
                  {/* Added date */}
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">{t('bots.added')}</div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDate(bot.created_at)}
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {bot.tags && bot.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('bots.tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {bot.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">
                    {bot.stars || 0} {bot.stars === 1 ? t('bots.star') : t('bots.stars')}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {bot.website_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={bot.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        {t('bots.website')}
                      </a>
                    </Button>
                  )}
                  
                  {bot.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={bot.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        {t('bots.github')}
                      </a>
                    </Button>
                  )}
                  
                  {bot.invite_url && (
                    <Button variant="default" size="sm" asChild>
                      <a href={bot.invite_url} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {t('bots.invite')}
                      </a>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
            
            {/* Owner info card */}
            <Card className="md:w-72">
              <CardHeader>
                <CardTitle>{t('bots.owner')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                    {owner?.avatar_url ? (
                      <img 
                        src={owner.avatar_url} 
                        alt={owner?.username || 'User'} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold">
                        {(owner?.username || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold">{owner?.username || t('misc.unknown-user')}</div>
                  {owner?.created_at && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {t('profile.member-since')}: {formatDate(owner.created_at)}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate(`/user/${bot.user_id}`)}>
                  {t('bots.view-profile')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BotDetail;
