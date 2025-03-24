
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserIcon, 
  Settings, 
  Lock, 
  LogOut, 
  Save, 
  Trash2, 
  User, 
  AtSign, 
  Globe, 
  FileText,
  Moon,
  Sun,
  Monitor,
  Languages
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

const AccountManager = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form states
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  
  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);
  
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data);
      setUsername(data.username || '');
      setBio(data.bio || '');
      setWebsite(data.website || '');
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('profile.error-fetching'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Prepare the profile data
      const updates = {
        username,
        bio,
        website,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('profile.updated'),
        description: t('profile.update-success'),
      });
      
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: t('profile.update-failed'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'de' | 'es');
  };
  
  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  if (loading || authLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div>{t('misc.loading')}</div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container py-12 flex justify-center">
        <div>{t('profile.not-found')}</div>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t('account.title')}</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('nav.logout')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback>
                    {profile.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">{profile.username || t('profile.no-username')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('profile.member-since')} {new Date(profile.created_at).toLocaleDateString()}
                </p>
                {profile.is_admin && (
                  <Badge className="mt-2 bg-primary">{t('admin.administrator')}</Badge>
                )}
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1 p-0">
                <TabsTrigger 
                  value="profile" 
                  className="justify-start w-full border border-transparent data-[state=active]:border-primary/20 data-[state=active]:bg-primary/5"
                >
                  <User className="mr-2 h-4 w-4" />
                  {t('account.profile')}
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="justify-start w-full border border-transparent data-[state=active]:border-primary/20 data-[state=active]:bg-primary/5"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t('account.settings')}
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start w-full border border-transparent data-[state=active]:border-primary/20 data-[state=active]:bg-primary/5"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {t('account.security')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div>
            <TabsContent value="profile" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('account.profile')}</CardTitle>
                  <CardDescription>{t('account.profile-description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('auth.username')}</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="username" 
                        placeholder={t('auth.username-placeholder')}
                        className="pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('profile.bio')}</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <Textarea 
                        id="bio" 
                        placeholder={t('profile.bio-placeholder')}
                        className="pl-10 min-h-[120px]"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{t('profile.bio-help')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">{t('profile.website')}</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="website" 
                        placeholder="https://example.com"
                        className="pl-10"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={updateProfile} disabled={updating} className="mt-4">
                    {updating ? t('misc.loading') : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('account.save')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('account.settings')}</CardTitle>
                  <CardDescription>{t('account.settings-description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('account.language')}</Label>
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('account.select-language')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">{t('account.theme')}</Label>
                    <div className="flex items-center gap-2">
                      {theme === 'light' && <Sun className="h-4 w-4 text-muted-foreground" />}
                      {theme === 'dark' && <Moon className="h-4 w-4 text-muted-foreground" />}
                      {theme === 'system' && <Monitor className="h-4 w-4 text-muted-foreground" />}
                      <Select value={theme} onValueChange={handleThemeChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('account.select-theme')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center">
                              <Sun className="h-4 w-4 mr-2" />
                              {t('account.theme.light')}
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center">
                              <Moon className="h-4 w-4 mr-2" />
                              {t('account.theme.dark')}
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center">
                              <Monitor className="h-4 w-4 mr-2" />
                              {t('account.theme.system')}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('account.security')}</CardTitle>
                  <CardDescription>{t('account.security-description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                    <h3 className="font-medium text-amber-800 dark:text-amber-400">{t('account.account-actions')}</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">{t('account.danger-zone')}</p>
                    
                    <Separator className="my-4 bg-amber-200 dark:bg-amber-800" />
                    
                    <Button variant="destructive" className="mt-2">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('account.delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountManager;
