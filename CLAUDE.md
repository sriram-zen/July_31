# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, shadcn/ui components, Tailwind CSS, and Supabase authentication. The project uses the App Router architecture with Server Components and Server Actions.

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
- `/instruments` - Public route for instruments page

### Authentication Patterns
- Protected routes automatically redirect to `/sign-in` if unauthenticated
- Authenticated users on `/` redirect to `/protected`
- Server Actions handle form submissions with `encodedRedirect` for status messages
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Component Organization
- UI components from shadcn/ui in `src/components/ui/`
- Custom components in `src/components/`
- Uses `@/` alias for `src/` directory
- Theme switching with `next-themes`
- Form handling with `react-hook-form` and `zod` validation

### Styling
- Tailwind CSS v4 with CSS variables for theming
- shadcn/ui configuration in `components.json` (New York style)
- Global styles in `src/app/globals.css`
- Dark/light theme support

### Key Files to Check When Working on Auth
- `src/utils/supabase/middleware.ts` - Route protection logic
- `src/actions/auth.ts` - Server Actions for auth operations
- `src/components/header-auth.tsx` - Auth button component
- `src/utils/supabase/check-env-vars.ts` - Environment validation