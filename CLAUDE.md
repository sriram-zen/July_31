# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, shadcn/ui components, Tailwind CSS, and Supabase authentication. The project uses the App Router architecture with Server Components and Server Actions. It's specifically designed as a modular event and donation management platform for trust organizations, featuring admin-controlled access, WhatsApp automation, digital payments, and robust audit trails.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Authentication Flow
- Supabase auth with SSR support using `@supabase/ssr`
- Server-side client: `src/utils/supabase/server.ts`
- Browser client: `src/utils/supabase/client.ts`
- Middleware handles auth state and protected routes: `src/utils/supabase/middleware.ts`
- Auth actions (sign-up, sign-in, forgot password, reset password, sign-out): `src/actions/auth.ts`

### Route Structure
- `/` - Redirects to `/protected` if authenticated, otherwise shows landing
- `/sign-in`, `/sign-up`, `/forgot-password` - Auth pages (grouped in `(auth-pages)`)
- `/protected/*` - Protected routes requiring authentication
- `/about`, `/gallery`, `/contact`, `/events`, `/instruments` - Public pages

### Authentication Patterns
- Protected routes automatically redirect to `/sign-in` if unauthenticated  
- Authenticated users on `/` redirect to `/protected`
- Server Actions handle form submissions with `encodedRedirect` for status messages
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Component Organization
- UI components from shadcn/ui in `src/components/ui/` (New York style)
- Custom components in `src/components/` including:
  - `main-nav.tsx` - Primary navigation with custom green theme (#043933)
  - `header-auth.tsx` - Authentication button component
  - `form-message.tsx` - Form feedback messages
  - `submit-button.tsx` - Loading state button component
  - `theme-switcher.tsx` - Dark/light theme toggle
- Uses `@/` alias for `src/` directory
- Form handling with `react-hook-form` and `zod` validation

### Styling and Branding
- Tailwind CSS v4 with CSS variables for theming
- Primary brand color: #043933 (dark green) - used consistently in navigation and key interface elements
- shadcn/ui configuration in `components.json` with New York style
- Global styles in `src/app/globals.css`
- Dark/light theme support via `next-themes`
- Mobile-first responsive design approach

### Key Architectural Patterns
- Server Components and Server Actions for data fetching and mutations
- Modular, API-driven architecture designed for multi-tenant replication
- Separation between public website and admin portal contexts
- Environment variable validation in `src/utils/supabase/check-env-vars.ts`
- Centralized utility functions in `src/lib/utils.ts` and `src/utils/utils.ts`

### Key Files to Check When Working on Auth
- `src/utils/supabase/middleware.ts` - Route protection logic
- `src/actions/auth.ts` - Server Actions for auth operations  
- `src/components/header-auth.tsx` - Auth button component
- `src/utils/supabase/check-env-vars.ts` - Environment validation

### Platform-Specific Context
- This is a trust/nonprofit management platform with admin-only data entry
- Devotee management with sequential ID assignment
- WhatsApp automation integration planned (via Business API)
- Payment gateway integration (Razorpay/Stripe) for digital donations
- Manual receipt generation for cash donations
- Audit trails and compliance features required
- Accessibility compliance (WCAG 2.1) is mandatory
- Multi-Factor Authentication (MFA) required for all admin accounts