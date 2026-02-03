# Quick Setup Instructions

## ⚠️ IMPORTANT: Install Node.js First!

Before running any commands, you **must** have Node.js installed.

### Check if Node.js is installed:

Open PowerShell or Command Prompt and run:
```bash
node --version
npm --version
```

### If Node.js is NOT installed:

1. **Download Node.js**
   - Visit: https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Run the installer
   - **Important**: Check "Add to PATH" during installation

2. **Restart your terminal** after installation

3. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

## After Node.js is installed:

### Step 1: Install Project Dependencies

```bash
npm install
```

This will:
- Download and install Next.js, React, TypeScript, Prisma, and all other packages
- Create a `node_modules` folder
- May take 2-5 minutes depending on your internet speed

### Step 2: Set Up Environment

```bash
# Copy the example environment file
copy env.example .env
```

Then edit `.env` and add your database URL.

### Step 3: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npm run db:migrate

# Add test data
npm run db:seed
```

### Step 4: Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Common Issues

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Restart terminal after installing Node.js
- Reinstall Node.js and make sure to check "Add to PATH"

### "Cannot find module"
- Run `npm install` first
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Need Help?

See [INSTALLATION.md](INSTALLATION.md) for detailed installation guide.
