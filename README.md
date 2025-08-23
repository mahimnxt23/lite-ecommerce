# E-Commerce App

A modern e-commerce application built with Next.js 15, TypeScript, TailwindCSS, Better Auth, Neon PostgreSQL, Drizzle ORM, and Zustand.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Better Auth
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **State Management**: Zustand
- **Linting**: ESLint

## 📦 Features

- ✅ Modern Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ TailwindCSS for styling
- ✅ Better Auth for authentication (email/password + OAuth)
- ✅ Neon PostgreSQL database
- ✅ Drizzle ORM for type-safe database queries
- ✅ Zustand for state management
- ✅ ESLint for code quality
- ✅ Database schema for users, products, orders, and cart

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Fill in the following variables in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Database Setup

Create your database tables:

```bash
npm run db:push
```

Or generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/[...all]/route.ts  # Better Auth API routes
│   └── page.tsx                    # Homepage
├── lib/
│   ├── auth/
│   │   └── index.ts               # Better Auth configuration
│   └── db/
│       ├── index.ts               # Database connection
│       └── schema.ts              # Database schema
└── store/
    ├── auth.ts                    # Authentication state
    └── cart.ts                    # Shopping cart state
```

## 🗄️ Database Schema

The application includes the following tables:

- **users**: User accounts and profiles
- **sessions**: User sessions for Better Auth
- **accounts**: OAuth accounts and credentials
- **verifications**: Email verification tokens
- **products**: Product catalog
- **orders**: Customer orders
- **order_items**: Individual items in orders

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## 🔐 Authentication

The app uses Better Auth with support for:

- Email/password authentication
- GitHub OAuth (optional)
- Google OAuth (optional)
- Session management
- Email verification

## 🛒 State Management

Zustand stores are configured for:

- **Authentication**: User login state and profile
- **Shopping Cart**: Cart items, quantities, and totals

## 📝 Next Steps

1. Set up your Neon PostgreSQL database
2. Configure your OAuth providers (optional)
3. Customize the UI and add your branding
4. Implement product management
5. Add payment processing
6. Deploy to your preferred platform

## 🚀 Deployment

This app can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any platform supporting Node.js

Make sure to set your environment variables in your deployment platform.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
