# Supabase Migration Plan

## Phase 1: Setup & Configuration
- [ ] Install Supabase dependencies
- [ ] Create Supabase client configuration
- [ ] Set up environment variables
- [ ] Create database schema migrations

## Phase 2: Authentication System
- [ ] Implement Supabase Auth
- [ ] Create registration flow
- [ ] Create login/logout functionality
- [ ] Implement protected routes
- [ ] Add role-based access (admin vs student)

## Phase 3: Database Schema
- [ ] Create registrations table
- [ ] Create pdf_downloads table
- [ ] Create announcements table
- [ ] Set up Row Level Security (RLS)
- [ ] Create database functions

## Phase 4: Storage Setup
- [ ] Create masterclass-files bucket
- [ ] Configure RLS policies for storage
- [ ] Implement signed URL generation
- [ ] Create upload functionality for admins

## Phase 5: API Routes
- [ ] Remove Vercel Blob routes
- [ ] Create Supabase auth routes
- [ ] Create registration API
- [ ] Create PDF download API with signed URLs
- [ ] Create admin API routes

## Phase 6: Admin Dashboard
- [ ] Create admin layout
- [ ] Build dashboard overview
- [ ] Create registration management
- [ ] Build approval/rejection workflow
- [ ] Add PDF management
- [ ] Create announcement system
- [ ] Add download monitoring

## Phase 7: Student Portal
- [ ] Create protected portal layout
- [ ] Build dashboard for students
- [ ] Add masterclass information
- [ ] Implement PDF download
- [ ] Add announcements display
- [ ] Create status pages (pending/approved/rejected)

## Phase 8: Sales Page Updates
- [ ] Update registration form for Airtel Money
- [ ] Add payment instructions
- [ ] Update CTA buttons
- [ ] Add transaction reference field

## Phase 9: Testing & Cleanup
- [ ] Test authentication flow
- [ ] Test registration flow
- [ ] Test admin approval workflow
- [ ] Test PDF downloads
- [ ] Remove Vercel Blob code
- [ ] Clean up unused files
- [ ] Update documentation

## Files to Create
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/supabase/middleware.ts
- app/(auth)/login/page.tsx
- app/(auth)/register/page.tsx
- app/(portal)/layout.tsx
- app/(portal)/dashboard/page.tsx
- app/(portal)/downloads/page.tsx
- app/(portal)/status/page.tsx
- app/admin/layout.tsx
- app/admin/dashboard/page.tsx
- app/admin/registrations/page.tsx
- app/admin/registrations/[id]/page.tsx
- app/admin/uploads/page.tsx
- app/admin/announcements/page.tsx
- components/auth/login-form.tsx
- components/auth/register-form.tsx
- components/portal/student-dashboard.tsx
- components/admin/registration-table.tsx
- components/admin/stats-cards.tsx
- middleware.ts

## Files to Modify
- .env.local.example
- package.json
- app/sales/page.tsx
- components/registration-form.tsx
- lib/db.ts (remove or replace)

## Files to Remove
- app/api/upload-pdf/route.ts
- app/admin/upload-pdf/page.tsx
- components/pdf-download-button.tsx (replace with new component)
- @vercel/blob dependency