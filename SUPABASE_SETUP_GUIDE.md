# Supabase Migration - Complete Setup Guide

## 🎯 Overview

This is a complete migration from Vercel Blob to Supabase for the Pig Farming Masterclass application. The system now uses:

- **Supabase Auth** - User authentication and management
- **Supabase Database** - PostgreSQL for registrations and downloads
- **Supabase Storage** - Private file storage for PDF guides
- **Manual Payment Verification** - Admin workflow for Airtel Money payments

## 📋 Prerequisites

1. A Supabase account (https://supabase.com)
2. A Supabase project created
3. Node.js 18+ installed
4. pnpm package manager

## 🚀 Setup Steps

### Step 1: Environment Configuration

Create `.env.local` in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# WhatsApp Group Link
NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/YOUR_GROUP_LINK

# Masterclass Configuration
NEXT_PUBLIC_MASTERCLASS_DATE=2024-08-05T19:30:00
NEXT_PUBLIC_PRICE_INCREASE_DATE=2024-07-19T23:59:59
```

**Where to find these values:**
- Go to your Supabase project
- Settings → API
- Copy the Project URL and anon/public key
- For service role key, go to Settings → API → Service Role Key

### Step 2: Database Setup

Run the migration SQL in your Supabase project:

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20240101000000_create_tables.sql`
4. Click "Run" to execute the migration

This will create:
- `registrations` table
- `pdf_downloads` table
- `announcements` table
- All necessary indexes and RLS policies

### Step 3: Storage Setup

Create the private storage bucket:

1. Go to Supabase Dashboard
2. Navigate to Storage
3. Click "Create a new bucket"
4. Name: `masterclass-files`
5. Set to **Private** (not public)
6. Click "Create bucket"

**Upload PDF Guide:**
1. Go to Storage → masterclass-files
2. Click "Upload file"
3. Select your PDF guide (e.g., `pig-farmers-guide.pdf`)
4. Upload the file

### Step 4: Create Admin User

To create an admin user:

1. Go to Authentication → Users in Supabase Dashboard
2. Click "Add user" → "Create new user"
3. Enter email and password
4. After creation, go to the user's "Metadata" section
5. Add to `user_metadata`:
   ```json
   {
     "role": "admin"
   }
   ```
6. Or use the SQL Editor:
   ```sql
   UPDATE auth.users 
   SET user_metadata = jsonb_set(COALESCE(user_metadata, '{}'), '{role}', '"admin"')
   WHERE email = 'admin@example.com';
   ```

### Step 5: Install Dependencies

```bash
pnpm install
```

### Step 6: Run Development Server

```bash
pnpm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
app/
├── (auth)/                          # Authentication routes
│   ├── login/page.tsx               # Login page
│   └── register/page.tsx            # Registration page
├── admin/                           # Admin dashboard
│   ├── layout.tsx                   # Admin layout with auth check
│   ├── dashboard/page.tsx           # Admin dashboard overview
│   ├── registrations/
│   │   ├── page.tsx                 # List all registrations
│   │   └── [id]/page.tsx           # Review registration
│   └── uploads/page.tsx             # Upload PDF files
├── api/                             # API routes
│   ├── auth/signout/route.ts        # Logout endpoint
│   ├── register/route.ts            # Create registration
│   ├── admin/registrations/approve/route.ts  # Approve/reject
│   └── downloads/generate/route.ts  # Generate signed URLs
├── portal/                          # Student portal
│   ├── layout.tsx                   # Portal layout with auth
│   ├── dashboard/page.tsx           # Student dashboard
│   ├── downloads/page.tsx           # Download materials
│   └── status/page.tsx              # Registration status
├── sales/                           # Sales pages
│   ├── page.tsx                     # Main sales page
│   └── complete-registration/page.tsx  # Payment & registration
└── auth/callback/route.ts           # Auth callback handler

components/
├── registration-form.tsx            # Registration form component
├── sales-hero.tsx                   # Hero section with countdown
├── sales-problem-solution.tsx       # Problem/solution section
└── sales-testimonials.tsx           # Testimonials section

lib/
├── supabase/
│   ├── client.ts                    # Browser Supabase client
│   └── server.ts                    # Server Supabase client
└── types/
    └── supabase.ts                  # TypeScript type definitions

supabase/
└── migrations/
    └── 20240101000000_create_tables.sql  # Database schema
```

## 🔐 Authentication Flow

### User Registration Flow

```
1. User visits /register
   ↓
2. Creates account (email/password)
   ↓
3. Redirected to /sales?registered=true
   ↓
4. User clicks "Complete Registration"
   ↓
5. Redirected to /sales/complete-registration
   ↓
6. User submits payment details (Airtel Money)
   ↓
7. Registration created with status: "pending"
   ↓
8. User sees confirmation page
```

### Admin Approval Flow

```
1. Admin logs in at /login
   ↓
2. Redirected to /admin/dashboard
   ↓
3. Views pending registrations
   ↓
4. Clicks "Review" on registration
   ↓
5. Verifies Airtel Money payment manually
   ↓
6. Clicks "Approve" or "Reject"
   ↓
7. Registration status updated
   ↓
8. User can now access portal (if approved)
```

### Student Portal Access

```
1. User visits /portal
   ↓
2. System checks authentication
   ↓
3. System checks registration status
   ↓
4a. If pending → Shows "Pending Approval" page
   ↓
4b. If rejected → Shows "Not Approved" page
   ↓
4c. If approved → Shows portal dashboard
   ↓
5. User can download PDFs, view announcements
```

## 💾 Database Schema

### registrations
- `id` - Primary key
- `user_id` - Foreign key to auth.users
- `full_name` - Participant's full name
- `phone` - Phone number
- `email` - Email address
- `nrc` - National Registration Card (optional)
- `transaction_reference` - Airtel Money transaction ID
- `payment_method` - Payment method used
- `amount` - Amount paid
- `status` - pending/approved/rejected
- `approved_by` - Admin who approved
- `approved_at` - Approval timestamp
- `rejection_reason` - Reason if rejected
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### pdf_downloads
- `id` - Primary key
- `registration_id` - Foreign key to registrations
- `user_id` - Foreign key to auth.users
- `file_name` - Name of downloaded file
- `downloaded_at` - Download timestamp

### announcements
- `id` - Primary key
- `title` - Announcement title
- `message` - Announcement content
- `publish_date` - When to publish
- `expiry_date` - When to expire (optional)
- `is_active` - Active status
- `created_by` - Admin who created
- `created_at` - Creation timestamp

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled:

- **Users** can only view their own registrations
- **Users** can only view their own downloads
- **Admins** can view and manage all records
- **Everyone** can view active announcements
- **Storage** bucket is private - only signed URLs work

### Admin Role Check

Admin status is checked via:
```typescript
user.user_metadata?.role === 'admin' || 
user.app_metadata?.role === 'admin'
```

## 📤 File Uploads & Downloads

### Uploading Files (Admin)

1. Admin goes to /admin/uploads
2. Selects PDF file
3. File uploads to `masterclass-files` bucket
4. File is now available for download

### Downloading Files (Student)

1. Student clicks "Download" in portal
2. System verifies:
   - User is authenticated
   - Registration is approved
3. Generates signed URL (expires in 60 seconds)
4. Records download in database
5. Opens file in new tab

## 🎨 Features Implemented

### Sales Page
- ✅ Countdown timer to masterclass
- ✅ Live spots remaining counter
- ✅ Price increase urgency messaging
- ✅ Enhanced testimonials with results
- ✅ Problem/Solution with scarcity
- ✅ Multiple CTAs with FOMO messaging
- ✅ Airtel Money payment instructions

### Authentication
- ✅ Email/password registration
- ✅ Login/logout functionality
- ✅ Protected routes
- ✅ Session management
- ✅ Auth callback handler

### Admin Dashboard
- ✅ Statistics overview
- ✅ Registration management
- ✅ Approve/reject workflow
- ✅ File upload management
- ✅ Recent registrations table

### Student Portal
- ✅ Protected portal access
- ✅ Dashboard with masterclass info
- ✅ Download materials
- ✅ Status pages (pending/approved/rejected)
- ✅ Announcements display
- ✅ WhatsApp group link

### Payment System
- ✅ Manual Airtel Money payment
- ✅ Transaction reference collection
- ✅ Admin verification workflow
- ✅ Approval/rejection with reasons
- ✅ No automatic payment verification

## 🧪 Testing

### Test User Registration
1. Visit http://localhost:3000/register
2. Create account with email/password
3. Should redirect to sales page

### Test Registration Submission
1. Click "Complete Registration"
2. Fill in payment details
3. Submit form
4. Should see success message

### Test Admin Approval
1. Login as admin at /login
2. Go to /admin/registrations
3. Click "Review" on pending registration
4. Click "Approve"
5. Registration status should update

### Test Student Portal
1. Login as approved student
2. Visit /portal
3. Should see dashboard
4. Can download PDFs
5. Can view announcements

### Test Download
1. Go to /portal/downloads
2. Click "Download" on a file
3. Should open PDF in new tab
4. Download should be recorded

## 🚨 Important Notes

### Storage Bucket
- The `masterclass-files` bucket must be created manually in Supabase
- Must be set to **Private** for security
- Files are accessed via signed URLs (60-second expiry)

### Admin Users
- Admin role is set via user_metadata or app_metadata
- Only users with `role: "admin"` can access /admin routes
- Create admin users through Supabase Dashboard

### Payment Verification
- Payments are **NOT** automatically verified
- Admin must manually check Airtel Money transactions
- This is by design for manual payment workflows

### Environment Variables
- Never commit `.env.local` to git
- Use `.env.local.example` as template
- Rotate keys if exposed

## 🐛 Troubleshooting

### "Module not found" errors
```bash
pnpm install
```

### "Unauthorized" errors
- Check Supabase URL and keys in `.env.local`
- Verify user is logged in
- Check RLS policies in Supabase

### "Bucket not found" errors
- Create `masterclass-files` bucket in Supabase Storage
- Ensure bucket is set to Private

### "Permission denied" errors
- Check RLS policies
- Verify user has correct role
- Check if registration is approved

### TypeScript errors
- Some errors may show but app will still work
- These are due to Supabase type inference
- Can be fixed by running `supabase genese types`

## 📊 Monitoring

### Key Metrics to Track
- Total registrations
- Pending approvals
- Approval rate
- PDF downloads
- User login frequency

### Database Queries
```sql
-- Total registrations
SELECT COUNT(*) FROM registrations;

-- Pending registrations
SELECT COUNT(*) FROM registrations WHERE status = 'pending';

-- Download statistics
SELECT file_name, COUNT(*) as downloads 
FROM pdf_downloads 
GROUP BY file_name;

-- Recent registrations
SELECT * FROM registrations 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔄 Migration from Vercel Blob

### What Changed
- ❌ Vercel Blob Storage → ✅ Supabase Storage
- ❌ Blob upload routes → ✅ Supabase direct upload
- ❌ Blob download routes → ✅ Signed URL generation
- ❌ Blob environment variables → ✅ Supabase credentials

### What Stayed the Same
- ✅ Sales page design
- ✅ User interface
- ✅ Registration flow
- ✅ Admin workflow
- ✅ Database structure (mostly)

## 📝 Next Steps

1. **Configure Supabase** - Follow setup steps above
2. **Upload PDF** - Add your Pig Farmer's Guide
3. **Create Admin** - Set up admin user account
4. **Test Flow** - Go through entire user journey
5. **Customize** - Update content, pricing, dates
6. **Deploy** - Deploy to Vercel or your hosting platform
7. **Monitor** - Watch registrations and downloads

## 🆘 Support

For issues or questions:
1. Check this guide
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for errors
4. Review Supabase logs in dashboard

## ✅ Checklist

Before going live:

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database migration run
- [ ] Storage bucket created
- [ ] PDF guide uploaded
- [ ] Admin user created
- [ ] Test registration flow works
- [ ] Test admin approval works
- [ ] Test student portal works
- [ ] Test PDF downloads work
- [ ] All environment variables set in production
- [ ] RLS policies verified
- [ ] Error handling tested
- [ ] Mobile responsiveness checked

---

**Migration Complete!** 🎉

Your application is now fully powered by Supabase with:
- Secure authentication
- Private file storage
- Admin approval workflow
- Student portal access
- Download tracking