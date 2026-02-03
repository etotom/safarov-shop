# Installation Guide

## Prerequisites

Before installing dependencies, you need to have Node.js installed on your system.

### Step 1: Install Node.js

1. **Download Node.js**
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the LTS (Long Term Support) version for Windows
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Install Node.js**
   - Run the installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" option
   - Complete the installation

3. **Verify Installation**
   Open a new terminal/PowerShell window and run:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0 and 9.6.7)

### Step 2: Install Project Dependencies

Once Node.js is installed, navigate to the project directory and run:

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- Next.js and React
- TypeScript
- Prisma
- Tailwind CSS
- NextAuth
- Stripe
- And all other required packages

### Step 3: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   copy env.example .env
   ```

2. Edit `.env` and add your configuration:
   - Database URL
   - NextAuth secret
   - Stripe keys (optional for development)

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Node.js not found
- Make sure Node.js is installed
- Restart your terminal/PowerShell after installation
- Check if Node.js is in your PATH: `where node` (Windows)

### npm not found
- npm comes with Node.js, so if Node.js is installed, npm should work
- Try restarting your terminal
- Verify: `npm --version`

### Permission errors
- On Windows, you might need to run PowerShell as Administrator
- Or use a different terminal (Git Bash, Command Prompt)

### Port already in use
- Change the port: `npm run dev -- -p 3001`
- Or stop the process using port 3000

## Alternative: Using Package Managers

### Using Yarn
If you prefer Yarn:
```bash
yarn install
yarn dev
```

### Using pnpm
If you prefer pnpm:
```bash
pnpm install
pnpm dev
```

## Next Steps

After installation, see [QUICKSTART.md](QUICKSTART.md) for quick start instructions.
