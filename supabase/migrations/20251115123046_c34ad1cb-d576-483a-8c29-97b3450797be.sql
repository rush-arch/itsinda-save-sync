-- Add created_by to groups table
ALTER TABLE public.groups ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Create group_join_requests table
CREATE TABLE public.group_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_join_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
ON public.group_join_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create join requests
CREATE POLICY "Users can create requests"
ON public.group_join_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Group creators can view requests for their groups
CREATE POLICY "Creators can view group requests"
ON public.group_join_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.groups
    WHERE groups.id = group_join_requests.group_id
    AND groups.created_by = auth.uid()
  )
);

-- Group creators can update requests for their groups
CREATE POLICY "Creators can update requests"
ON public.group_join_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.groups
    WHERE groups.id = group_join_requests.group_id
    AND groups.created_by = auth.uid()
  )
);

-- Create group_messages table for chat
CREATE TABLE public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- Group members can view messages
CREATE POLICY "Members can view messages"
ON public.group_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = group_messages.group_id
    AND group_members.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.groups
    WHERE groups.id = group_messages.group_id
    AND groups.created_by = auth.uid()
  )
);

-- Group members can send messages
CREATE POLICY "Members can send messages"
ON public.group_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = group_messages.group_id
    AND group_members.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.groups
    WHERE groups.id = group_messages.group_id
    AND groups.created_by = auth.uid()
  )
);

-- Update groups RLS to allow creators to update their groups
CREATE POLICY "Creators can update groups"
ON public.groups
FOR UPDATE
USING (auth.uid() = created_by);

-- Allow authenticated users to create groups
CREATE POLICY "Users can create groups"
ON public.groups
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;