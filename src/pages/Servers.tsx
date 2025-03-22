import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PlusIcon, Search, Filter, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ServerCard from '@/components/ServerCard';

const mockServers = [
  {
    id: '1',
    name: 'Gaming Community',
    description: 'A friendly server for gamers of all types. Join us for game nights, tournaments, and discussions.',
    icon_url: 'https://picsum.photos/id/237/200',
    member_count: 1250,
    invite_url: 'https://discord.gg/example1',
    tags: ['gaming', 'community', 'esports'],
  },
  {
    id: '2',
    name: 'Anime Fans',
    description: 'Discuss your favorite anime, manga, and Japanese culture. Weekly watch parties!',
    icon_url: 'https://picsum.photos/id/239/200',
    member_count: 3420,
    invite_url: 'https://discord.gg/example2',
    tags: ['anime', 'manga', 'japan'],
  },
  {
    id: '3',
    name: 'Developers Hub',
    description: 'A place for developers to collaborate, learn and share knowledge about coding and technology.',
    icon_url: 'https://picsum.photos/id/241/200',
    member_count: 780,
    invite_url: 'https://discord.gg/example3',
    tags: ['programming', 'technology', 'coding'],
  },
  {
    id: '4',
    name: 'Music Lovers',
    description: 'Share and discover music of all genres. Live DJ sessions every weekend!',
    icon_url: 'https://picsum.photos/id/248/200',
    member_count: 2100,
    invite_url: 'https://discord.gg/example4',
    tags: ['music', 'dj', 'concerts'],
  },
  {
    id: '5',
    name: 'Art Gallery',
    description: 'Showcase your artwork, get feedback, and join art challenges. All skill levels welcome!',
    icon_url: 'https://picsum.photos/id/249/200',
    member_count: 940,
    invite_url: 'https://discord.gg/example5',
    tags: ['art', 'drawing', 'design'],
  },
  {
    id: '6',
    name: 'Movie Club',
    description: 'Daily discussions about movies, TV shows, and cinema. Weekend watch parties!',
    icon_url: 'https://picsum.photos/id/250/200',
    member_count: 1650,
    invite_url: 'https://discord.gg/example6',
    tags: ['movies', 'cinema', 'tv-shows'],
  },
];

const Servers = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    fetchServers();
  }, [toast]);
  
  const fetchServers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setServers(data);
        
        const tags = new Set<string>();
        data.forEach(server => {
          if (server.tags && Array.isArray(server.tags)) {
            server.tags.forEach((tag: string) => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      } else {
        setServers(mockServers);
        
        const tags = new Set<string>();
        mockServers.forEach(server => {
          if (server.tags && Array.isArray(server.tags)) {
            server.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      }
    } catch (error: any) {
      console.error('Error fetching servers:', error);
      toast({
        title: "Fehler beim Abrufen der Server",
        description: "Server konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
      setServers(mockServers);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      server.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = currentTag 
      ? server.tags && server.tags.includes(currentTag)
      : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Discord Server</h1>
          <p className="text-muted-foreground mt-2">
            Durchsuchen und trete aktiven Discord-Communities bei
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Server suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={fetchServers}
            className="hidden sm:flex"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Aktualisieren
          </Button>
          <Button asChild>
            <Link to="/add-server">
              <PlusIcon className="mr-2 h-4 w-4" />
              Server hinzufügen
            </Link>
          </Button>
        </div>
      </div>
      
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={currentTag === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setCurrentTag(null)}
          >
            Alle
          </Button>
          {allTags.map(tag => (
            <Button 
              key={tag} 
              variant={currentTag === tag ? "default" : "outline"} 
              size="sm"
              onClick={() => setCurrentTag(tag === currentTag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-80">
              <CardHeader className="flex flex-col space-y-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Keine Server gefunden</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm || currentTag ? 
              `Keine Server, die Ihren Suchkriterien entsprechen, wurden gefunden.` : 
              'Sei der Erste, der einen Server in unser Verzeichnis aufnimmt!'
            }
          </p>
          {!(searchTerm || currentTag) && (
            <Button className="mt-4" asChild>
              <Link to="/add-server">Deinen Server hinzufügen</Link>
            </Button>
          )}
          {(searchTerm || currentTag) && (
            <Button className="mt-4" variant="outline" onClick={() => {
              setSearchTerm('');
              setCurrentTag(null);
            }}>
              Filter löschen
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Servers;
