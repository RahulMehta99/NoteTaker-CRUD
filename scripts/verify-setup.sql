-- Verification queries to check if everything is set up correctly

-- 1. Check if the notes table exists
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'notes';

-- 2. Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'notes'
ORDER BY ordinal_position;

-- 3. Check indexes
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'notes' AND schemaname = 'public';

-- 4. Check RLS policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'notes';

-- 5. Check triggers
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'notes';

-- 6. Check functions
SELECT 
    routine_name, 
    routine_type, 
    data_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'update_updated_at_column', 
    'handle_new_user', 
    'search_notes', 
    'get_user_note_count',
    'backup_user_notes'
);

-- 7. Test RLS (this should return 0 rows when not authenticated)
SELECT COUNT(*) as note_count FROM public.notes;

-- 8. Check if RLS is enabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'notes';
