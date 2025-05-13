-- Enable RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to insert their own profile (typically handled by auth triggers or specific functions, but good to have a basic policy)
-- This assumes 'id' in profiles is the foreign key to auth.users.id
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Optionally, prevent users from deleting their own profiles directly via this policy
-- Deletion might be handled by specific admin actions or designated functions.
-- CREATE POLICY "Users cannot delete profiles"
-- ON public.profiles FOR DELETE
-- TO authenticated
-- USING (false);

-- Ensure that the public user (anon role) cannot access profiles
-- This is often a default or can be explicitly set.
-- If you need some profile data to be public (e.g., username for public referral cards),
-- you would create a separate, more restrictive SELECT policy for the anon role on specific columns.
-- For now, this ensures no anon access by default if RLS is on and no anon policy exists. 