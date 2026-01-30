# Usina Cultural - Supabase Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- Payment gateway account (Stripe, Mercado Pago, or Asaas)

## 🔧 Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **New Project**
3. Fill in project details:
   - **Name**: Usina Cultural
   - **Database Password**: (save this securely!)
   - **Region**: South America (São Paulo) for best performance in Brazil
4. Click **Create new project** (takes ~2 minutes)

## 🗄️ Step 2: Set Up Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. In your project dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click **Run**
5. Repeat for `supabase/rls_policies.sql`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push schema
supabase db push
```

## 🔑 Step 3: Get API Credentials

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (safe to use in frontend)
   - **service_role** key (NEVER expose in frontend!)

## 📝 Step 4: Configure Environment Variables

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

**IMPORTANT**: Add `.env.local` to `.gitignore` (already done)

## 🔐 Step 5: Enable Authentication Providers

### Email/Password (Already enabled by default)

No action needed! Email/password auth is enabled automatically.

### Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. You need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
4. Paste in Supabase Google provider settings
5. Click **Save**

## 👤 Step 6: Create First Admin User

### Option A: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: `produtorahc@gmail.com`
   - **Password**: (choose a secure password)
   - **Auto Confirm User**: ✅ (check this)
4. Click **Create user**
5. Copy the **User UID**
6. Go to **Table Editor** → **user_profiles**
7. Find the row with this UID
8. Edit the row:
   - **role**: `admin`
   - **subscription_status**: `active`
   - **subscription_plan**: `founder`
9. Click **Save**

### Option B: Via SQL

```sql
-- First, create the auth user (do this in Authentication UI)
-- Then update the profile:

UPDATE user_profiles
SET 
    role = 'admin',
    subscription_status = 'active',
    subscription_plan = 'founder'
WHERE email = 'produtorahc@gmail.com';
```

## 📦 Step 7: Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` and other dependencies.

## 🚀 Step 8: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login`

3. Test email/password login with your admin account

4. Test Google sign-in (if configured)

5. Verify:
   - User is redirected to dashboard
   - User profile is loaded correctly
   - Admin features are accessible

## 🔒 Step 9: Verify Row Level Security

Test that RLS is working:

1. Create a test user (non-admin)
2. Try to access admin-only features → Should be blocked
3. Try to create a project as free user → Should be blocked
4. Upgrade test user to paid → Should now be able to create projects

## 💳 Step 10: Set Up Payment Webhooks

### For Stripe

1. Install Stripe CLI for testing:
   ```bash
   npm install -g stripe
   stripe login
   ```

2. Create a webhook endpoint (Edge Function):
   ```bash
   supabase functions new payment-webhook
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy payment-webhook
   ```

4. In Stripe Dashboard:
   - Go to **Developers** → **Webhooks**
   - Add endpoint: `https://your-project.supabase.co/functions/v1/payment-webhook`
   - Select events: `customer.subscription.*`
   - Copy webhook secret to `.env.local`

### For Mercado Pago

1. Go to Mercado Pago Developer Dashboard
2. Configure IPN URL: `https://your-project.supabase.co/functions/v1/payment-webhook`
3. Save the webhook secret

## 📊 Step 11: Set Up Storage (for Edital PDFs)

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Create bucket:
   - **Name**: `editals`
   - **Public**: ✅ (for public access to PDFs)
4. Set up storage policies:

```sql
-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read editals"
ON storage.objects FOR SELECT
USING (bucket_id = 'editals' AND auth.uid() IS NOT NULL);

-- Only admins can upload
CREATE POLICY "Admins can upload editals"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'editals' AND
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

## 🧪 Step 12: Testing Checklist

- [ ] User can sign up with email/password
- [ ] User can sign in with Google
- [ ] User profile is created automatically
- [ ] Free users cannot create projects
- [ ] Paid users can create projects
- [ ] Admin can access all features
- [ ] RLS prevents unauthorized access
- [ ] Password reset email works
- [ ] Webhooks update subscription status

## 📈 Step 13: Monitoring & Analytics

### Enable Supabase Analytics

1. Go to **Reports** in Supabase Dashboard
2. Monitor:
   - API requests
   - Database performance
   - Auth events
   - Storage usage

### Set Up Alerts

1. Go to **Project Settings** → **Alerts**
2. Configure alerts for:
   - High API usage
   - Database size limits
   - Auth failures

## 🔒 Security Best Practices

- [ ] Never commit `.env.local` to git
- [ ] Never expose `service_role` key in frontend
- [ ] Always use RLS policies
- [ ] Validate user input on backend
- [ ] Use HTTPS in production
- [ ] Enable 2FA for Supabase account
- [ ] Regularly review audit logs
- [ ] Keep dependencies updated

## 🚢 Step 14: Deployment

### Vercel/Netlify

1. Add environment variables in dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Deploy:
   ```bash
   npm run build
   vercel deploy
   ```

3. Update Google OAuth redirect URIs with production URL

### Update Supabase Settings

1. Go to **Authentication** → **URL Configuration**
2. Add your production URL to **Site URL**
3. Add to **Redirect URLs**

## 🆘 Troubleshooting

### "Invalid API key" error
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart dev server after changing `.env.local`

### "Row Level Security policy violation"
- Check that RLS policies are deployed
- Verify user has correct role in `user_profiles`
- Check browser console for detailed error

### Google OAuth not working
- Verify redirect URI matches exactly
- Check that Google OAuth is enabled in Supabase
- Ensure Client ID and Secret are correct

### User profile not created
- Check that trigger `on_auth_user_created` exists
- Manually create profile if needed
- Check Supabase logs for errors

## 📞 Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎯 Next Steps

1. Implement pricing page
2. Integrate payment gateway checkout
3. Create admin dashboard
4. Set up email templates
5. Add more OAuth providers (Facebook, Apple)
6. Implement real-time features with Supabase Realtime
7. Set up automated backups
