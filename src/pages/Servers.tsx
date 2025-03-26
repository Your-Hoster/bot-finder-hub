
import { useServerData } from '@/hooks/useServerData';
import ServerHeader from '@/components/servers/ServerHeader';
import ServerFilters from '@/components/servers/ServerFilters';
import ServerList from '@/components/servers/ServerList';

const Servers = () => {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    currentTag,
    setCurrentTag,
    allTags,
    fetchServers,
    filteredServers
  } = useServerData();
  
  return (
    <div className="container py-8">
      <ServerHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        fetchServers={fetchServers} 
      />
      
      <ServerFilters 
        allTags={allTags} 
        currentTag={currentTag} 
        setCurrentTag={setCurrentTag} 
      />
      
      <ServerList 
        servers={[]} 
        loading={loading} 
        filteredServers={filteredServers} 
        searchTerm={searchTerm} 
        currentTag={currentTag} 
        setSearchTerm={setSearchTerm} 
        setCurrentTag={setCurrentTag} 
      />
    </div>
  );
};

export default Servers;
