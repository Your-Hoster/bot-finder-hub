
export type Bot = {
  id: string;
  name: string;
  discord_id: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  invite_url: string | null;
  support_url: string | null;
  website_url: string | null;
  github_url: string | null;
  prefix: string | null;
  user_id: string | null;
  stars: number | null;
  verified: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  profiles?: {
    username: string | null;
  } | null;
};
