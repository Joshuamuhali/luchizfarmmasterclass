# Complete System Refactoring Plan

## Overview
Transform from authentication-based learning platform → Lead qualification & management system

---

## Phase 1: Database Schema (Priority: CRITICAL)

### New Table: `leads`
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Questionnaire Responses
  current_farming_status TEXT,  -- commercially, small_scale, not_yet
  start_timeline TEXT,          -- operating, within_3_months, within_6_months, exploring
  has_land TEXT,                -- yes, no
  main_challenge TEXT,          -- starting, feed_costs, pig_health, marketing, general_knowledge
  joining_reason TEXT,          -- start_commercial, expand_farm, learn_before_investing, general_interest
  investment_status TEXT,       -- yes, partially, no
  
  -- Lead Qualification
  lead_score INTEGER DEFAULT 0,
  lead_rating TEXT DEFAULT 'needs_nurturing',  -- qualified, needs_nurturing
  
  -- Payment Status
  payment_status TEXT DEFAULT 'not_started',  -- not_started, conversation_started, proof_submitted, verified, rejected
  payment_verified_at TIMESTAMP,
  payment_verified_by TEXT,
  payment_notes TEXT,
  
  -- Access Status
  access_status TEXT DEFAULT 'not_eligible',  -- not_eligible, awaiting_payment, payment_confirmed, group_access_granted
  group_access_granted_at TIMESTAMP,
  group_access_granted_by TEXT,
  
  -- Tracking
  whatsapp_contacted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_lead_rating ON leads(lead_rating);
CREATE INDEX idx_leads_payment_status ON leads(payment_status);
CREATE INDEX idx_leads_access_status ON leads(access_status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
```

### Updated Table: `settings`
```sql
-- Keep existing, add WhatsApp number
ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '0979654602';
```

### Remove (if exists)
- `registrations` table (replace with `leads`)
- `pdf_downloads` table (not needed)
- `questionnaire_responses` table (integrate into leads)

---

## Phase 2: Remove Unnecessary Components (Priority: HIGH)

### Files to DELETE:
```
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/verify-email/page.tsx
app/(portal)/dashboard/page.tsx
app/(portal)/downloads/page.tsx
app/(portal)/status/page.tsx
app/(portal)/layout.tsx
app/success/page.tsx
app/payment/page.tsx
app/sales/complete-registration/page.tsx
app/assessment/page.tsx
app/qualified/page.tsx
app/thank-you/page.tsx
components/registration-form.tsx
components/questionnaire-form.tsx
```

### Files to KEEP:
```
app/page.tsx (redirect to /sales)
app/sales/page.tsx (update CTAs)
app/admin/dashboard/page.tsx (complete rewrite)
app/admin/registrations/page.tsx (complete rewrite)
app/admin/registrations/[id]/page.tsx (complete rewrite)
app/admin/settings/page.tsx (update fields)
app/admin/content/page.tsx (remove, not needed)
app/admin/uploads/page.tsx (remove, not needed)
app/admin/downloads/page.tsx (remove, not needed)
app/admin/participants/page.tsx (remove, not needed)
app/admin/announcements/page.tsx (keep for future)
app/admin/audit-logs/page.tsx (keep for future)
middleware.ts (complete rewrite)
```

---

## Phase 3: New Page Structure

### Public Pages (No Auth Required)
```
/ → Redirect to /sales
/sales → Sales page with registration form + questionnaire
/check-status → Public status check by email/phone
```

### Admin Pages (Auth Required)
```
/admin → Dashboard
/admin/leads → All leads management
/admin/leads/qualified → Filtered qualified leads
/admin/leads/nurturing → Filtered needs nurturing
/admin/settings → Configuration
```

---

## Phase 4: New Components to Create

### 1. `components/registration-form.tsx` (REPLACE)
**Purpose:** Collect lead information + questionnaire in one flow

**Fields:**
- Full Name
- Phone Number
- Email
- Current Farming Status (radio)
- Start Timeline (radio)
- Has Land (radio)
- Main Challenge (radio)
- Reason for Joining (radio)
- Investment Status (radio)

**Flow:**
1. User fills form
2. On submit, calculate lead_score
3. Determine lead_rating
4. Save to database
5. Show appropriate message (Qualified vs Needs Nurturing)

### 2. `components/lead-qualification-engine.ts` (NEW)
**Purpose:** Calculate lead score based on answers

**Scoring Logic:**
```typescript
current_farming_status:
  - commercially: 30
  - small_scale: 20
  - not_yet: 0

start_timeline:
  - operating: 25
  - within_3_months: 20
  - within_6_months: 10
  - exploring: 0

has_land:
  - yes: 15
  - no: 0

joining_reason:
  - start_commercial: 15
  - expand_farm: 15
  - learn_before_investing: 5
  - general_interest: 0

investment_status:
  - yes: 15
  - partially: 5
  - no: 0

Total max: 100
Qualified: >= 70
Needs Nurturing: < 70
```

### 3. Remove questionnaire-form.tsx (integrate into registration)

---

## Phase 5: API Routes to Create/Update

### NEW Routes:
```
POST /api/leads → Create new lead
GET /api/leads → List leads (admin)
GET /api/leads/:id → Get lead details (admin)
PATCH /api/leads/:id → Update lead (admin)
POST /api/leads/:id/verify-payment → Mark payment verified
POST /api/leads/:id/grant-access → Grant group access
POST /api/leads/:id/reject-payment → Reject payment
GET /api/check-status → Public status check
```

### Routes to DELETE:
```
DELETE /api/admin/content/delete (not needed)
POST /api/admin/registrations/approve (replace with new lead routes)
POST /api/register (replace with /api/leads)
POST /api/downloads/generate (not needed)
```

---

## Phase 6: Updated User Flow

### Sales Page (`/sales`)
**Changes:**
- Remove "Reserve My Seat" CTAs
- Add single CTA: "Start Registration"
- Links to registration form (inline or separate page)

### Registration Page (`/register` - RENAME TO `/register`)
**Changes:**
- Single page with form + questionnaire
- No authentication
- No password
- No account creation
- Collects all lead information
- Calculates lead rating
- Shows result message

### Qualified Lead Result
**Message:**
```
Congratulations!

Based on your responses, you qualify for the Luchiz Farm Masterclass.

To complete registration, contact our team on WhatsApp to make payment.

WhatsApp: 0979654602

[Continue to WhatsApp]
```

**Button Action:**
```
https://wa.me/260979654602?text=Hello%20Luchiz%20Farm%20Team.%20I%20have%20completed%20the%20Masterclass%20registration%20questionnaire%20and%20would%20like%20to%20make%20payment.
```

### Needs Nurturing Result
**Message:**
```
Thank you for your interest in the Luchiz Farm Masterclass.

We have saved your details and will keep you updated with:
- Future farming training opportunities
- Free resources and tips
- Special offers for upcoming cohorts

We'll be in touch soon!
```

**No WhatsApp link. Just a "Return to Home" button.**

### Status Check Page (`/check-status`)
**Purpose:** Public page for users to check their status

**Fields:**
- Email OR Phone Number

**Shows:**
- Lead Rating (Qualified/Needs Nurturing)
- Payment Status
- Next Steps

---

## Phase 7: Updated Admin Dashboard

### KPI Cards
```
Total Leads: 148
Qualified Leads: 52
Needs Nurturing: 96
Awaiting Payment: 21
Payment Submitted: 18
Group Access Granted: 31
```

### Navigation
```
/admin → Dashboard
/admin/leads → All Leads
/admin/leads/qualified → Qualified Leads
/admin/leads/nurturing → Needs Nurturing
/admin/settings → Settings
```

### Leads Table (All Leads)
**Columns:**
- ID
- Name
- Phone
- Email
- Lead Rating (Qualified/Needs Nurturing badge)
- Payment Status
- Access Status
- Created Date
- Actions

**Actions:**
- View Details
- Contact on WhatsApp
- Verify Payment
- Grant Access

### Lead Detail Page
**Sections:**
1. Personal Information
2. Questionnaire Responses
3. Lead Qualification (score + rating)
4. Payment Information
5. Access Status
6. Admin Actions

**Actions (contextual):**
- If Qualified + Not Started: Send WhatsApp message
- If Payment Submitted: Verify/Reject Payment
- If Payment Verified: Grant Group Access
- Add Notes

---

## Phase 8: Middleware Rewrite

### New Middleware Logic
```typescript
// Protected paths (admin only)
const adminPaths = ['/admin']

// Public paths (everything else)
// No authentication required for public pages

if (adminPath && !session) {
  redirect to /login
}

if (adminPath && !isAdmin) {
  redirect to /sales
}
```

### Remove:
- Portal protection
- User auth checks for public pages
- Redirect loops

---

## Phase 9: Settings Updates

### Settings Page Fields
```
Masterclass Details:
- Title
- Date
- Time
- Max Seats

Payment Settings:
- Airtel Money Number (0979654602)
- Account Name

WhatsApp Settings:
- WhatsApp Contact Number (0979654602)
- WhatsApp Group Link (for admin use only, never public)

Registration Settings:
- Registration Open/Closed
- Auto-approve threshold (optional)
```

---

## Phase 10: Implementation Order

### Week 1: Database & Backend
1. Create new `leads` table migration
2. Create API routes for leads
3. Create lead qualification engine
4. Test scoring logic

### Week 2: Frontend - Public Pages
1. Create new registration form (with questionnaire)
2. Create result pages (Qualified/Needs Nurturing)
3. Create status check page
4. Update sales page
5. Test complete user flow

### Week 3: Frontend - Admin
1. Rewrite admin dashboard
2. Create leads management pages
3. Create lead detail page
4. Add admin actions (verify payment, grant access)
5. Test admin workflow

### Week 4: Polish & Deploy
1. Remove old files
2. Update middleware
3. Update settings page
4. Test complete system
5. Deploy

---

## Success Criteria

### User Flow
- [ ] User visits sales page
- [ ] User clicks "Start Registration"
- [ ] User fills form + questionnaire (5-7 min)
- [ ] System calculates lead rating
- [ ] Qualified users see WhatsApp link
- [ ] Needs Nurturing users see thank you message
- [ ] Lead saved to database

### Admin Flow
- [ ] Admin sees dashboard with correct KPIs
- [ ] Admin can view all leads
- [ ] Admin can filter by lead rating
- [ ] Admin can verify payments
- [ ] Admin can grant group access
- [ ] Admin can track complete lifecycle

### Data Integrity
- [ ] All leads stored with complete information
- [ ] Lead scores calculated correctly
- [ ] Lead ratings assigned correctly
- [ ] Payment status tracked
- [ ] Access status tracked
- [ ] Timestamps recorded

---

## What We're Removing

### Authentication System
- Supabase Auth
- User passwords
- Email verification
- Login/logout
- User sessions

### Portal System
- Portal dashboard
- Portal downloads
- Portal status
- Protected routes for users

### Learning Platform Features
- Content management
- File uploads
- Download tracking
- Student dashboards

### Unnecessary Fields
- NRC
- Transaction reference (moved to payment notes)
- PDF downloads
- User accounts

---

## What We're Keeping

### Admin System
- Admin authentication (for security)
- Admin dashboard
- Lead management
- Settings management

### Core Features
- Sales page
- Registration form
- Lead qualification
- Payment tracking
- Access control

---

## Final System Architecture

```
┌─────────────────────────────────────────┐
│         PUBLIC PAGES (No Auth)          │
├─────────────────────────────────────────┤
│ /sales                                  │
│ /register (form + questionnaire)        │
│ /check-status                           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           LEAD QUALIFICATION            │
│  - Score calculation                    │
│  - Rating assignment                    │
│  - Database storage                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         ADMIN PAGES (Auth Required)     │
├─────────────────────────────────────────┤
│ /admin/dashboard                        │
│ /admin/leads                            │
│ /admin/leads/qualified                  │
│ /admin/leads/nurturing                  │
│ /admin/settings                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      WHATSAPP PAYMENT FLOW              │
│  - User contacts WhatsApp               │
│  - Sends payment proof                  │
│  - Admin verifies                       │
│  - Admin grants access                  │
└─────────────────────────────────────────┘
```

---

## Next Steps

1. Review this plan
2. Approve approach
3. Begin Phase 1: Database schema
4. Execute each phase sequentially
5. Test thoroughly before deploy