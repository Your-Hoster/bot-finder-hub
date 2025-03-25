
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [userBots, setUserBots] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchProfile();
      fetchUserBots();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data);
      setUsername(data?.username || '');
      setBio(data?.bio || '');
      setWebsite(data?.website || '');
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error.message || "An error occurred while fetching your profile.",
        variant: "destructive",
      });
    }
  };

  const fetchUserBots = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUserBots(data || []);
    } catch (error: any) {
      console.error('Error fetching user bots:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div>{t('misc.loading')}</div>
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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.your-profile')}</CardTitle>
                <CardDescription>{t('profile.manage-details')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} alt={username} />
                  <AvatarFallback>{getInitials(username)}</AvatarFallback>
                </Avatar>
                <div className="text-xl font-semibold mb-1">{username || user?.email}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.edit-profile')}</CardTitle>
                <CardDescription>{t('profile.update-information')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    {t('profile.username')}
                  </label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('profile.username-placeholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    {t('profile.bio')}
                  </label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('profile.bio-placeholder')}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">
                    {t('profile.website')}
                  </label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={t('profile.website-placeholder')}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={updateProfile} 
                  disabled={isSaving}
                >
                  {isSaving ? t('misc.saving') : t('profile.save-changes')}
                </Button>
              </CardFooter>
            </Card>

            {userBots.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('profile.your-bots')}</CardTitle>
                  <CardDescription>{t('profile.manage-bots')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userBots.map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{bot.name}</div>
                          <div className="text-sm text-muted-foreground">{bot.short_description}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/bots/${bot.id}`)}
                        >
                          {t('profile.view-bot')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
