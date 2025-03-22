
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Key, LogOut } from 'lucide-react';

const AccountManager = () => {
  const { t } = useLanguage();
  const { user, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile form state
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Submit handler for profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        username: username || undefined,
        bio: bio || undefined,
        website: website || undefined,
        avatar_url: avatarUrl || undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no user is logged in, redirect to login
  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Konto-Verwaltung</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <Card className="h-fit">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                <AvatarFallback>
                  {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-lg font-medium">{user.user_metadata?.username || user.email}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full mt-4" 
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profil & Einstellungen</CardTitle>
              <CardDescription>
                Verwalten Sie Ihre persönlichen Informationen und Kontoeinstellungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Einstellungen
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Key className="h-4 w-4 mr-2" />
                    Sicherheit
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Benutzername</Label>
                        <Input 
                          id="username" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={user.user_metadata?.username || 'Benutzername'}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Über mich</Label>
                        <Textarea 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Kurze Beschreibung über Sie"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          type="url" 
                          value={website} 
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com" 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input 
                          id="avatar" 
                          type="url" 
                          value={avatarUrl} 
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="https://example.com/avatar.png" 
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Speichern..." : "Profil aktualisieren"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Sprache</h3>
                      <p className="text-sm text-muted-foreground">
                        Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline">Deutsch</Button>
                        <Button variant="outline">English</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Benachrichtigungen</h3>
                      <p className="text-sm text-muted-foreground">
                        Verwalten Sie Ihre E-Mail-Benachrichtigungseinstellungen
                      </p>
                      <div className="mt-2">
                        <Button variant="outline">Einstellungen öffnen</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Passwort ändern</h3>
                      <p className="text-sm text-muted-foreground">
                        Aktualisieren Sie Ihr Passwort für eine verbesserte Sicherheit
                      </p>
                      <div className="mt-2">
                        <Button variant="outline">Passwort ändern</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Verbundene Konten</h3>
                      <p className="text-sm text-muted-foreground">
                        Verwalten Sie Ihre verbundenen sozialen Medienkonten
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline">Discord</Button>
                        <Button variant="outline">Google</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-destructive">Gefahrenzone</h3>
                      <p className="text-sm text-muted-foreground">
                        Löschen Sie Ihr Konto und alle zugehörigen Daten
                      </p>
                      <div className="mt-2">
                        <Button variant="destructive">Konto löschen</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountManager;
