# NoteTaker - Full-Stack Note-Taking Application

A modern, responsive note-taking application built with React, TypeScript, Next.js, and Supabase.

## Quick Start Guide

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set Up Database
1. Go to your Supabase dashboard: https://gbrkwwsscnzmwstvywfw.supabase.co
2. Navigate to SQL Editor
3. Run the script from `scripts/create-notes-table.sql`

### 3. Configure Google OAuth (Optional)
1. In Supabase dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL: `http://localhost:3000/auth/callback`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 5. Open Application
Visit: http://localhost:3000

## Features

- 🔐 **Authentication**: Email/OTP and Google OAuth sign-up/sign-in
- 📝 **Note Management**: Create, view, and delete notes
- 👤 **User Profiles**: Display user information and personalized dashboard
- 🔒 **Security**: JWT-based authorization with Row Level Security (RLS)
- 📱 **Responsive Design**: Mobile-friendly interface
- ⚡ **Real-time**: Built with Supabase for real-time capabilities
- 🎨 **Modern UI**: Clean, intuitive design with shadcn/ui components

## Technology Stack

- **Frontend**: React 18, TypeScript, Next.js 14
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: shadcn/ui, Tailwind CSS
- **Authentication**: Supabase Auth (Email/OTP + Google OAuth)
- **Database**: PostgreSQL with Row Level Security
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project

## Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd note-taking-app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables

The Supabase credentials are already configured in the code:
- **Supabase URL**: https://gbrkwwsscnzmwstvywfw.supabase.co
- **Anon Key**: Already included in the project

### 4. Database Setup

Run the SQL script to create the notes table and set up Row Level Security:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of \`scripts/create-notes-table.sql\`
4. Execute the script

### 5. Configure Google OAuth (Optional)

To enable Google authentication:

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Enable Google provider
4. Add your Google OAuth credentials
5. Set the redirect URL to: \`http://localhost:3000/auth/callback\`

### 6. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Sign-up page
│   │   └── callback/page.tsx       # Auth callback handler
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── lib/
│   └── supabase.ts                 # Supabase client configuration
├── components/ui/                  # shadcn/ui components
├── scripts/
│   └── create-notes-table.sql      # Database schema
├── middleware.ts                   # Route protection
└── README.md
\`\`\`

## Key Features Implementation

### Authentication Flow
- **Email/OTP**: Users can sign up with email and verify via OTP
- **Google OAuth**: One-click sign-up/sign-in with Google
- **JWT Authorization**: Automatic token management via Supabase
- **Route Protection**: Middleware protects authenticated routes

### Note Management
- **Create Notes**: Modal dialog for creating new notes
- **View Notes**: Grid layout displaying all user notes
- **Delete Notes**: One-click note deletion with confirmation
- **Real-time Updates**: Automatic refresh after CRUD operations

### Security Features
- **Row Level Security**: Users can only access their own notes
- **JWT Tokens**: Automatic token refresh and validation
- **Input Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages and states

## Database Schema

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

### RLS Policies
- Users can only view, insert, update, and delete their own notes
- Automatic user_id association on insert
- Secure data isolation between users

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings
4. Update your Supabase redirect URLs to include your production domain

### Environment Variables for Production

No additional environment variables needed - Supabase credentials are included in the code.

## API Endpoints

The application uses Supabase's auto-generated REST API:

- **GET** \`/rest/v1/notes\` - Fetch user notes
- **POST** \`/rest/v1/notes\` - Create new note
- **DELETE** \`/rest/v1/notes?id=eq.{id}\` - Delete note

## Error Handling

- **Authentication Errors**: Invalid credentials, OTP failures
- **Validation Errors**: Required fields, password matching
- **API Errors**: Network failures, database errors
- **User Feedback**: Toast notifications and inline error messages

## Mobile Responsiveness

- Responsive grid layout for notes
- Mobile-optimized forms and dialogs
- Touch-friendly buttons and interactions
- Adaptive navigation and spacing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the Supabase documentation
3. Contact the development team

---

**Built with ❤️ using React, TypeScript, Next.js, and Supabase**
