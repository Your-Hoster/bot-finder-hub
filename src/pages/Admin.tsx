
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, Bot, RefreshCw, Check, X, Server, Trash2, PenLine, Eye, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Admin = () => {
  const { t } = useLanguage();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [pendingBots, setPendingBots] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBots, setLoadingBots] = useState(false);
  const [loadingServers, setLoadingServers] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({
          title: t('admin.access-denied'),
          description: t('admin.no-admin-rights'),
          variant: "destructive",
        });
        navigate('/');
      } else {
        fetchUsers();
        fetchBots();
        fetchServers();
      }
    }
  }, [user, isAdmin, loading, navigate, t, toast]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
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
      setError(error.message);
      toast({
        title: t('admin.error-fetching-users'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBots = async () => {
    setLoadingBots(true);
    setError(null);
    try {
      // Use the foreign key relationship specified in the database schema
      const { data: allBots, error: botsError } = await supabase
        .from('bots')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
      
      if (botsError) {
        throw botsError;
      }
      
      console.log("Fetched bots:", allBots);
      
      // Separate verified and unverified bots
      const verified = allBots?.filter(bot => bot.verified) || [];
      const pending = allBots?.filter(bot => !bot.verified) || [];
      
      setBots(verified);
      setPendingBots(pending);
    } catch (error: any) {
      console.error('Error fetching bots:', error);
      setError(error.message);
      toast({
        title: t('admin.error-fetching-bots'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    } finally {
      setLoadingBots(false);
    }
  };

  const fetchServers = async () => {
    setLoadingServers(true);
    setError(null);
    try {
      // Use the correct foreign key relationship according to the database schema
      const { data, error } = await supabase
        .from('servers')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setServers(data || []);
    } catch (error: any) {
      console.error('Error fetching servers:', error);
      setError(error.message);
      toast({
        title: t('admin.error-fetching-servers'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    } finally {
      setLoadingServers(false);
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
        title: t('admin.admin-status-updated'),
        description: !currentStatus 
          ? t('admin.user-is-now-admin') 
          : t('admin.user-no-longer-admin'),
      });
      
      // Refresh the users list
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      toast({
        title: t('admin.error-updating-admin-status'),
        description: error.message || t('misc.error'),
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
        title: t('admin.bot-verified'),
        description: t('admin.bot-verified-success'),
      });
      
      // Refresh the bots list
      fetchBots();
    } catch (error: any) {
      console.error('Error verifying bot:', error);
      toast({
        title: t('admin.error-verifying-bot'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    }
  };

  const deleteBot = async (botId: string) => {
    if (!confirm(t('admin.confirm-delete-bot'))) {
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
        title: t('admin.bot-deleted'),
        description: t('admin.bot-deleted-success'),
      });
      
      // Refresh the bots list
      fetchBots();
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      toast({
        title: t('admin.error-deleting-bot'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    }
  };

  const deleteServer = async (serverId: string) => {
    if (!confirm(t('admin.confirm-delete-server'))) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('admin.server-deleted'),
        description: t('admin.server-deleted-success'),
      });
      
      // Refresh the servers list
      fetchServers();
    } catch (error: any) {
      console.error('Error deleting server:', error);
      toast({
        title: t('admin.error-deleting-server'),
        description: error.message || t('misc.error'),
        variant: "destructive",
      });
    }
  };

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const clearError = () => {
    setError(null);
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
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/add-server">
                <Plus className="h-4 w-4 mr-2" />
                {t('server.add')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/add-bot">
                <Plus className="h-4 w-4 mr-2" />
                {t('bot.add')}
              </Link>
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
            <p className="font-medium">{t('misc.error')}</p>
            <p className="text-sm">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2 bg-red-50 hover:bg-red-100 text-red-800 border-red-200 hover:border-red-300 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-200 dark:border-red-800"
              size="sm"
              onClick={clearError}
            >
              {t('admin.close')}
            </Button>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
            <TabsTrigger value="bots">{t('admin.bots')}</TabsTrigger>
            <TabsTrigger value="pending">{t('admin.pending')}</TabsTrigger>
            <TabsTrigger value="servers">{t('admin.servers')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.total-users')}</CardTitle>
                  <CardDescription>{t('admin.registered-users')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{users.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.total-bots')}</CardTitle>
                  <CardDescription>{t('admin.verified-bots')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{bots.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.pending-verification')}</CardTitle>
                  <CardDescription>{t('admin.verification-required')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingBots.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>{t('admin.total-servers')}</CardTitle>
                  <CardDescription>{t('admin.servers')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{servers.length}</div>
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
                      {t('admin.user-management')}
                    </CardTitle>
                    <CardDescription>{t('admin.manage-users-permissions')}</CardDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('auth.username')}</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>{t('admin.joined')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground truncate">ID: {user.id.slice(0, 6)}...</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewUserDetails(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={user.is_admin ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          >
                            {user.is_admin ? t('admin.remove-admin') : t('admin.make-admin')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && !loadingUsers && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          {t('admin.no-users-found')}
                        </TableCell>
                      </TableRow>
                    )}
                    {loadingUsers && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          {t('misc.loading')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('bot.name')}</TableHead>
                      <TableHead>{t('bot.owner')}</TableHead>
                      <TableHead>{t('admin.added')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bots.map((bot) => (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell className="text-muted-foreground">{bot.profiles?.username || t('bot.unknown')}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(bot.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBot(bot.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('misc.delete')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {bots.length === 0 && !loadingBots && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          {t('admin.no-bots-found')}
                        </TableCell>
                      </TableRow>
                    )}
                    {loadingBots && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          {t('misc.loading')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                    <CardDescription>{t('admin.bot-review')}</CardDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('bot.name')}</TableHead>
                      <TableHead>{t('bot.owner')}</TableHead>
                      <TableHead>{t('bot.description')}</TableHead>
                      <TableHead>{t('admin.added')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBots.map((bot) => (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell className="text-muted-foreground">{bot.profiles?.username || t('bot.unknown')}</TableCell>
                        <TableCell className="text-muted-foreground truncate">{bot.short_description || t('bot.no-description')}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(bot.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 dark:hover:text-green-300"
                            onClick={() => verifyBot(bot.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {t('admin.approve')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => deleteBot(bot.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t('admin.decline')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingBots.length === 0 && !loadingBots && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          {t('admin.no-pending-bots')}
                        </TableCell>
                      </TableRow>
                    )}
                    {loadingBots && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          {t('misc.loading')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      {t('admin.servers')}
                    </CardTitle>
                    <CardDescription>{t('admin.server-management')}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/add-server">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('server.add')}
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchServers}
                      disabled={loadingServers}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingServers ? 'animate-spin' : ''}`} />
                      {t('admin.refresh')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('server.name')}</TableHead>
                      <TableHead>{t('bot.owner')}</TableHead>
                      <TableHead>{t('server.members')}</TableHead>
                      <TableHead>{t('admin.added')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">{server.name}</TableCell>
                        <TableCell className="text-muted-foreground">{server.profiles?.username || t('bot.unknown')}</TableCell>
                        <TableCell>{server.member_count?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(server.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteServer(server.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('misc.delete')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {servers.length === 0 && !loadingServers && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          {t('admin.no-servers-found')}
                        </TableCell>
                      </TableRow>
                    )}
                    {loadingServers && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          {t('misc.loading')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* User Detail Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.user-details')}</DialogTitle>
            <DialogDescription>{t('admin.user-detailed-info')}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">{t('auth.username')}:</div>
                <div>{selectedUser.username || t('bot.unknown')}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">ID:</div>
                <div className="break-all">{selectedUser.id}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">{t('admin.registered')}:</div>
                <div>{new Date(selectedUser.created_at).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">{t('admin.last-updated')}:</div>
                <div>{new Date(selectedUser.updated_at).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">{t('admin.admin-status')}:</div>
                <div>{selectedUser.is_admin ? t('admin.administrator') : t('admin.regular-user')}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setUserDialogOpen(false)}>{t('admin.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
