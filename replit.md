# RECORDING CAFE - K-pop Recording Experience Platform

## Overview

Recording Cafe is a modern web application for a K-pop recording studio and cafe in Seoul's Sinsa district. The platform allows international visitors to book recording sessions, browse packages, and experience professional K-pop recording in a trendy cafe atmosphere. The application features a React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom K-pop themed colors and gradients
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for packages, addons, bookings, and time slots
- **Session Management**: Express sessions with PostgreSQL session store
- **Development**: Hot module replacement with Vite middleware integration

### Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema validation
- **Validation**: Zod schemas for runtime type validation

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Packages**: Recording packages with pricing and features
- **Addons**: Additional services (photo packs, video editing, etc.)
- **Bookings**: Customer reservations with contact info and selections
- **Time Slots**: Available booking times with availability tracking

### API Endpoints
- `GET /api/packages` - Retrieve all recording packages
- `GET /api/addons` - Retrieve all available add-on services
- `GET /api/timeslots/:date` - Get available time slots for specific date
- `POST /api/bookings` - Create new booking with price calculation

### Frontend Pages
- **Home**: Single-page application with multiple sections
- **Hero Section**: Landing area with K-pop themed visuals
- **Experience Section**: Step-by-step process explanation
- **Packages Section**: Recording package display with pricing
- **Gallery Section**: Studio photos and customer testimonials
- **Booking Section**: Interactive booking form with date/time selection
- **Contact Section**: Studio location and contact information
- **Franchise Page**: Comprehensive business opportunity page in English
  - Dual package structure (New Business vs. Remodeling)
  - Per-pyeong interior cost breakdown
  - Target customer analysis and revenue projections
  - Global expansion roadmap and success metrics

### UI Components
- **Navigation**: Sticky header with smooth scrolling
- **Form Components**: Calendar picker, select dropdowns, checkboxes
- **Cards**: Package display, testimonial cards, gallery items
- **Interactive Elements**: Buttons with K-pop gradients and animations

## Data Flow

1. **Package Loading**: Frontend queries `/api/packages` and `/api/addons` on page load
2. **Date Selection**: User picks booking date, triggers `/api/timeslots/:date` request
3. **Booking Creation**: Form submission validates data and calculates total price server-side
4. **Price Calculation**: Server combines package price with selected addon costs
5. **Database Persistence**: Validated booking data saved to PostgreSQL
6. **User Feedback**: Success/error messages displayed via toast notifications

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Library**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Icons**: Lucide React icons, React Icons for social media
- **Utilities**: date-fns for date manipulation, wouter for routing

### Backend Dependencies
- **Core**: Express.js, TypeScript, tsx for development
- **Database**: Drizzle ORM, @neondatabase/serverless, pg types
- **Session**: express-session, connect-pg-simple
- **Validation**: Zod, drizzle-zod for schema validation
- **Email**: @sendgrid/mail for notifications
- **Development**: Vite integration, esbuild for production builds

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **TypeScript**: Strict configuration with path mapping
- **Linting**: ESNext modules with DOM types
- **Database**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development Mode
- Vite dev server with HMR for frontend
- tsx with nodemon-like behavior for backend
- Integrated development with Vite middleware
- Replit-specific plugins for development environment

### Production Build
- Vite builds frontend to `dist/public`
- esbuild bundles backend to `dist/index.js`
- Static file serving from Express
- Environment-based configuration

### Database Setup
- PostgreSQL hosted on Neon serverless platform
- Connection via DATABASE_URL environment variable
- Schema migrations through Drizzle Kit
- Session storage in dedicated PostgreSQL table

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
- July 08, 2025. Added SEO meta tags with Open Graph and Twitter cards for social media previews
- July 08, 2025. Added music note favicon for browser tab icon
- July 08, 2025. Updated experience section with new cafe interior image
- July 08, 2025. Fixed footer copyright text with patent protection notice
- July 15, 2025. Added comprehensive franchise page in English with dual package structure (new business vs. remodeling)
- July 15, 2025. Updated portfolio section with corrected artist credits (Wiz Khalifa, Glen Hansard & Marketa Irglova)
- July 15, 2025. Added new international group photo to gallery section
- July 15, 2025. Updated franchise page design to match main page styling with consistent colors and layouts
- July 15, 2025. Simplified navigation to show only Franchise menu, removing all other menu items
- July 15, 2025. Reverted franchise page design to original styling while keeping navigation menu simplified
- July 15, 2025. Updated franchise page navigation and footer to match main page styling exactly
- August 05, 2025. Removed "Choose Your Package" section and pricing table from main page
- August 05, 2025. Added backing track preparation note to "Please Note" section on both main and franchise pages
- August 05, 2025. Fixed booking time slot display issue using useEffect instead of TanStack Query
- August 05, 2025. Implemented time-based pricing structure in Korean won: AM10:00-PM12:50 (₩40,000), PM01:00-PM05:50 (₩50,000), PM06:00-PM10:00 (₩44,000)
- August 05, 2025. Updated Additional Services pricing in Korean won: Full Track Mixing (₩100,000), Recording Video Raw/Edited (₩50,000/₩100,000), Makeup Service (₩100,000), Global Distribution (₩1,300,000)
- August 05, 2025. Added status-based filtering system: clicking statistics cards filters booking lists by status with visual indicators
- August 05, 2025. Implemented comprehensive user management system with role-based access control (super_admin, admin, user roles)
- August 05, 2025. Fixed booking form 400 error by correcting selectedAddons data type mismatch (changed from string[] to number[] in schema and database)
- August 06, 2025. **TossPayments Integration Work (Temporarily Paused)**:
  - Implemented full TossPayments payment flow with booking integration
  - Added payment initialization, success/fail page routing
  - Fixed bookingId extraction and JSON parsing issues
  - Resolved time slot display problems (switched from DatabaseStorage to MemStorage)
  - Added proper error handling for payment failures
  - Note: Payment system integration paused due to PG company change requirement
- August 06, 2025. **Payment System Removal & Booking Simplification**:
  - Completely removed TossPayments integration per user request
  - Modified booking flow to complete immediately without payment redirect
  - Changed success messages to English for international users
  - Switched to DatabaseStorage with automatic time slot initialization
  - Fixed data persistence issues to prevent booking loss
  - Project now ready for deployment with simplified booking flow
- August 06, 2025. **Deployment Optimization**:
  - Fixed all TypeScript LSP errors for production build
  - Added PostgreSQL session store for production stability
  - Created sessions table in database schema
  - Optimized build configuration with chunk splitting
  - Resolved deployment timeout issues and configuration errors
- August 06, 2025. **Additional Services Update**:
  - Changed "Makeup Service" to "LP Record Production" in Additional Services
  - Updated pricing from ₩100,000 to ₩1,300,000 for LP production
  - Enhanced admin panel with detailed booking information display
  - Added YouTube URL copy functionality and improved service details view
- November 25, 2025. **Naver Booking System**:
  - Created partner_addons table for Naver-exclusive discounted services
  - Added /naver-booking page with 50% discounted add-ons for Naver pre-paid customers
  - Implemented 6 Naver add-ons: voice correction, mixing/mastering, video production, music distribution
- November 25, 2025. **Photo Print System for Admin**:
  - Created visitor_photos table for newspaper-style commemorative prints
  - Added /photo admin page for uploading customer photos
  - Implemented newspaper-style template design with Korean styling
  - Features: photo upload, customer name selection, custom headline, print function
  - Admin-only internal feature for printing commemorative photos
- November 25, 2025. **Stripe/Payment Removal**:
  - Removed all Stripe and TossPayments related code and dependencies
  - Deleted payment pages (payment.tsx, payment-success.tsx, payment-fail.tsx)
  - Simplified booking flow without external payment integration
- February 13, 2026. **NFT Digital Keyring System**:
  - Created nft_pages table for customer-specific private pages
  - Auto-generates NFT page (with unique UUID token) when CD keyring is created
  - Customer page at /nft/:token shows album cover, recording download, and additional service requests
  - Audio download auto-deletes file from server after download (saves storage)
  - Additional services match /menu pricing: mixing (basic/AI/expert), video, album release (standard/pro), LP
  - Admin NFT tab in /admin for managing pages, uploading audio files, deleting files, and processing service requests
  - Private page with clear "비공개" indicator - only accessible via unique link
  - Customer filtering excludes [klook] names and cancelled/deleted bookings from photo page
  - Updated CD back panel prompt to generate realistic CD inlay (tracklist, barcode, credits)
  - Fixed CD image sizing with aspectRatio CSS for proper responsive scaling
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```