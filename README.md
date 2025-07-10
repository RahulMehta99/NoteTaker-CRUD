# NoteTaker - Full-Stack Note-Taking Application

A modern, responsive note-taking application built with React, TypeScript, Next.js, and Supabase. Features secure authentication, real-time data sync, and a beautiful dark/light theme system.

![NoteTaker Screenshot](https://via.placeholder.com/800x400/21808D/FCFCF9?text=NoteTaker+Dashboard)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password and Google OAuth sign-in
- 📝 **Note Management** - Create, edit, delete, and organize your notes
- 🎨 **Theme System** - Beautiful light and dark themes with system detection
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Sync** - Powered by Supabase for instant updates
- 🔒 **Row Level Security** - Your notes are private and secure
- 🚀 **Fast Performance** - Built with Next.js 14 and optimized for speed
- 💾 **Auto-save** - Never lose your work with automatic saving
- 🔍 **Search Ready** - Full-text search capabilities built-in

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier available)

### 1. Clone & Install

\`\`\`bash
git clone <your-repository-url>
cd note-taking-app
npm install
\`\`\`

### 2. Database Setup

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `gbrkwwsscnzmwstvywfw`
3. **Open SQL Editor** and run the setup script:

\`\`\`sql
-- Copy and paste the entire content from scripts/setup-database.sql
-- This creates tables, security policies, and helpful functions
\`\`\`

### 3. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create Your Account

- Sign up with email or Google
- Start creating notes immediately
- Enjoy the clean, intuitive interface

## 📁 Project Structure

\`\`\`
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Sign-up page
│   │   └── callback/page.tsx       # OAuth callback handler
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── layout.tsx                  # Root layout with theme provider
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles and theme system
├── components/
│   └── theme-provider.tsx          # Theme management
├── lib/
│   ├── supabase.ts                 # Supabase client configuration
│   └── session-utils.ts            # Session management utilities
├── scripts/
│   ├── setup-database.sql          # Complete database setup
│   ├── verify-setup.sql            # Verification queries
│   └── configure-email-verification.sql
└── middleware.ts                   # Route protection
\`\`\`

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Next.js 14** - Full-stack React framework with App Router
- **CSS Custom Properties** - Modern styling with theme system
- **date-fns** - Date formatting and manipulation

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level security
- **Real-time subscriptions** - Live data updates

### Authentication
- **Supabase Auth** - Secure authentication system
- **Email/Password** - Traditional authentication
- **Google OAuth** - Social login integration
- **JWT tokens** - Secure session management

## 🔧 Configuration

### Environment Variables

The app uses hardcoded Supabase credentials for simplicity, but you can override them:

\`\`\`env
# .env.local (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Google OAuth Setup (Optional)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
4. Set redirect URL: `http://localhost:3000/auth/callback`

## 📊 Database Schema

### Notes Table
\`\`\`sql
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
\`\`\`

### Security Features
- **Row Level Security (RLS)** enabled
- Users can only access their own notes
- Automatic user_id association
- Secure API endpoints

## 🎨 Theme System

The app features a sophisticated theme system with:

- **Light Theme** - Clean, professional appearance
- **Dark Theme** - Easy on the eyes for night use
- **System Detection** - Automatically matches your OS preference
- **Manual Toggle** - Switch themes with a single click
- **Persistent Storage** - Remembers your preference

### Theme Colors

**Light Theme:**
- Background: `#FCFCF9` (Warm white)
- Primary: `#21808D` (Teal)
- Text: `#133C3B` (Dark teal)

**Dark Theme:**
- Background: `#1F2121` (Dark gray)
- Primary: `#32B8C6` (Bright teal)
- Text: `#F5F5F5` (Light gray)

## 🔒 Security Features

### Authentication Security
- JWT token-based authentication
- Automatic token refresh
- Secure session management
- OAuth integration with Google

### Database Security
- Row Level Security (RLS) policies
- User data isolation
- SQL injection protection
- Secure API endpoints

### Session Management
- Automatic session cleanup
- Corrupted session recovery
- Secure logout functionality
- Cross-tab session sync

## 📱 Responsive Design

The app is fully responsive and works great on:

- **Desktop** (1200px+) - Full feature set with optimal layout
- **Tablet** (768px-1199px) - Adapted layout for touch interaction
- **Mobile** (320px-767px) - Mobile-first design with touch-friendly UI

### Mobile Features
- Touch-friendly buttons and interactions
- Optimized modal dialogs
- Responsive grid layouts
- Mobile navigation patterns

## 🚀 Performance Optimizations

- **Next.js App Router** - Optimized routing and rendering
- **React Server Components** - Reduced client-side JavaScript
- **Automatic code splitting** - Faster page loads
- **Image optimization** - Optimized asset delivery
- **CSS optimization** - Minimal CSS bundle size

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Google OAuth (if configured)
- [ ] Email verification
- [ ] Logout functionality

**Notes Management:**
- [ ] Create new note
- [ ] Edit existing note
- [ ] Delete note
- [ ] View all notes
- [ ] Note persistence

**UI/UX:**
- [ ] Theme switching
- [ ] Responsive design
- [ ] Modal interactions
- [ ] Error handling
- [ ] Loading states

### Database Testing

Run verification queries:

\`\`\`sql
-- Check if setup is correct
SELECT * FROM information_schema.tables WHERE table_name = 'notes';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'notes';

-- Test note operations (after login)
SELECT COUNT(*) FROM notes WHERE user_id = auth.uid();
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

3. **Update Supabase URLs**
   - Add your production domain to Supabase redirect URLs
   - Update OAuth redirect URLs if using Google

### Environment Variables for Production

No additional environment variables needed - Supabase credentials are included in the code.

## 🛠️ Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Development Workflow

1. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Make your changes**
   - Edit components in `app/` directory
   - Update styles in `globals.css`
   - Modify database schema in `scripts/`

3. **Test your changes**
   - Test authentication flow
   - Verify note operations
   - Check responsive design
   - Test theme switching

4. **Deploy**
   - Push to GitHub
   - Vercel auto-deploys

## 🐛 Troubleshooting

### Common Issues

**"Invalid Refresh Token" Error:**
- Clear browser data (cookies, localStorage)
- The app automatically handles this error now
- Try logging in again

**Database Connection Issues:**
- Verify Supabase credentials
- Check if database setup script was run
- Ensure RLS policies are correctly configured

**Authentication Problems:**
- Check Supabase Auth settings
- Verify redirect URLs
- Clear browser cache

**Theme Not Working:**
- Check if ThemeProvider is wrapping the app
- Verify CSS custom properties are loaded
- Clear browser cache

### Debug Mode

Add this to see detailed logs:

\`\`\`javascript
// In lib/supabase.ts
console.log("Supabase client configuration:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add proper error handling
- Test on multiple devices
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend-as-a-service platform
- **Next.js** - For the excellent React framework
- **Vercel** - For seamless deployment and hosting
- **React** - For the powerful UI library

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Review the Supabase documentation**
3. **Check GitHub issues** for similar problems
4. **Create a new issue** with detailed information

---

**Built with ❤️ using React, TypeScript, Next.js, and Supabase**

*Happy note-taking! 📝*
