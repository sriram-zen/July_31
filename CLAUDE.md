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
- Multi-Factor Authentication (MFA) support with verification flow at `/mfa-verify`

### Route Structure
- `/` - Redirects to `/protected` if authenticated, otherwise shows landing
- `/sign-in`, `/sign-up`, `/forgot-password` - Auth pages (grouped in `(auth-pages)`)
- `/mfa-verify` - MFA verification page with next URL redirect support
- `/protected/*` - Protected routes requiring authentication
- `/protected/reset-password` - Password reset for authenticated users
- `/about`, `/gallery`, `/contact`, `/events`, `/instruments` - Public pages (instruments page exists in route but not in navigation)

### Authentication Patterns
- Protected routes automatically redirect to `/sign-in` if unauthenticated  
- Authenticated users on `/` redirect to `/protected`
- MFA enforcement: Users with enrolled factors must complete MFA verification (aal2) to access protected routes
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
  - `admin-login-dialog.tsx` - Admin login modal component
  - `mfa-setup-form.tsx` and `mfa-disable-form.tsx` - MFA management components
  - `env-var-warning.tsx` - Environment variable validation warnings
- Uses `@/` alias for `src/` directory
- Form handling with `react-hook-form` and `zod` validation

### Styling and Branding
- Tailwind CSS v4 with PostCSS configuration (`postcss.config.mjs`)
- Primary brand color: #043933 (dark green) - used consistently in navigation and key interface elements
- Custom Tailwind color defined as `primary-brand: '#043933'` in tailwind.config.js
- shadcn/ui configuration in `components.json` with New York style and lucide icons
- Global styles in `src/app/globals.css` with CSS variables for theming
- Dark/light theme support via `next-themes` with system detection
- Mobile-first responsive design with Sheet component for mobile navigation
- Main layout uses dark background (`bg-[#043933]`) with white text

### Hooks and Utilities
- Custom hooks in `src/hooks/`:
  - `use-form-message.ts` - Form message state management
  - `use-mobile.ts` - Mobile device detection
- Utility functions in `src/lib/utils.ts` and `src/utils/utils.ts`
- Environment variable validation in `src/utils/supabase/check-env-vars.ts`

### Current Implementation State
- **Authentication**: Fully implemented with Supabase auth, MFA support, and audit logging
- **Routing**: Complete with protected routes, middleware-based auth checks, and MFA enforcement
- **UI Components**: Comprehensive shadcn/ui component library with custom branding
- **Navigation**: Mobile-responsive navigation with hamburger menu and primary brand colors
- **Forms**: React Hook Form integration with Zod validation ready for implementation
- **Admin Features**: Framework in place but specific admin functionality needs implementation
- **Payment Integration**: Architecture defined but not yet implemented
- **WhatsApp Integration**: Architecture defined but not yet implemented

### Technology Stack & Dependencies
- **Framework**: Next.js 15 with App Router and TypeScript
- **Authentication**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 4 with next-themes for theme switching  
- **Forms**: react-hook-form with @hookform/resolvers and Zod validation
- **Icons**: lucide-react
- **Utilities**: class-variance-authority, clsx, tailwind-merge
- **Date Handling**: date-fns with react-day-picker
- **Charts**: recharts (for future analytics)
- **Notifications**: sonner for toast notifications

### Key Architectural Patterns
- Server Components and Server Actions for data fetching and mutations
- Modular, API-driven architecture designed for multi-tenant replication
- Separation between public website and admin portal contexts
- Admin-only data entry model with no public user registration
- Sequential devotee ID assignment system
- Audit trail logging for all admin actions
- Fallback protocols for WhatsApp and payment gateway failures
- Multi-Factor Authentication (MFA) enforcement for admin accounts

### Security Features
- Role-Based Access Control (RBAC) for admin-only features
- Multi-Factor Authentication (MFA) with TOTP/SMS support
- Encryption of sensitive data at rest and in transit
- Automated audit trails for all admin actions
- Session management with timeouts and forced logout capabilities
- PCI DSS compliance for payment processing

### Integration Architecture
- WhatsApp Business API integration (via middleware like Twilio)
- Payment gateway integration (Razorpay for India, Stripe for global)
- Automated receipt generation and delivery
- Fallback channels (SMS/email) for failed WhatsApp delivery
- Webhook-based payment status updates
- Real-time delivery status tracking

### Key Files to Check When Working on Auth
- `src/utils/supabase/middleware.ts` - Route protection logic and MFA enforcement
- `src/actions/auth.ts` - Server Actions for auth operations with MFA audit logging
- `src/components/header-auth.tsx` - Auth button component
- `src/utils/supabase/check-env-vars.ts` - Environment validation
- `src/components/mfa-setup-form.tsx` - MFA enrollment component
- `src/components/mfa-disable-form.tsx` - MFA removal component
- `middleware.ts` (root level) - Next.js middleware entry point

### Platform-Specific Context
- This is a trust/nonprofit management platform with admin-only data entry
- Devotee management with sequential ID assignment
- WhatsApp automation integration planned (via Business API)
- Payment gateway integration (Razorpay/Stripe) for digital donations
- Manual receipt generation for cash donations
- Audit trails and compliance features required
- Accessibility compliance (WCAG 2.1) is mandatory
- Multi-Factor Authentication (MFA) required for all admin accounts

### Compliance Requirements
- GDPR and India DPDP compliance for data protection
- PCI DSS compliance for payment processing
- 80G receipt generation for Indian donations
- WCAG 2.1 AA accessibility standards
- Automated audit trails for regulatory compliance
- Data retention and secure deletion policies

### Operational Considerations
- Real-time monitoring and alerting for system health
- Automated backup and disaster recovery procedures
- Performance targets: <2 seconds page load times, 99.5% uptime
- Scalability support for 10x current user/event volume
- Bulk messaging capabilities (up to 1,000 recipients per event)
- Error handling and fallback protocols for all integrations