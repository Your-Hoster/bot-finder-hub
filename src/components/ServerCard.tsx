
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, ExternalLink } from 'lucide-react';

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
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={server.icon_url || ''} alt={server.name} />
              <AvatarFallback>{server.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{server.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {server.member_count?.toLocaleString()} members
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {server.description || 'No description provided'}
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
      <CardFooter className="border-t pt-4">
        {server.invite_url ? (
          <Button className="w-full" asChild>
            <a href={server.invite_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Join Server
            </a>
          </Button>
        ) : (
          <Button className="w-full" disabled>No Invite Link</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServerCard;
