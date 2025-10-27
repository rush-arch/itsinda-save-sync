-- Create enum for group categories
CREATE TYPE public.group_category AS ENUM ('women', 'youth', 'family');

-- Create enum for event types
CREATE TYPE public.event_type AS ENUM ('saving', 'meeting', 'profit_distribution');

-- Create groups table
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category group_category NOT NULL,
  location TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT,
  description TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  current_balance DECIMAL(15,2) DEFAULT 0,
  next_saving_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image TEXT,
  preview TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published BOOLEAN DEFAULT true
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  photo TEXT,
  quote TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tips table
CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type event_type NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  photo TEXT,
  total_savings DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_balance DECIMAL(15,2) DEFAULT 0,
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups (public read)
CREATE POLICY "Anyone can view groups" ON public.groups FOR SELECT USING (true);

-- RLS Policies for blog_posts (public read published posts)
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);

-- RLS Policies for testimonials (public read active)
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials FOR SELECT USING (active = true);

-- RLS Policies for faqs (public read active)
CREATE POLICY "Anyone can view active faqs" ON public.faqs FOR SELECT USING (active = true);

-- RLS Policies for tips (public read active)
CREATE POLICY "Anyone can view active tips" ON public.tips FOR SELECT USING (active = true);

-- RLS Policies for events (public read)
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);

-- RLS Policies for profiles (users can view their own)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLS Policies for group_members
CREATE POLICY "Users can view their own memberships" ON public.group_members FOR SELECT USING (auth.uid()::text = user_id::text);

-- Insert sample data
INSERT INTO public.groups (name, category, location, size, thumbnail, description, member_count) VALUES
('Abishyizehamwe Women Group', 'women', 'Kigali', 25, null, 'Supporting women entrepreneurs in Kigali', 25),
('Youth Savings Circle', 'youth', 'Musanze', 15, null, 'Young professionals building their future', 15),
('Family Unity Fund', 'family', 'Huye', 30, null, 'Family-based savings and support', 30);

INSERT INTO public.blog_posts (title, image, preview, content) VALUES
('How to grow your savings easily', null, 'Learn simple strategies to increase your savings over time', 'Start by setting clear goals and automating your savings...'),
('New feature: Pay via Airtel Money now live!', null, 'We are excited to announce integration with Airtel Money', 'You can now make payments directly through Airtel Money...'),
('Success Story: Abizera Group grows savings by 30%', null, 'See how one group achieved remarkable growth', 'The Abizera Group started with just 10 members...');

INSERT INTO public.testimonials (name, location, quote, display_order) VALUES
('Jeanette', 'Kigali', 'I used to lose track of savings, but now I see everything clearly on Itsinda.', 1),
('Eric', 'Musanze', 'Our group now finalizes reports automatically!', 2);

INSERT INTO public.faqs (question, answer, display_order) VALUES
('What is an Itsinda group?', 'A community of people saving and borrowing together digitally.', 1),
('Can I join more than one group?', 'Yes, depending on your verified account level.', 2),
('How do I start saving?', 'Join a group, set your savings goal, and start contributing regularly.', 3);

INSERT INTO public.tips (content, display_order) VALUES
('Did you know you can earn interest on your group savings monthly?', 1),
('Did you know your data is fully encrypted on Itsinda?', 2),
('Regular small contributions add up faster than you think!', 3);