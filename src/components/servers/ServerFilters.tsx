
import { Button } from '@/components/ui/button';

interface ServerFiltersProps {
  allTags: string[];
  currentTag: string | null;
  setCurrentTag: (tag: string | null) => void;
}

const ServerFilters = ({ allTags, currentTag, setCurrentTag }: ServerFiltersProps) => {
  if (allTags.length === 0) {
    return null;
  }
  
  return (
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
  );
};

export default ServerFilters;
