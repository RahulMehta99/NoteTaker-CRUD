-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create the notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON public.notes(created_at DESC);
CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON public.notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS notes_title_idx ON public.notes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS notes_content_idx ON public.notes USING gin(to_tsvector('english', content));

-- Enable Row Level Security (RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;

-- Create RLS policies
CREATE POLICY "Users can view own notes" ON public.notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON public.notes
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to handle user profile updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- You can add any additional user setup logic here
    -- For example, creating a welcome note for new users
    INSERT INTO public.notes (title, content, user_id)
    VALUES (
        'Welcome to NoteTaker! 🎉',
        'This is your first note! You can:

• Create new notes by clicking the + button
• Edit notes by clicking on them
• Delete notes using the trash icon
• Switch between light and dark themes
• Access your profile information

Start taking notes and stay organized!',
        NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.notes TO authenticated;
GRANT SELECT ON public.notes TO anon;

-- Create a view for note statistics (optional)
CREATE OR REPLACE VIEW public.user_note_stats AS
SELECT 
    user_id,
    COUNT(*) as total_notes,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as notes_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as notes_this_week,
    MAX(updated_at) as last_updated
FROM public.notes
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.user_note_stats TO authenticated;

-- Create a function for full-text search (optional)
CREATE OR REPLACE FUNCTION public.search_notes(search_query TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.content,
        n.created_at,
        n.updated_at,
        ts_rank(
            to_tsvector('english', n.title || ' ' || n.content),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM public.notes n
    WHERE 
        n.user_id = auth.uid() AND
        (
            to_tsvector('english', n.title || ' ' || n.content) @@ plainto_tsquery('english', search_query)
        )
    ORDER BY rank DESC, n.updated_at DESC;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- Grant execute permission on search function
GRANT EXECUTE ON FUNCTION public.search_notes(TEXT) TO authenticated;

-- Create a function to get note count for a user
CREATE OR REPLACE FUNCTION public.get_user_note_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM public.notes 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_note_count() TO authenticated;

-- Insert some sample data (optional - remove if you don't want sample data)
-- This will only work after you have at least one user in your system
/*
INSERT INTO public.notes (title, content, user_id) VALUES
('Getting Started with NoteTaker', 
'Welcome to NoteTaker! This is a sample note to help you get started.

Here are some tips:
• Click the + button to create a new note
• Click on any note to edit it
• Use the trash icon to delete notes
• Toggle between light and dark themes

Happy note-taking!', 
'00000000-0000-0000-0000-000000000000'), -- Replace with actual user ID

('Project Ideas', 
'Here are some project ideas I want to work on:

1. Build a personal website
2. Learn a new programming language
3. Create a mobile app
4. Start a blog
5. Contribute to open source

I should prioritize these based on my current goals and available time.', 
'00000000-0000-0000-0000-000000000000'), -- Replace with actual user ID

('Shopping List', 
'Groceries needed for this week:

🥛 Milk
🍞 Bread  
🥚 Eggs
🍎 Apples
🥕 Carrots
🧀 Cheese
🍗 Chicken
🍝 Pasta

Don''t forget to check for coupons before going to the store!', 
'00000000-0000-0000-0000-000000000000'); -- Replace with actual user ID
*/

-- Create a backup function (optional)
CREATE OR REPLACE FUNCTION public.backup_user_notes()
RETURNS JSON AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'id', id,
                'title', title,
                'content', content,
                'created_at', created_at,
                'updated_at', updated_at
            )
        )
        FROM public.notes
        WHERE user_id = auth.uid()
        ORDER BY created_at DESC
    );
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.backup_user_notes() TO authenticated;

-- Add some constraints for data integrity
ALTER TABLE public.notes 
ADD CONSTRAINT notes_title_length CHECK (char_length(title) <= 200);

ALTER TABLE public.notes 
ADD CONSTRAINT notes_content_length CHECK (char_length(content) <= 50000);

-- Create a function to clean up old deleted users' data (maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_notes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.notes 
    WHERE user_id NOT IN (SELECT id FROM auth.users);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- This should be run periodically by an admin
-- GRANT EXECUTE ON FUNCTION public.cleanup_orphaned_notes() TO service_role;

-- Final verification queries (run these to check if everything is set up correctly)
-- SELECT * FROM information_schema.tables WHERE table_name = 'notes';
-- SELECT * FROM information_schema.columns WHERE table_name = 'notes';
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'notes';
