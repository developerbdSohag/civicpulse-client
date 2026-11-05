# CivicPulse — Community-Driven Social Development Events Platform

**CivicPulse** is a modern, responsive, full-stack community-driven event management platform designed to empower citizens, youth volunteers, and grassroots social organizations to create, discover, join, and track impactful humanitarian initiatives in their local areas.

🌐 **Live Site URL**: [https://transactions-excluding-treasure-thin.trycloudflare.com](https://transactions-excluding-treasure-thin.trycloudflare.com)  
🔗 **Client Repository**: [https://github.com/developerbdSohag/civicpulse-client](https://github.com/developerbdSohag/civicpulse-client)  
🔗 **Server Repository**: [https://github.com/developerbdSohag/civicpulse-server](https://github.com/developerbdSohag/civicpulse-server)  

---

## 🌟 Top 5 Website Features

1. **Hyperlocal Humanitarian Event Discovery**:
   - Discover real-time community initiatives filtered strictly for upcoming dates (past events are automatically excluded).
   - Instant search by title or location (e.g. *Mirpur 10*, *Mohammadpur*, *Hatirjheel*, *Uttara*) and category filtering (Winter Drive, Tree Plantation, Cleanliness, Food Aid, Free Health Camps).

2. **One-Click Functional RSVP with Social Proof & Confetti**:
   - Community members can join any upcoming social service event with a single click, triggering celebratory visual feedback and instantly updating volunteer rosters.
   - Includes full protection: guest visitors can view event details publicly, but are seamlessly guided to authenticate before joining.

3. **Organizer Event Management & Strict Access Control**:
   - Registered organizers can create initiatives with future-date validation, preset high-resolution photography, and capacity targets.
   - Dedicated "Manage Events" dashboard allowing organizers to update event details or delete initiatives with immediate RSVP cascading cleanup. Only the event author can modify their events.

4. **Dedicated Joined Events Timeline & Calendar Export**:
   - Volunteers have a personal "Joined Events" dashboard sorted chronologically by event date.
   - One-click `.ics` calendar file generation allows volunteers to add events directly to Google Calendar, Apple Calendar, or Outlook.

5. **Universal Dark & Light Theme Customization & Loading Skeletons**:
   - Complete system-wide theme toggling with smooth transitions and persistent local preferences.
   - High-fidelity animated loading skeletons across Home, Event Catalog, Event Details, Manage Events, and User Profile pages to guarantee zero layout shifts and an exceptional user experience.

---

## 🚀 Additional Standout Features
- **Profile View & Customization**: Update display name, profile avatar URL, volunteer bio, contact phone, and location with live participation statistics (Events Organized vs. Events Joined).
- **Interactive Volunteer Rosters**: Shows avatars and names of joined neighbors on each event details page to inspire collective action.
- **Client Session Hydration**: Persistent JWT storage and state restoration preventing unwanted login redirects on page refresh across all private routes (`/create-event`, `/manage-events`, `/joined-events`, `/profile`).
- **Modern Social Branding**: Updated with the new X brand icon (replacing legacy Twitter bird logo).
- **Strict Validation & Sonner Toasts**: Password criteria validation (minimum 6 characters, uppercase, and lowercase letters) with real-time feedback indicators; zero default browser alerts.

---

## 💻 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Dark / Light variant themes
- **Icons**: Lucide React
- **Notifications**: Sonner (Rich Toast Notifications)
- **Delight Effects**: Canvas Confetti
- **Authentication**: JWT & MongoDB user sessions with seamless hydration

---

## 🛠️ Local Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/civicpulse-client.git
   cd civicpulse-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 👥 Demo Test Accounts
For quick testing and evaluation:
- **Organizer**: `organizer@civicpulse.org` | Password: `CivicPulse@2026`
- **Volunteer**: `volunteer@civicpulse.org` | Password: `CivicPulse@2026`
- **Google Sign-In**: Click "Sign in with Google" on the login page for instantaneous one-click authentication.
