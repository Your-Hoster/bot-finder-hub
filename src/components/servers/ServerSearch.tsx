
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ServerSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ServerSearch = ({ searchTerm, setSearchTerm }: ServerSearchProps) => {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Server suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-8"
      />
    </div>
  );
};

export default ServerSearch;
