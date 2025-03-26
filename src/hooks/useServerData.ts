
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock data for fallback
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

export const useServerData = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
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
        
        // Extract all unique tags from servers
        const tags = new Set<string>();
        data.forEach(server => {
          if (server.tags && Array.isArray(server.tags)) {
            server.tags.forEach((tag: string) => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      } else {
        // Use mock data if no servers are found
        setServers(mockServers);
        
        // Extract all unique tags from mock servers
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

  useEffect(() => {
    fetchServers();
  }, [toast]);
  
  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      server.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = currentTag 
      ? server.tags && server.tags.includes(currentTag)
      : true;
    
    return matchesSearch && matchesTag;
  });

  return {
    servers,
    loading,
    searchTerm,
    setSearchTerm,
    currentTag,
    setCurrentTag,
    allTags,
    fetchServers,
    filteredServers
  };
};
