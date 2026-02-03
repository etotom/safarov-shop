# Quick Start Guide

Get Safarov shop running locally in 5 minutes!

## Prerequisites

- **Node.js 18+ installed** - [Download here](https://nodejs.org/) if not installed
- PostgreSQL database (local or cloud)
- 5 minutes of your time

> ⚠️ **First time?** Make sure Node.js is installed. Run `node --version` to check. If it doesn't work, install Node.js first and restart your terminal.

## Steps

### 1. Install Dependencies

**Important**: Make sure Node.js is installed first! Run `node --version` to verify.

```bash
npm install
```

This will install all packages (Next.js, React, Prisma, etc.) and create a `node_modules` folder.

### 2. Set Up Environment

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and add your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/safarovshop?schema=public"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 3. Seed with Test Data

```bash
npm run db:seed
```

This creates a `data/` folder with JSON files containing test products, users, and categories.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test Login

Use these test accounts (created by seed):

- **Admin**: admin@safarovshop.com / admin123
- **User**: user@safarovshop.com / user123

## What's Next?

- Browse products at `/products`
- Add items to cart
- Test checkout (requires Stripe keys)
- Access admin panel at `/admin` (admin account only)

## Troubleshooting

**Data not loading?**
- Run `npm run db:seed` to create initial data
- Check that `data/` folder exists with JSON files

**Port already in use?**
- Change port: `npm run dev -- -p 3001`

## Need Help?

Check the full [README.md](README.md) for detailed documentation.
