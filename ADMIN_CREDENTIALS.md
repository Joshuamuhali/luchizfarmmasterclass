# Luchiz Farm Admin Dashboard - Credentials & Setup

## Admin Login Credentials

**Email:** admin@luchizfarm.com  
**Password:** Admin@2024

**Admin Dashboard URL:** `/admin/login` or `/admin/dashboard`

---

## System Overview

### 1. **User Registration System**

- **Multi-step form** with 5 stages:
  1. Personal Info (Name, Phone, Email)
  2. Experience Level & Location
  3. Goals & Launch Timeline
  4. Commitment & Budget
  5. Review & Submit

- **Green color palette** with emerald shades (#10B981 primary)
- **Progress bar** showing form completion
- **Automatic vetting logic** based on:
  - Payment commitment (ZMW 400)
  - Launch timeline (1-3 or 3-6 months)
  - Available budget (ZMW 5k+)

### 2. **Success Pages**

After registration, users see:

- **Approved Users** (Green - Priority Leads):
  - Congratulations message
  - WhatsApp group join button
  - Masterclass details
  
- **General Inquiries** (Gray - Non-Priority):
  - Thank you message
  - Newsletter follow-up option

### 3. **Admin Dashboard**

Access at `/admin/dashboard` after logging in.

**Features:**
- **Approved Leads Table** (Green indicator):
  - Shows users who committed to payment + meet timeline/budget criteria
  - Filterable by name and email
  - Displays: Name, Email, Phone, Location, Timeline, Budget, Date

- **Not Priority Leads Table** (Gray indicator):
  - Shows inquiries that don't meet approval criteria
  - Includes "Reason" column explaining why not approved
  - Filterable by name and email
  - Displays: Name, Email, Phone, Location, Reason, Date

- **Statistics**: Real-time counts of approved and non-priority leads
- **Search functionality**: Filter leads across both tables

### 4. **Database Schema**

**Tables:**
- `registrations`: Stores all form submissions
- `user`: Better Auth user accounts
- `account`: Authentication credentials
- `session`: User sessions
- `verification`: Email verification tokens

**Key columns in registrations:**
- id, name, phone, email, location
- experience_level, goals, launch_timeline
- fee_commitment, budget, attendance_commitment
- is_approved (boolean - calculated based on vetting logic)
- created_at (timestamp)

### 5. **Design Elements**

- **Green theme**: Emerald primary color (#10B981) with complementary shades
- **Footer**: "Designed by Joshua Muhali" credit on every page
- **Responsive layout**: Mobile-first design with smooth transitions
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

---

## Key Features by Page

### Homepage (`/`)
- Luchiz Farm branding
- Masterclass information card
- Multi-step registration form
- Global footer

### Admin Login (`/admin/login`)
- Clean login interface
- Demo credentials display
- Green accent buttons
- Secure session handling

### Admin Dashboard (`/admin/dashboard`)
- Header with sign-out button
- Search bar for lead filtering
- Two-table layout
- Real-time statistics
- Color-coded lead status

### Success Page (`/success`)
- Query parameter routing (`?status=approved` or `?status=general`)
- Contextual messaging
- CTA buttons for approved users

---

## Vetting Logic

```
User is APPROVED if:
- fee_commitment == "A" (Yes, committed to payment) AND
  - (launch_timeline == "1-3 months" OR launch_timeline == "3-6 months")
  OR
  - (budget == "ZMW 5k-20k" OR budget == "ZMW 20k+")

Otherwise: User is marked as "Not Priority" (general inquiry)
```

---

## API Endpoints

- `POST /api/register` - Submit registration form
- `POST /api/auth/sign-in` - Admin login
- `POST /api/auth/sign-out` - Admin logout
- `GET /api/admin/leads` - Fetch approved and non-priority leads

---

## Environment Variables

Required:
- `DATABASE_URL` - Neon PostgreSQL connection string (auto-provisioned)
- `NEXT_PUBLIC_WHATSAPP_GROUP_LINK` - WhatsApp group invite URL (optional, set in project Vars)

---

## Testing the System

### Test Approved User:
- Name: Any name
- Phone: +260966666666
- Email: Any email
- Location: Any location
- Experience: Beginner/Intermediate/Advanced
- Goals: Any text
- Timeline: Select "1-3 months" or "3-6 months"
- Fee Commitment: Select "Yes, I'm committed"
- Budget: Select "ZMW 5k-20k" or higher
- Attendance: Select "Yes, I can attend"
- Result: Redirected to `/success?status=approved`

### Test Non-Priority User:
- Same as above but:
- Timeline: Select "Already launched" or "Not sure yet"
- Fee Commitment: Select "No, I'm just inquiring"
- Budget: Select "Less than ZMW 5k"
- Result: Redirected to `/success?status=general`

---

## File Structure

```
app/
├── page.tsx                 # Homepage with Luchiz Farm branding
├── layout.tsx              # Root layout with green background
├── admin/
│   ├── login/page.tsx       # Admin login page
│   └── dashboard/page.tsx   # Admin dashboard
├── success/page.tsx         # Success page (approved/general)
├── api/
│   ├── register/route.ts    # Form submission endpoint
│   └── admin/
│       └── leads/route.ts   # Leads API endpoint
│   └── auth/
│       ├── sign-in/route.ts # Admin login endpoint
│       └── sign-out/route.ts # Admin logout endpoint

components/
├── multi-step-form.tsx      # Main registration form
├── success-approved.tsx     # Approved success component
├── success-general.tsx      # General inquiry component
└── footer.tsx              # Global footer

lib/
├── auth.ts                  # Better Auth configuration
├── auth-client.ts          # Auth client
├── db/
│   ├── index.ts            # Drizzle database setup
│   └── schema.ts           # Database schema

globals.css                  # Green color palette (Tailwind v4)
```

---

## Support & Notes

- All registrations are stored in the Neon PostgreSQL database
- Admin sessions are secure and httpOnly
- The system is mobile-responsive and accessible
- Green color theme is applied globally via CSS variables
- Designed for agricultural/farming community engagement

**Admin credentials must be kept secure. Change the password after initial setup if deploying to production.**
