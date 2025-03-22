import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Administratorrechte.",
          variant: "destructive",
        });
        navigate('/');
      } else {
        fetchUsers();
        fetchBots();
        fetchServers();
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
        title: "Fehler beim Abrufen der Benutzer",
        description: error.message || "Beim Abrufen der Benutzer ist ein Fehler aufgetreten.",
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
        .select('*, profiles:user_id(username)')
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
        title: "Fehler beim Abrufen der Bots",
        description: error.message || "Beim Abrufen der Bots ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoadingBots(false);
    }
  };

  const fetchServers = async () => {
    setLoadingServers(true);
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*, profiles:user_id(username)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setServers(data || []);
    } catch (error: any) {
      console.error('Error fetching servers:', error);
      toast({
        title: "Fehler beim Abrufen der Server",
        description: error.message || "Beim Abrufen der Server ist ein Fehler aufgetreten.",
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
        title: "Administratorstatus aktualisiert",
        description: `Benutzer ist jetzt ${!currentStatus ? 'ein Administrator' : 'kein Administrator mehr'}.`,
      });
      
      // Refresh the users list
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Fehler beim Aktualisieren des Administratorstatus",
        description: error.message || "Beim Aktualisieren des Administratorstatus ist ein Fehler aufgetreten.",
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
        title: "Bot verifiziert",
        description: "Der Bot wurde erfolgreich verifiziert.",
      });
      
      // Refresh the bots list
      fetchBots();
    } catch (error: any) {
      console.error('Error verifying bot:', error);
      toast({
        title: "Fehler beim Verifizieren des Bots",
        description: error.message || "Beim Verifizieren des Bots ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const deleteBot = async (botId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diesen Bot löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
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
        title: "Bot gelöscht",
        description: "Der Bot wurde erfolgreich gelöscht.",
      });
      
      // Refresh the bots list
      fetchBots();
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      toast({
        title: "Fehler beim Löschen des Bots",
        description: error.message || "Beim Löschen des Bots ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const deleteServer = async (serverId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diesen Server löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
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
        title: "Server gelöscht",
        description: "Der Server wurde erfolgreich gelöscht.",
      });
      
      // Refresh the servers list
      fetchServers();
    } catch (error: any) {
      console.error('Error deleting server:', error);
      toast({
        title: "Fehler beim Löschen des Servers",
        description: error.message || "Beim Löschen des Servers ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div>Wird geladen...</div>
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
            <h1 className="text-3xl font-bold">Admin-Panel</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/add-server">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Server hinzufügen
              </Button>
            </Link>
            <Link to="/add-bot">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Bot hinzufügen
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="bots">Bots</TabsTrigger>
            <TabsTrigger value="pending">Ausstehende Bots</TabsTrigger>
            <TabsTrigger value="servers">Discord-Server</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>Benutzer insgesamt</CardTitle>
                  <CardDescription>Registrierte Benutzer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{users.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>Bots insgesamt</CardTitle>
                  <CardDescription>Verifizierte Bots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{bots.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>Ausstehende Verifizierung</CardTitle>
                  <CardDescription>Prüfung erforderlich</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingBots.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
                <CardHeader className="pb-2">
                  <CardTitle>Server insgesamt</CardTitle>
                  <CardDescription>Discord-Server</CardDescription>
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
                      Benutzerverwaltung
                    </CardTitle>
                    <CardDescription>Benutzer verwalten und Berechtigungen zuweisen</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchUsers}
                    disabled={loadingUsers}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
                    Aktualisieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Benutzername</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Beigetreten</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
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
                            {user.is_admin ? "Admin-Rechte entfernen" : "Zum Admin machen"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          {loadingUsers ? "Wird geladen..." : "Keine Benutzer gefunden"}
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
                      Verifizierte Bots
                    </CardTitle>
                    <CardDescription>Bot-Verwaltung</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchBots}
                    disabled={loadingBots}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingBots ? 'animate-spin' : ''}`} />
                    Aktualisieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot-Name</TableHead>
                      <TableHead>Besitzer</TableHead>
                      <TableHead>Hinzugefügt</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bots.map((bot) => (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell className="text-muted-foreground">{bot.profiles?.username || 'Unbekannt'}</TableCell>
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
                            Löschen
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {bots.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          {loadingBots ? "Wird geladen..." : "Keine Bots gefunden"}
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
                      Ausstehende Verifizierung
                    </CardTitle>
                    <CardDescription>Bot-Überprüfung</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchBots}
                    disabled={loadingBots}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingBots ? 'animate-spin' : ''}`} />
                    Aktualisieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot-Name</TableHead>
                      <TableHead>Besitzer</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead>Hinzugefügt</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBots.map((bot) => (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell className="text-muted-foreground">{bot.profiles?.username || 'Unbekannt'}</TableCell>
                        <TableCell className="text-muted-foreground truncate">{bot.short_description || 'Keine Beschreibung'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(bot.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                            onClick={() => verifyBot(bot.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Genehmigen
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                            onClick={() => deleteBot(bot.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Ablehnen
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingBots.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          {loadingBots ? "Wird geladen..." : "Keine ausstehenden Bots"}
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
                      Discord-Server
                    </CardTitle>
                    <CardDescription>Server-Verwaltung</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/add-server">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Server hinzufügen
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchServers}
                      disabled={loadingServers}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingServers ? 'animate-spin' : ''}`} />
                      Aktualisieren
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Server-Name</TableHead>
                      <TableHead>Besitzer</TableHead>
                      <TableHead>Mitglieder</TableHead>
                      <TableHead>Hinzugefügt</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">{server.name}</TableCell>
                        <TableCell className="text-muted-foreground">{server.profiles?.username || 'Unbekannt'}</TableCell>
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
                            Löschen
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {servers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          {loadingServers ? "Wird geladen..." : "Keine Server gefunden"}
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
            <DialogTitle>Benutzerdetails</DialogTitle>
            <DialogDescription>Detaillierte Informationen über den Benutzer</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">Benutzername:</div>
                <div>{selectedUser.username || 'Kein Benutzername'}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">ID:</div>
                <div className="break-all">{selectedUser.id}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">Registriert:</div>
                <div>{new Date(selectedUser.created_at).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">Zuletzt aktualisiert:</div>
                <div>{new Date(selectedUser.updated_at).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="font-medium">Admin-Status:</div>
                <div>{selectedUser.is_admin ? 'Administrator' : 'Normaler Benutzer'}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setUserDialogOpen(false)}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

