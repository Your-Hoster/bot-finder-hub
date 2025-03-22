import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';

const serverSchema = z.object({
  name: z.string().min(3, "Server name must be at least 3 characters").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  invite_url: z.string().url("Must be a valid Discord invite URL").startsWith("https://discord.gg/", "Must be a Discord invite link"),
  icon_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  tags: z.string().optional(),
  member_count: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Member count must be a positive number",
  }),
});

type ServerFormValues = z.infer<typeof serverSchema>;

const AddServer = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
      invite_url: "",
      icon_url: "",
      tags: "",
      member_count: "",
    },
  });

  const onSubmit = async (values: ServerFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to add a server.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert comma-separated tags to array
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      // Insert the server into the Supabase database
      const { error } = await supabase
        .from('servers')
        .insert({
          name: values.name,
          description: values.description,
          invite_url: values.invite_url,
          icon_url: values.icon_url || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          member_count: parseInt(values.member_count),
          user_id: user.id,
        });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Server added successfully!",
        description: "Your server has been added to our directory.",
      });
      
      navigate('/servers');
    } catch (error: any) {
      console.error('Error adding server:', error);
      toast({
        title: "Error adding server",
        description: error.message || "An error occurred while adding your server.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Add Your Discord Server</CardTitle>
            <CardDescription>
              Fill out the form below to add your Discord server to our directory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Server" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what your server is about and what members can expect" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="invite_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invite URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://discord.gg/example" {...field} />
                        </FormControl>
                        <FormDescription>
                          Must be a valid Discord invite link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="member_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member Count</FormLabel>
                        <FormControl>
                          <Input placeholder="1000" type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Approximate number of members
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="icon_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Icon URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/server-icon.png" {...field} />
                        </FormControl>
                        <FormDescription>
                          Direct link to your server icon (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="gaming, community, music" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of tags
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding Server..." : "Add Server"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddServer;
