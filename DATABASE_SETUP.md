# Database Setup Guide

## Quick Setup

The application requires a PostgreSQL database. You have several options:

### Option 1: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/windows/
   - Or use a package manager like Chocolatey: `choco install postgresql`

2. **Create Database**
   ```sql
   CREATE DATABASE safarovshop;
   ```

3. **Update .env file**
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/safarovshop?schema=public"
   ```
   Replace `yourpassword` with your PostgreSQL password.

### Option 2: Docker (Easiest)

1. **Run PostgreSQL in Docker**
   ```bash
   docker run --name safarov-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=safarovshop -p 5432:5432 -d postgres
   ```

2. **Update .env file**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safarovshop?schema=public"
   ```

### Option 3: Cloud Database (Free Tiers)

**Supabase** (Recommended - Free tier available):
1. Go to https://supabase.com
2. Create a new project
3. Copy the connection string from Settings → Database
4. Update `.env` with the connection string

**Neon** (Free tier available):
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `.env` with the connection string

**Vercel Postgres** (If deploying to Vercel):
1. In Vercel dashboard, go to Storage
2. Create a Postgres database
3. Copy the connection string

## After Setting Up Database

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

3. **Seed Database** (optional - adds test data)
   ```bash
   npm run db:seed
   ```

## Test Connection

You can test your database connection with:
```bash
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

## Troubleshooting

**Connection refused?**
- Make sure PostgreSQL is running
- Check if port 5432 is correct
- Verify username/password in DATABASE_URL

**Database doesn't exist?**
- Create it manually: `CREATE DATABASE safarovshop;`
- Or let Prisma create it (if user has permissions)

**SSL required?**
- For cloud databases, add `?sslmode=require` to DATABASE_URL
- Example: `postgresql://...?schema=public&sslmode=require`
