# Lead Qualification System - Implementation Plan

## 🎯 Problem Summary

1. **Empty Portal Page** - Users land on /portal with no content or guidance
2. **Confusing Auth Flow** - Users don't understand Supabase email verification
3. **Premature Authentication** - Account creation happens before showing serious interest

## ✅ Solution: Lead-First Approach

### New User Journey

```
Visitor
  ↓
Landing Page (/sales)
  ↓
Pig Farming Assessment Questionnaire (/assessment)
  ↓
Lead Scoring System (automatic)
  ↓
Decision Branch:
  │
  ├─ HIGH PRIORITY (80-100 points)
  │   ↓
  │   "You Qualify!" Page (/qualified)
  │   ↓
  │   Create Account (Supabase Auth)
  │   ↓
  │   Email Verification (/verify-email)
  │   ↓
  │   Payment Submission (/payment)
  │   ↓
  │   Admin Approval
  │   ↓
  │   Portal Access (/portal) ✅
  │
  └─ LOW PRIORITY (0-79 points)
      ↓
      "Thank You" Page (/thank-you)
      ↓
      Save Lead in Admin Dashboard
      ↓
      No account created
```

## 📊 Database Changes

### New Table: leads

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  questionnaire_answers JSONB,
  lead_score INTEGER DEFAULT 0,
  lead_priority TEXT DEFAULT 'low', -- high, medium, low
  lead_status TEXT DEFAULT 'new', -- new, qualified, follow_up, nurture, invited, registered
  farming_stage TEXT, -- existing_farmer, starter, researcher
  purchase_intent TEXT, -- high, medium, low
  recommended_action TEXT, -- allow_registration, follow_up, nurture
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Updated Table: profiles

```sql
-- Add lead_id reference
ALTER TABLE profiles ADD COLUMN lead_id INTEGER REFERENCES leads(id);
```

## 🔧 Implementation Steps

### Step 1: Database Migration
- [ ] Create leads table
- [ ] Update profiles table with lead_id
- [ ] Add RLS policies for leads
- [ ] Create indexes

### Step 2: Questionnaire System
- [ ] Create /assessment page (multi-step form)
- [ ] Implement lead scoring logic
- [ ] Create scoring API endpoint
- [ ] Store lead in database

### Step 3: Result Pages
- [ ] Create /qualified page (high priority)
- [ ] Create /thank-you page (low priority)
- [ ] Create /verify-email page
- [ ] Create /payment page

### Step 4: Auth Flow Refactor
- [ ] Update /register to check lead qualification
- [ ] Update auth callback to handle verification
- [ ] Create proper redirect flow
- [ ] Add email verification checks

### Step 5: Portal States
- [ ] Not authenticated state
- [ ] Email not verified state
- [ ] Payment pending state
- [ ] Payment approved state (content unlocked)
- [ ] Never show empty portal

### Step 6: Admin Dashboard
- [ ] Add leads management page
- [ ] Add lead scoring display
- [ ] Add priority filtering
- [ ] Add lead actions (view, invite, change priority)
- [ ] Update registrations page

### Step 7: Update Sales Page
- [ ] Change CTA from "Register Now" to "Check If You Qualify"
- [ ] Link to /assessment
- [ ] Remove premature registration form

## 📝 Questionnaire Questions

### Section 1: Personal Details
1. Full Name
2. WhatsApp Phone Number
3. Email Address
4. Location (Town/Province)

### Section 2: Farming Background
5. Current farming situation (score: 5-30)
6. Number of pigs owned (score: 5-30)
7. Farming experience (score: 5-20)

### Section 3: Goals & Timeline
8. Main goal (score: 5-30)
9. Starting timeline (score: 5-25)
10. Available resources (score: 0-55)

### Section 4: Challenges
11. Biggest challenges (score: 5-10 each)
12. Problems to avoid (text analysis)

### Section 5: Readiness
13. Investment readiness (score: 0-25)
14. Expected outcome (score: 5-25)
15. Why join (text analysis: +20 for high intent)

## 🎯 Lead Scoring System

### Maximum Score: 150 points

**High Priority (80-150 points):**
- Already farming OR serious starter
- Has resources
- Has timeline
- Ready to invest
- **Action:** Allow account creation

**Medium Priority (50-79 points):**
- Interested but not ready
- Needs more nurturing
- **Action:** Save lead + send free resources

**Low Priority (0-49 points):**
- Just browsing
- Wants free information only
- **Action:** Admin CRM only, no account

## 🔐 Authentication Flow (Fixed)

### Before (Broken):
```
Register → /portal (empty) ❌
```

### After (Fixed):
```
Register → /verify-email (clear instructions)
  ↓
User clicks email link
  ↓
Supabase verifies
  ↓
Redirect to /payment
  ↓
Submit payment proof
  ↓
Admin approves
  ↓
/portal (with content) ✅
```

## 📱 Portal States

### State 1: Not Logged In
```
Please login to access your Masterclass

[Login] [Register]
```

### State 2: Email Not Verified
```
Verify Your Email

We sent a confirmation link to user@email.com

1. Open your email
2. Click the confirmation link
3. Return here

[Resend Email] [Login]
```

### State 3: Verified, No Payment
```
Complete Your Payment

Your account is ready. Submit payment to unlock:

✓ Training Videos
✓ Pig Farmer's Guide
✓ WhatsApp Support
✓ Lifetime Access

Amount: ZMW 400
Send to: +260 97 123 4567

[Submit Payment Proof]
```

### State 4: Payment Pending
```
Payment Under Review

We're verifying your Airtel Money payment.

Expected approval: Within 24 hours

You'll receive an email once approved.
```

### State 5: Approved (Content Unlocked)
```
Welcome, John!

Your Masterclass Portal

📅 Schedule: August 5-7, 2024
⏰ Time: 19:30 - 20:30

[Download Materials]
[Join WhatsApp Group]
[Watch Recordings]
```

## 🚀 Implementation Priority

1. **CRITICAL:** Create leads table and questionnaire
2. **CRITICAL:** Fix auth flow (verify-email page)
3. **HIGH:** Implement lead scoring
4. **HIGH:** Create qualification result pages
5. **MEDIUM:** Update portal with proper states
6. **MEDIUM:** Admin lead management
7. **LOW:** Advanced features (email notifications, etc.)

## 📋 Files to Create/Modify

### New Files
- `app/assessment/page.tsx` - Questionnaire
- `app/qualified/page.tsx` - Qualification success
- `app/thank-you/page.tsx` - Low priority thank you
- `app/verify-email/page.tsx` - Email verification instructions
- `app/payment/page.tsx` - Payment submission
- `app/api/assessment/submit/route.ts` - Score and save lead
- `app/api/leads/route.ts` - Lead management API
- `components/questionnaire-form.tsx` - Multi-step form
- `components/lead-scoring.ts` - Scoring logic

### Modified Files
- `app/(auth)/register/page.tsx` - Check lead qualification
- `app/(portal)/layout.tsx` - Add proper states
- `app/(portal)/dashboard/page.tsx` - Content based on status
- `app/admin/dashboard/page.tsx` - Add leads section
- `app/sales/page.tsx` - Link to assessment
- `middleware.ts` - Update protected paths
- Database migration SQL

## 🎨 UX Improvements

### Clear Communication
- ✅ Tell users exactly what happens after each step
- ✅ Show email verification instructions prominently
- ✅ Never show empty portal
- ✅ Clear call-to-action at every stage

### Reduced Friction
- ✅ No account required for questionnaire
- ✅ Only qualified leads create accounts
- ✅ Clear next steps always visible
- ✅ Progress indicators

### Better Conversion
- ✅ Qualification increases commitment
- ✅ Lead scoring focuses on serious buyers
- ✅ Low-priority leads nurtured separately
- ✅ Admin can focus on high-value prospects

## ✅ Success Metrics

- Reduced bounce rate on registration
- Increased questionnaire completion
- Higher quality leads (score > 70)
- Reduced support questions about "what happens next"
- Increased conversion from assessment to payment
- Better admin dashboard usability

---

**This refactor will transform the application from a confusing auth-first system to a proper sales funnel with lead qualification.** 🎯