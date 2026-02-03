# Deployment Guide - Safarov shop

This guide will help you deploy Safarov shop to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres, Supabase, Neon, or similar)
- Stripe account

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up PostgreSQL Database

**Option A: Vercel Postgres**
1. In Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string

**Option B: External Database (Supabase/Neon)**
1. Create account at [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from project settings

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (or `prisma generate && prisma migrate deploy && next build`)
   - **Output Directory**: `.next` (default)

### 4. Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Run Database Migrations

After first deployment, run migrations:

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Using Vercel Dashboard**
1. Go to your project → Settings → Functions
2. Add a new serverless function or use the Vercel CLI

**Option C: Add to Build Command**
Update `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 6. Seed the Database

After migrations, seed the database:

```bash
vercel env pull .env.local
npm run db:seed
```

Or create a one-time script and run it via Vercel CLI.

### 7. Set Up Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-project.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
5. Copy the webhook signing secret
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 8. Update Image Domains

If using external image sources, ensure they're in `next.config.js`:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    // Add your image domains
  ],
}
```

### 9. Test Your Deployment

1. Visit your Vercel URL
2. Test sign up/sign in
3. Browse products
4. Add items to cart
5. Test checkout (use Stripe test cards)
6. Verify admin panel access

### 10. Production Checklist

- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] Database seeded with initial data
- [ ] Stripe webhook configured
- [ ] Stripe keys switched to live mode (when ready)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics enabled (optional)

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure SSL is enabled if required

### Build Failures

- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Prisma Client is generated before build

### Stripe Webhook Not Working

- Verify webhook URL is correct
- Check webhook secret matches
- Review Stripe dashboard for webhook delivery logs

### Images Not Loading

- Verify image domains in `next.config.js`
- Check image URLs are accessible
- Ensure Next.js Image optimization is working

## Post-Deployment

1. **Monitor Logs**: Check Vercel function logs for errors
2. **Set Up Monitoring**: Consider adding error tracking (Sentry, etc.)
3. **Backup Database**: Set up regular database backups
4. **Update README**: Update deployment URLs in documentation

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
