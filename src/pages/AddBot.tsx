
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const botSchema = z.object({
  name: z.string().min(3, "Bot name must be at least 3 characters").max(100),
  discord_id: z.string().min(17, "Discord ID must be valid").max(20),
  prefix: z.string().optional(),
  short_description: z.string().max(100, "Short description must be less than 100 characters"),
  description: z.string().max(4000, "Description must be less than 4000 characters"),
  invite_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  tags: z.string().optional(),
});

type BotFormValues = z.infer<typeof botSchema>;

const AddBot = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BotFormValues>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      name: "",
      discord_id: "",
      prefix: "",
      short_description: "",
      description: "",
      invite_url: "",
      github_url: "",
      website_url: "",
      image_url: "",
      tags: "",
    },
  });

  const onSubmit = async (values: BotFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to add a bot.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert comma-separated tags to array
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

      const { error } = await supabase
        .from('bots')
        .insert({
          name: values.name,
          discord_id: values.discord_id,
          prefix: values.prefix || null,
          short_description: values.short_description,
          description: values.description,
          invite_url: values.invite_url || null,
          github_url: values.github_url || null,
          website_url: values.website_url || null,
          image_url: values.image_url || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Bot added successfully!",
        description: "Your bot has been added to our directory.",
      });
      
      navigate('/bots');
    } catch (error: any) {
      console.error('Error adding bot:', error);
      toast({
        title: "Error adding bot",
        description: error.message || "An error occurred while adding your bot.",
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
            <CardTitle className="text-2xl">Add Your Discord Bot</CardTitle>
            <CardDescription>
              Fill out the form below to add your Discord bot to our directory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Bot" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discord_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord ID</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789012345678" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your bot's Discord application ID
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Command Prefix</FormLabel>
                        <FormControl>
                          <Input placeholder="!" {...field} />
                        </FormControl>
                        <FormDescription>
                          The character(s) users type before commands
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
                          <Input placeholder="moderation, fun, music" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of tags
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input placeholder="A brief description of your bot" {...field} />
                      </FormControl>
                      <FormDescription>
                        Max 100 characters, shown in listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of what your bot does, features, and how to use it" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Markdown supported
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
                          <Input placeholder="https://discord.com/api/oauth2/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/bot-avatar.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://mybotwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding Bot..." : "Add Bot"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddBot;
