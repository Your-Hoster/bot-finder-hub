
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, Users, Bot, RefreshCw, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { t } = useLanguage();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [pendingBots, setPendingBots] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBots, setLoadingBots] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have administrator privileges.",
          variant: "destructive",
        });
        navigate('/');
      } else {
        fetchUsers();
        fetchBots();
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: error.message || "An error occurred while fetching users.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBots = async () => {
    setLoadingBots(true);
    try {
      // Fetch all bots
      const { data: allBots, error: botsError } = await supabase
        .from('bots')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
      
      if (botsError) {
        throw botsError;
      }
      
      // Separate verified and unverified bots
      const verified = allBots?.filter(bot => bot.verified) || [];
      const pending = allBots?.filter(bot => !bot.verified) || [];
      
      setBots(verified);
      setPendingBots(pending);
    } catch (error: any) {
      console.error('Error fetching bots:', error);
      toast({
        title: "Error fetching bots",
        description: error.message || "An error occurred while fetching bots.",
        variant: "destructive",
      });
    } finally {
      setLoadingBots(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Admin status updated",
        description: `User is now ${!currentStatus ? 'an admin' : 'no longer an admin'}.`,
      });
      
      // Refresh the users list
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error updating admin status",
        description: error.message || "An error occurred while updating admin status.",
        variant: "destructive",
      });
    }
  };

  const verifyBot = async (botId: string) => {
    try {
      const { error } = await supabase
        .from('bots')
        .update({ verified: true })
        .eq('id', botId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Bot verified",
        description: "The bot has been successfully verified.",
      });
      
      // Refresh the bots list
      fetchBots();
    } catch (error: any) {
      console.error('Error verifying bot:', error);
      toast({
        title: "Error verifying bot",
        description: error.message || "An error occurred while verifying the bot.",
        variant: "destructive",
      });
    }
  };

  const deleteBot = async (botId: string) => {
    if (!confirm("Are you sure you want to delete this bot? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', botId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Bot deleted",
        description: "The bot has been successfully deleted.",
      });
      
      // Refresh the bots list
      fetchBots();
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      toast({
        title: "Error deleting bot",
        description: error.message || "An error occurred while deleting the bot.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('admin.admin-panel')}</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
            <TabsTrigger value="bots">{t('admin.bots')}</TabsTrigger>
            <TabsTrigger value="pending">{t('admin.pending-bots')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.total-users')}</CardTitle>
                  <CardDescription>{t('admin.registered-users')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.total-bots')}</CardTitle>
                  <CardDescription>{t('admin.verified-bots')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{bots.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.pending-verification')}</CardTitle>
                  <CardDescription>{t('admin.needs-review')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingBots.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t('admin.manage-users')}
                    </CardTitle>
                    <CardDescription>{t('admin.user-management')}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchUsers}
                    disabled={loadingUsers}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
                    {t('admin.refresh')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                    <div>{t('admin.username')}</div>
                    <div>{t('admin.email')}</div>
                    <div>{t('admin.joined')}</div>
                    <div className="text-right">{t('admin.actions')}</div>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-4 p-3 text-sm items-center border-t">
                      <div className="font-medium">{user.username || 'N/A'}</div>
                      <div className="text-muted-foreground truncate">User ID: {user.id.slice(0, 6)}...</div>
                      <div className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-right">
                        <Button
                          variant={user.is_admin ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                        >
                          {user.is_admin ? t('admin.remove-admin') : t('admin.make-admin')}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      {loadingUsers ? t('misc.loading') : t('admin.no-users-found')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bots">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {t('admin.verified-bots')}
                    </CardTitle>
                    <CardDescription>{t('admin.bot-management')}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchBots}
                    disabled={loadingBots}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingBots ? 'animate-spin' : ''}`} />
                    {t('admin.refresh')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                    <div>{t('admin.bot-name')}</div>
                    <div>{t('admin.owner')}</div>
                    <div>{t('admin.added')}</div>
                    <div className="text-right">{t('admin.actions')}</div>
                  </div>
                  {bots.map((bot) => (
                    <div key={bot.id} className="grid grid-cols-4 p-3 text-sm items-center border-t">
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-muted-foreground">{bot.profiles?.username || 'Unknown'}</div>
                      <div className="text-muted-foreground">
                        {new Date(bot.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBot(bot.id)}
                        >
                          {t('admin.delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {bots.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      {loadingBots ? t('misc.loading') : t('admin.no-bots-found')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {t('admin.pending-verification')}
                    </CardTitle>
                    <CardDescription>{t('admin.bot-approval')}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchBots}
                    disabled={loadingBots}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingBots ? 'animate-spin' : ''}`} />
                    {t('admin.refresh')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                    <div>{t('admin.bot-name')}</div>
                    <div>{t('admin.owner')}</div>
                    <div>{t('admin.description')}</div>
                    <div>{t('admin.added')}</div>
                    <div className="text-right">{t('admin.actions')}</div>
                  </div>
                  {pendingBots.map((bot) => (
                    <div key={bot.id} className="grid grid-cols-5 p-3 text-sm items-center border-t">
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-muted-foreground">{bot.profiles?.username || 'Unknown'}</div>
                      <div className="text-muted-foreground truncate">{bot.short_description || 'No description'}</div>
                      <div className="text-muted-foreground">
                        {new Date(bot.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                          onClick={() => verifyBot(bot.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('admin.approve')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                          onClick={() => deleteBot(bot.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t('admin.reject')}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingBots.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      {loadingBots ? t('misc.loading') : t('admin.no-pending-bots')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Admin;
