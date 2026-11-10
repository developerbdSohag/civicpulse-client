# CivicPulse — Community-Driven Social Development Events Platform (Client)

**CivicPulse** is a modern, responsive, full-stack community-driven event management platform designed to empower citizens, youth volunteers, and grassroots social organizations to create, discover, join, and track impactful humanitarian initiatives in their local areas.

---

## 🌐 Live Deployment & Repositories

| Resource | URL |
| :--- | :--- |
| **Live Production Site** | [https://civicpulse-sohag.vercel.app](https://civicpulse-sohag.vercel.app) |
| **Alternative Live Mirror** | [https://client-eight-omega-44.vercel.app](https://client-eight-omega-44.vercel.app) |
| **Client GitHub Repository** | [https://github.com/developerbdSohag/civicpulse-client](https://github.com/developerbdSohag/civicpulse-client) |
| **Server GitHub Repository** | [https://github.com/developerbdSohag/civicpulse-server](https://github.com/developerbdSohag/civicpulse-server) |

---

## 📋 Project Purpose & Overview

In local communities, humanitarian and civic drives (such as winter blanket distributions, neighborhood cleanups, urban tree plantation drives, and free medical camps) often suffer from fragmented communication and lack of volunteer coordination. 

**CivicPulse** bridges this gap by providing an accessible, transparent, and aesthetically refined platform where:
- Organizers can schedule verified community drives with capacity targets and future-date safeguards.
- Volunteers can discover local initiatives filtered by category or neighborhood, sign up with a single click, and sync events directly to their digital calendars.
- Communities can build social trust through public volunteer rosters, organizer profiles, and interactive civic impact animations.

---

## 🌟 Top 8 Core Features

1. **Hyperlocal Event Discovery & Category Filtering**:
   - Real-time catalog of community initiatives strictly filtered for upcoming dates (past events are automatically excluded).
   - Instant search by title or neighborhood keywords (e.g. *Mirpur 10*, *Mohammadpur*, *Hatirjheel*, *Dhanmondi*, *Uttara*).
   - One-click category filtering across 6 humanitarian areas: **Donation**, **Cleanup**, **Healthcare**, **Tree Plantation**, **Relief Aid**, and **Education**.

2. **Future-Date Scheduling & Form Validation**:
   - Prevents obsolete entries by enforcing future-only dates and times in the event creation form.
   - Interactive high-contrast native calendar picker that dynamically changes icon colors in both Light Mode and Dark Mode for optimal visibility.

3. **One-Click Functional RSVP with Social Proof & Confetti**:
   - Community members can join any upcoming social service event with a single click.
   - Immediate visual celebration powered by **Canvas Confetti**, real-time attendee count increments, and live volunteer roster updates.
   - Public viewability with seamless authentication protection (guest users are gently guided to log in before RSVPing).

4. **Organizer Event Management with Strict Ownership Protection**:
   - Dedicated organizer dashboard (`/manage-events`) displaying initiatives hosted by the logged-in user.
   - Full CRUD support: organizers can edit event titles, dates, descriptions, locations, and targets, or delete events with cascading RSVP cleanup.
   - Strict author-only authorization prevents unauthorized users from modifying another organizer's initiative.

5. **Joined Events Timeline & .ICS Calendar Export**:
   - Dedicated volunteer dashboard (`/joined-events`) displaying all RSVP'd initiatives sorted chronologically.
   - One-click `.ics` calendar file generation allowing volunteers to sync events directly with Google Calendar, Apple Calendar, and Microsoft Outlook.

6. **Comprehensive User Profile & In-App Password Change**:
   - Volunteer profile dashboard (`/profile`) with aggregated community participation stats (*Events Organized* vs. *Events Joined*).
   - Editable display name, avatar photo selection, phone number, location, and volunteer bio.
   - In-app **Change Password** card with real-time requirement validation (minimum 6 characters, uppercase, and lowercase) and toast notifications.

7. **6 Interactive Civic Category Simulations**:
   - Bespoke interactive visual animations tailored to each of the 6 civic categories:
     - **Tree Plantation**: Interactive seed-to-harvest growth simulation (seeding, sprouting, full foliage, blooming fruits).
     - **Donation**: Humanitarian distribution simulation delivering warm clothing and food to underprivileged families.
     - **Cleanup**: Before-and-after environmental transformation showing trash removal and clean urban park restoration.
     - **Healthcare**: Medical triage and doctor consultation simulation with interactive stethoscope and vitals monitoring.
     - **Education**: Community library and open book learning simulation.
     - **Relief Aid**: Humanitarian emergency logistics simulation with aid crate drops and supplies distribution.

8. **Glassmorphism UI & Interactive Butterfly Authentication**:
   - Modern Dribbble-inspired UI aesthetic featuring translucent frosted-glass panels (`backdrop-blur`), subtle glowing border highlights, and floating 3D status badges.
   - Interactive SVG butterfly animation fluttering around the login interface that rests on the top edge, gracefully takes flight upon login success, or gently dissolves upon failed attempts.

---

## 💻 Technology Stack

- **Framework**: Next.js 16.4.5 (App Router with Server & Client Components)
- **Library**: React 19.3.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 & Custom Glassmorphism CSS Architecture
- **Iconography**: Lucide React (1.69.0)
- **Feedback & Notifications**: Sonner (2.0.8) Rich Toast Notifications
- **Visual Effects**: Canvas Confetti (1.9.4)
- **Security & Cryptography**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing
- **Deployment & Hosting**: Vercel Serverless Edge Cloud

---

## 📦 NPM Packages & Dependencies

| Package | Version | Purpose & Usage in Project |
| :--- | :--- | :--- |
| `next` | `16.4.5` | React framework providing App Router, SSR, Server Actions, and API routes. |
| `react` | `19.3.0` | Core UI library for declarative component architecture and hooks. |
| `react-dom` | `19.3.0` | DOM bindings for React 19. |
| `typescript` | `^5.0.0` | Strict type safety across client interfaces, models, and API responses. |
| `tailwindcss` | `^4.0.0` | Utility-first CSS engine powering responsive layouts and dark/light themes. |
| `@tailwindcss/postcss` | `^4.3.4` | PostCSS plugin integration for Tailwind CSS v4 pipeline. |
| `lucide-react` | `^1.69.0` | Modern, consistent SVG icon system used across all navigation, cards, and buttons. |
| `sonner` | `^2.0.8` | Toast notification manager providing feedback for RSVP, login, and updates. |
| `canvas-confetti` | `^1.9.4` | Canvas-based celebratory particle burst when users join a community event. |
| `clsx` | `^2.1.1` | Utility for conditionally constructing `className` strings. |
| `tailwind-merge` | `^3.7.0` | Merges Tailwind class strings safely without style conflict issues. |
| `bcryptjs` | `^3.0.3` | Client/server-side password hashing and credential verification. |
| `jsonwebtoken` | `^9.0.3` | JWT generation, signing, and bearer token decoding for session hydration. |
| `nodemailer` | `^10.3.1` | Email notification service utility for volunteer event updates. |

---

## 🛠️ Step-by-Step Local Setup & Execution

### Prerequisites
- Node.js (v18.17.0 or higher recommended)
- npm (v9.0.0 or higher) or yarn / pnpm

### 1. Clone the Client Repository
```bash
git clone https://github.com/developerbdSohag/civicpulse-client.git
cd civicpulse-client
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# URL of the backend API (local server or production server)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Site base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

### 5. Build and Test Production Bundle
```bash
npm run build
npm run start
```

---

## 🔑 Test User Credentials (For Evaluation)

Reviewers can immediately evaluate authenticated features without creating a new account using the pre-seeded credentials below:

| Field | Primary Test Account | Secondary Test Account |
| :--- | :--- | :--- |
| **Email** | `sohag@gmail.com` | `nova@gmail.com` |
| **Password** | `CivicPulse@2026` | `CivicPulse@2026` |
| **Role** | Community Organizer / Volunteer | Active Volunteer |

*(New users can also register freely with full password validation: minimum 6 characters, at least one uppercase letter, and at least one lowercase letter).*

---

## 📁 Project Directory Structure

```text
client/
├── public/                 # Static assets, SVG illustrations, and icons
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # Serverless API routes (auth, events, rsvp, profile)
│   │   ├── create-event/   # Event creation form with future-date validation
│   │   ├── events/         # All events catalog and dynamic [id] details page
│   │   ├── joined-events/  # Volunteer joined events dashboard & .ics export
│   │   ├── login/          # Glassmorphism login with interactive butterflies
│   │   ├── manage-events/  # Organizer event management & delete modal
│   │   ├── profile/        # Volunteer profile & change password card
│   │   ├── register/       # User registration with password criteria meter
│   │   ├── globals.css     # Tailwind v4 theme styles, glassmorphism & keyframes
│   │   ├── layout.tsx      # Root layout, Navbar, Footer, and Sonner Toaster
│   │   └── page.tsx        # Homepage hero, category filter, and highlights
│   ├── components/         # Reusable UI components
│   │   ├── CivicAnimations.tsx   # 6 Category step-by-step interactive simulations
│   │   ├── EventCard.tsx         # Responsive event card with progress bars
│   │   ├── Navbar.tsx            # Sticky navigation with theme toggle & user dropdown
│   │   ├── Footer.tsx            # Community footer with social links & sitemap
│   │   └── LoadingSkeleton.tsx   # Zero-layout-shift animated loading placeholders
│   ├── context/            # React Context providers (AuthContext, ThemeContext)
│   ├── lib/                # API client helpers, utilities, and date formatters
│   └── server/             # Data store, models, and mock/cache handlers
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Client documentation
```

---

## 🎨 Theme & Accessibility Support
- **Light & Dark Mode**: Persistent theme toggling across the entire application with dedicated color palettes for high contrast.
- **Form Controls in Dark Mode**: Native date and time picker icons remain sharply visible in both themes.
- **Responsive Layout**: Designed for mobile phones (320px+), tablets, laptops, and ultra-wide desktop monitors.
- **Accessibility**: Semantic HTML5 tags (`<main>`, `<nav>`, `<header>`, `<footer>`), ARIA attributes, and clear focus states.

---

## 👨‍💻 Author & Acknowledgements
- **Developer**: Md. Salahuddin Sohag ([@developerbdSohag](https://github.com/developerbdSohag))
- **Live Platform**: [https://civicpulse-sohag.vercel.app](https://civicpulse-sohag.vercel.app)
- **Built for**: Community Development & Humanitarian Social Welfare Coordination
