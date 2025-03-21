
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ChevronRight, Star, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample featured bots
  const featuredBots = [
    {
      id: '123456789',
      name: 'Moderation Bot',
      description: 'A powerful moderation bot for your Discord server',
      tags: ['moderation', 'admin'],
      stars: 4.5,
      image: 'https://via.placeholder.com/200'
    },
    {
      id: '987654321',
      name: 'Music Master',
      description: 'The best music bot with high-quality audio',
      tags: ['music', 'audio'],
      stars: 4.8,
      image: 'https://via.placeholder.com/200'
    },
    {
      id: '456789123',
      name: 'Game Stats',
      description: 'Track game stats and leaderboards',
      tags: ['games', 'stats'],
      stars: 4.2,
      image: 'https://via.placeholder.com/200'
    },
    {
      id: '321654987',
      name: 'Welcome Bot',
      description: 'Customize welcome messages for new members',
      tags: ['welcome', 'greetings'],
      stars: 4.0,
      image: 'https://via.placeholder.com/200'
    }
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search page with the query
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 bg-primary/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('home.title')}
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('home.subtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="text"
                    placeholder={t('home.search-placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-l-lg rounded-r-none border-r-0"
                  />
                </div>
                <Button type="submit" className="h-12 px-6 rounded-l-none">
                  {t('misc.search')}
                </Button>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button asChild size="lg" className="group">
                <Link to="/bots">
                  {t('home.explore')}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/add-bot">
                  {t('nav.add-bot')}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Bots Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              <Zap className="inline-block mr-2 h-6 w-6 text-primary" />
              {t('home.featured')}
            </h2>
            <Button asChild variant="ghost">
              <Link to="/bots" className="group flex items-center">
                View all
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBots.map((bot, index) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full card-hover overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={bot.image} 
                      alt={bot.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">{bot.stars}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="line-clamp-2">
                      {bot.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="flex gap-2">
                      {bot.tags.map(tag => (
                        <span key={tag} className="inline-block px-2 py-1 text-xs bg-secondary rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" variant="ghost" asChild className="p-0 h-auto">
                      <Link to={`/bots/${bot.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Find The Perfect Bot For Your Server
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to discover, add, and manage Discord bots to enhance your server experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 glass-subtle">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover</h3>
                <p className="text-muted-foreground">
                  Search and browse through our collection of high-quality Discord bots.
                </p>
              </motion.div>
            </Card>
            
            <Card className="text-center p-6 glass-subtle">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Add</h3>
                <p className="text-muted-foreground">
                  Easily add bots to your server with just a few clicks.
                </p>
              </motion.div>
            </Card>
            
            <Card className="text-center p-6 glass-subtle">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Review</h3>
                <p className="text-muted-foreground">
                  Share your experience and help others find the best bots.
                </p>
              </motion.div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to enhance your Discord server?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of server owners who are using our platform to find the perfect bots.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/register">
                Create an account
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
