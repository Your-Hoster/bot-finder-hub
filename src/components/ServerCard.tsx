
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, ExternalLink, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type ServerCardProps = {
  server: {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    member_count: number;
    invite_url: string | null;
    tags: string[] | null;
  };
};

const ServerCard = ({ server }: ServerCardProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const copyInviteLink = () => {
    if (server.invite_url) {
      navigator.clipboard.writeText(server.invite_url);
      toast({
        title: "Link kopiert",
        description: "Einladungslink wurde in die Zwischenablage kopiert.",
      });
    }
  };

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className={`h-12 w-12 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              <AvatarImage src={server.icon_url || ''} alt={server.name} />
              <AvatarFallback>{server.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{server.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {server.member_count?.toLocaleString()} Mitglieder
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {server.description || 'Keine Beschreibung vorhanden'}
        </p>
        {server.tags && server.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {server.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
        {server.invite_url ? (
          <>
            <Button className="flex-1" asChild>
              <a href={server.invite_url} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Beitreten
              </a>
            </Button>
            <Button variant="outline" size="icon" onClick={copyInviteLink}>
              <Share2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button className="w-full" disabled>Kein Einladungslink</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServerCard;
