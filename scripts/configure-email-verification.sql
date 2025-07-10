-- Ensure email confirmation is required for new signups
-- This should be run in your Supabase SQL Editor

-- Check current auth configuration
SELECT key, value FROM auth.config WHERE key LIKE '%email%';

-- Update auth configuration to require email confirmation
-- Note: These settings are typically managed through the Supabase Dashboard
-- Go to Authentication > Settings to configure these properly

-- Check if there are any unverified users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Not Verified'
        ELSE 'Verified'
    END as verification_status
FROM auth.users 
ORDER BY created_at DESC;

-- Function to check user verification status
CREATE OR REPLACE FUNCTION public.is_user_verified(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = user_id 
        AND email_confirmed_at IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_user_verified(UUID) TO authenticated;

-- Update RLS policies to ensure only verified users can access notes
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;

-- Create new policies that check email verification
CREATE POLICY "Verified users can view own notes" ON public.notes
    FOR SELECT USING (
        auth.uid() = user_id 
        AND public.is_user_verified(auth.uid())
    );

CREATE POLICY "Verified users can insert own notes" ON public.notes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id 
        AND public.is_user_verified(auth.uid())
    );

CREATE POLICY "Verified users can update own notes" ON public.notes
    FOR UPDATE USING (
        auth.uid() = user_id 
        AND public.is_user_verified(auth.uid())
    ) WITH CHECK (
        auth.uid() = user_id 
        AND public.is_user_verified(auth.uid())
    );

CREATE POLICY "Verified users can delete own notes" ON public.notes
    FOR DELETE USING (
        auth.uid() = user_id 
        AND public.is_user_verified(auth.uid())
    );
