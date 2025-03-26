
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ServerCard from '@/components/ServerCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ServerListProps {
  servers: any[];
  loading: boolean;
  filteredServers: any[];
  searchTerm: string;
  currentTag: string | null;
  setSearchTerm: (term: string) => void;
  setCurrentTag: (tag: string | null) => void;
}

const ServerList = ({ 
  servers, 
  loading, 
  filteredServers, 
  searchTerm, 
  currentTag, 
  setSearchTerm, 
  setCurrentTag 
}: ServerListProps) => {
  if (loading) {
    return (
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
    );
  }

  if (filteredServers.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServers.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  );
};

export default ServerList;
