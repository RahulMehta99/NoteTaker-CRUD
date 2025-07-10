# Database Setup Instructions

## Quick Setup

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `gbrkwwsscnzmwstvywfw`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Setup Script**
   - Copy the entire content from `scripts/setup-database.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Setup**
   - Copy the content from `scripts/verify-setup.sql`
   - Run it to ensure everything is set up correctly

## What This Sets Up

### Tables
- **`notes`** - Main table for storing user notes with RLS enabled

### Security
- **Row Level Security (RLS)** - Users can only access their own notes
- **Policies** - SELECT, INSERT, UPDATE, DELETE policies for authenticated users
- **Indexes** - Performance optimization for queries

### Features
- **Auto-timestamps** - Automatic `created_at` and `updated_at` handling
- **Welcome note** - New users get a welcome note automatically
- **Full-text search** - Search functionality for notes
- **Data validation** - Title and content length constraints

### Functions
- `update_updated_at_column()` - Auto-update timestamps
- `handle_new_user()` - Create welcome note for new users
- `search_notes(text)` - Full-text search functionality
- `get_user_note_count()` - Get user's note count
- `backup_user_notes()` - Export user's notes as JSON

## Authentication Setup

### Enable Google OAuth (Optional)
1. Go to Authentication → Providers in Supabase Dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
4. Set redirect URL: `http://localhost:3000/auth/callback`

### Email Settings
1. Go to Authentication → Settings
2. Configure email templates if needed
3. Set up custom SMTP (optional)

## Environment Variables

Your Supabase credentials are already configured in the project:
- **URL**: `https://gbrkwwsscnzmwstvywfw.supabase.co`
- **Anon Key**: Already included in `lib/supabase.ts`

## Testing the Setup

After running the SQL scripts, test the setup:

1. **Create a user account** through your app
2. **Check if welcome note is created** automatically
3. **Test CRUD operations** (Create, Read, Update, Delete notes)
4. **Verify RLS** - Users should only see their own notes

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Make sure you're running the SQL as the project owner
   - Check if RLS policies are correctly set up

2. **Function Not Found**
   - Ensure all functions are created in the `public` schema
   - Check function permissions

3. **Trigger Not Working**
   - Verify trigger is created and enabled
   - Check trigger function exists

### Useful Queries

\`\`\`sql
-- Check if RLS is working
SELECT auth.uid(); -- Should return user ID when authenticated

-- Check user's notes
SELECT * FROM notes WHERE user_id = auth.uid();

-- Test search function
SELECT * FROM search_notes('welcome');

-- Get note count
SELECT get_user_note_count();
\`\`\`

## Production Considerations

1. **Backup Strategy** - Set up regular backups
2. **Monitoring** - Monitor database performance
3. **Scaling** - Consider connection pooling for high traffic
4. **Security** - Regular security audits
5. **Maintenance** - Periodic cleanup of orphaned data

## Support

If you encounter issues:
1. Check the Supabase logs in the Dashboard
2. Verify your SQL syntax
3. Ensure proper permissions are set
4. Contact Supabase support if needed
