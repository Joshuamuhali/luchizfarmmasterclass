# High-Conversion Sales Page - Setup Guide

## Overview
This sales page includes all conversion-optimization features for the Pig Farming Masterclass.

## Features Implemented

### 1. ✅ Vercel Blob Storage Integration
- **Upload API**: `/api/upload-pdf` - Upload PDF to Vercel Blob
- **Admin Page**: `/admin/upload-pdf` - Upload interface for PDF guide
- **Download API**: `/api/download-pdf` - Track and serve PDF downloads

### 2. ✅ Countdown Timer
- Real-time countdown to masterclass start date
- Configured via `NEXT_PUBLIC_MASTERCLASS_DATE` in `.env.local`
- Displays days, hours, minutes, and seconds

### 3. ✅ Scarcity Elements
- Live spots remaining counter (decrements every minute)
- Price increase warnings with 48-hour urgency
- Limited availability messaging throughout
- FOMO (Fear Of Missing Out) banners

### 4. ✅ Enhanced Social Proof
- 6 detailed testimonials with specific results
- Result badges showing concrete outcomes
- Social proof statistics (240+ farmers, 4.9/5 rating, 3x profit)
- Trust badges and urgency banners

### 5. ✅ PDF Download System
- Download tracking via database
- Admin upload page for PDF management
- Automatic PDF URL configuration
- Download button component for success pages

### 6. ✅ Optimized CTAs & FOMO Messaging
- Multiple strategically placed CTAs
- Animated pulse effect on primary CTA
- Value stack with emojis
- 30-day money-back guarantee badge
- Trust indicators (secure payment, instant access)
- Price comparison (ZMW 400 vs ZMW 800)

## Setup Instructions

### Step 1: Environment Configuration

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_database_url_here

# Authentication
BETTER_AUTH_SECRET=your_auth_secret_here

# WhatsApp Group
NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/YOUR_GROUP_LINK

# PDF Guide URL (get this after uploading)
NEXT_PUBLIC_PDF_URL=https://your-blob-storage-url.com/guide.pdf

# Masterclass Date (for countdown timer)
NEXT_PUBLIC_MASTERCLASS_DATE=2024-08-05T19:30:00

# Price Increase Date
NEXT_PUBLIC_PRICE_INCREASE_DATE=2024-07-19T23:59:59
```

### Step 2: Upload PDF Guide

1. Navigate to `/admin/upload-pdf` in your browser
2. Select your PDF file (Pig Farmer's Guide)
3. Copy the generated URL
4. Add it to `.env.local` as `NEXT_PUBLIC_PDF_URL`
5. Restart your development server

### Step 3: Database Setup

Ensure the `pdf_downloads` table exists in your database:

```sql
CREATE TABLE IF NOT EXISTS pdf_downloads (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER REFERENCES registrations(id),
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4: Customize Content

#### Update Dates
Edit `.env.local`:
- `NEXT_PUBLIC_MASTERCLASS_DATE` - Set to your actual masterclass date
- `NEXT_PUBLIC_PRICE_INCREASE_DATE` - Set to when price increases

#### Update Spots Remaining
In `components/sales-hero.tsx`, line 7:
```typescript
const [spotsLeft, setSpotsLeft] = useState(15) // Change to your actual spots
```

#### Update Social Proof Numbers
Search and replace across files:
- `240+` → Your actual number of farmers trained
- `15` → Your actual spot limit
- `ZMW 400` / `ZMW 800` → Your actual pricing

#### Customize Testimonials
Edit `components/sales-testimonials.tsx` to add your real testimonials with specific results.

### Step 5: Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## File Structure

```
app/
├── api/
│   ├── upload-pdf/
│   │   └── route.ts          # PDF upload endpoint
│   └── download-pdf/
│       └── route.ts          # PDF download with tracking
├── admin/
│   └── upload-pdf/
│       └── page.tsx          # Admin upload interface
└── sales/
    └── page.tsx              # Main sales page

components/
├── sales-hero.tsx            # Hero with countdown timer
├── sales-problem-solution.tsx # Problem/Solution with scarcity
├── sales-testimonials.tsx    # Enhanced testimonials
└── pdf-download-button.tsx   # Reusable download button

.env.local.example            # Environment variables template
```

## Key Features Breakdown

### Countdown Timer
- Real-time updates every second
- Configurable via environment variable
- Shows: Days, Hours, Minutes, Seconds

### Scarcity Tactics
1. **Spots Remaining**: Live counter that decrements
2. **Price Urgency**: 48-hour warning before price increase
3. **Limited Spots**: "Only 15 spots available" messaging
4. **Registration Closes**: When spots fill, registration ends

### Social Proof Elements
- 6 detailed testimonials with specific results
- Result badges (e.g., "3x Profit Increase")
- Statistics with subtext
- Trust badges
- Urgency banners

### PDF Download Flow
1. User registers via form
2. Admin approves registration
3. Approved users can download PDF
4. Download is tracked in database
5. PDF served from Vercel Blob Storage

## Conversion Optimization Tips

1. **A/B Test**: Try different countdown messages
2. **Urgency**: Adjust spots remaining frequency
3. **Social Proof**: Add video testimonials
4. **Pricing**: Test different price points
5. **CTA Colors**: Test different button colors
6. **Headlines**: A/B test hero headlines

## Analytics to Track

- Registration conversion rate
- PDF download rate
- Time on page
- Scroll depth
- CTA click-through rate
- Bounce rate

## Maintenance

### Weekly Tasks
- Check registration numbers
- Monitor PDF downloads
- Review testimonials

### Monthly Tasks
- Update social proof numbers
- Refresh testimonials
- Review conversion metrics

## Support

For issues or questions:
1. Check Vercel Blob Storage is configured
2. Verify environment variables are set
3. Ensure database tables exist
4. Check browser console for errors

## Next Steps

1. ✅ Upload PDF guide
2. ✅ Set environment variables
3. ✅ Customize content
4. ✅ Test registration flow
5. ✅ Deploy to production
6. ✅ Monitor conversions
7. ✅ A/B test elements