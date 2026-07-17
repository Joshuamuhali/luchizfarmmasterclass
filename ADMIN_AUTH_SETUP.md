# Admin Authentication Setup Guide

This guide explains how to set up and use the admin authentication system for the Luchiz Farm Masterclass platform.

## Overview

The admin authentication system uses:
- **Supabase Auth** for authentication
- **profiles table** for role-based access control
- **Reusable auth utilities** for consistent security checks

## Files Created

### 1. Admin Authentication Utility
**File:** `lib/auth/admin-check.ts`

Provides reusable functions for admin authentication:
- `checkAdminAuth()` - Checks if current user is admin
- `requireAdminAuth()` - Redirects to login if not admin

### 2. Admin Login Page
**File:** `app/admin/login/page.tsx`

Dedicated login page for admin users at `/admin/login`

### 3. Admin Layout
**File:** `app/admin/layout.tsx`

Security gate that protects all admin routes (`/admin/*`)

### 4. Profiles Table Migration
**File:** `supabase/migrations/20250101000000_create_profiles_table.sql`

Creates the profiles table with role-based access control

### 5. Updated TypeScript Types
**File:** `types/supabase.ts`

Added profiles table type definitions

### 6. Updated Logout Route
**File:** `app/api/auth/signout/route.ts`

Smart logout that redirects to appropriate login page based on user role

## Setup Instructions

### Step 1: Run Database Migration

Execute the profiles table migration in your Supabase SQL Editor:

```sql
-- Run the migration file:
-- supabase/migrations/20250101000000_create_profiles_table.sql
```

This will:
- Create the `profiles` table
- Set up Row Level Security (RLS) policies
- Create a trigger to automatically create profiles for new users
- Add indexes for performance

### Step 2: Create Admin User

#### Option A: Using Supabase Dashboard

1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email: `admin@luchizfarm.com`
4. Enter a secure password
5. Click "Create user"

#### Option B: Using Supabase CLI

```bash
supabase auth signup --email admin@luchizfarm.com --password YOUR_SECURE_PASSWORD
```

### Step 3: Set Admin Role

After creating the admin user, you need to set their role to 'admin' in the profiles table.

#### Method 1: Using Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor → profiles
2. Find the admin user (by email or ID)
3. Update the `role` field to `admin`

#### Method 2: Using SQL Editor

```sql
-- First, get the user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@luchizfarm.com';

-- Then update the profile (replace USER_ID with actual ID)
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'USER_ID';
```

#### Method 3: Automatic (Recommended)

The migration includes a trigger that automatically creates a profile when a user signs up. However, you still need to manually set the role to 'admin' for the first admin user.

For subsequent admin users, you can create a simple admin invitation system or manually update the role.

### Step 4: Verify Setup

1. Visit `/admin/login`
2. Enter admin credentials: `admin@luchizfarm.com`
3. Enter password
4. You should be redirected to `/admin` dashboard

## Authentication Flow

### Admin Login Flow

```
User visits /admin/login
    ↓
Enter credentials
    ↓
Supabase Auth validates
    ↓
Check profiles.role = 'admin'
    ↓
If admin → Redirect to /admin
If not admin → Sign out + show error
```

### Admin Route Protection

```
User visits /admin/*
    ↓
AdminLayout loads
    ↓
requireAdminAuth() runs
    ↓
Check session
    ↓
Check profiles.role = 'admin'
    ↓
If admin → Show page
If not admin → Redirect to /admin/login
```

### Logout Flow

```
User clicks Logout
    ↓
POST /api/auth/signout
    ↓
Check if user is admin
    ↓
Clear Supabase session
    ↓
Redirect to /admin/login (if admin) or /login (if regular user)
```

## Security Features

### 1. Server-Side Authentication
- All admin routes use server components
- Authentication happens on the server before rendering
- No client-side role checks that can be bypassed

### 2. Database-Level Security
- Row Level Security (RLS) enabled on all tables
- Database remains the source of truth for roles
- Cannot bypass authentication by modifying frontend code

### 3. Reusable Auth Logic
- Single source of truth for admin checks
- Consistent security across all admin pages
- Easy to maintain and update

### 4. No Hardcoded Credentials
- Admin email is not hardcoded in the application
- Role is stored in database, not in code
- Passwords handled by Supabase Auth (secure)

## Usage in Admin Pages

All admin pages are automatically protected by the `AdminLayout`. To create a new admin page:

```tsx
// app/admin/new-page/page.tsx
import { requireAdminAuth } from '@/lib/auth/admin-check'

export default async function NewAdminPage() {
  // This will redirect to /admin/login if not authenticated
  const authResult = await requireAdminAuth()
  
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, {authResult.user?.email}</p>
    </div>
  )
}
```

## API Route Protection

For API routes that need admin authentication:

```typescript
// app/api/admin/example/route.ts
import { requireAdminAuth } from '@/lib/auth/admin-check'
import { NextResponse } from 'next/server'

export async function POST() {
  const authResult = await requireAdminAuth()
  
  // If we reach here, user is authenticated admin
  // Proceed with admin operation
  
  return NextResponse.json({ success: true })
}
```

## Troubleshooting

### "Profile not found" Error

**Cause:** User exists in auth.users but not in profiles table

**Solution:** The migration includes a trigger to auto-create profiles, but existing users need manual creation:

```sql
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, email, 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

### "Unauthorized: Admin access required" Error

**Cause:** User's role is not set to 'admin' in profiles table

**Solution:** Update the user's role:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@luchizfarm.com';
```

### Redirect Loop

**Cause:** Admin layout redirecting to login, which also uses admin layout

**Solution:** Ensure `/admin/login` is NOT wrapped in the admin layout. It should be a standalone page.

## Admin Credentials

**Default Admin:**
- Email: `admin@luchizfarm.com`
- Password: (Set during user creation)

**Important:** Change the default password after first login!

## Additional Notes

- The public login page at `/(auth)/login` is for regular users
- Admin login is separate at `/admin/login`
- Admin pages are at `/admin/*`
- User portal is at `/portal/*`
- All three are completely separate authentication flows

## Security Best Practices

1. **Never commit admin credentials** to version control
2. **Use strong passwords** for admin accounts
3. **Regularly audit** the profiles table for unauthorized admin roles
4. **Enable 2FA** on Supabase dashboard for extra security
5. **Monitor audit logs** for suspicious activity
6. **Limit admin access** to trusted personnel only