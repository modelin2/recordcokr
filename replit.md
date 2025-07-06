# STUDIO VIBES - K-pop Recording Experience Platform

## Overview

Studio Vibes is a modern web application for a K-pop recording studio and cafe in Seoul's Sinsa district. The platform allows international visitors to book recording sessions, browse packages, and experience professional K-pop recording in a trendy cafe atmosphere. The application features a React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```