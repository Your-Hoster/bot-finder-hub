
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCw } from 'lucide-react';
import ServerSearch from './ServerSearch';

interface ServerHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchServers: () => Promise<void>;
}

const ServerHeader = ({ searchTerm, setSearchTerm, fetchServers }: ServerHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Discord Server</h1>
        <p className="text-muted-foreground mt-2">
          Durchsuchen und trete aktiven Discord-Communities bei
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <ServerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
  );
};

export default ServerHeader;
