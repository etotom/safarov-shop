# Safarov shop - Luxury E-commerce Platform

A full-featured e-commerce website built with Next.js 14 (App Router), TypeScript, Prisma, and Stripe. Inspired by luxury fashion brands with a clean, minimalist design.

## Features

- 🛍️ **Product Catalog** - Browse products with filtering, sorting, and pagination
- 🛒 **Shopping Cart** - Add items, update quantities, and manage cart
- 💳 **Stripe Integration** - Secure payment processing with Stripe Checkout
- 👤 **User Authentication** - Sign up, sign in with NextAuth.js
- 📦 **Order Management** - Track orders and view order history
- 🎨 **Admin Panel** - Full CRUD operations for products, categories, and orders
- 📱 **Responsive Design** - Mobile-first, fully responsive layout
- 🎯 **SEO Optimized** - Server-side rendering and optimized images

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: File-based JSON storage (no database required!)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Image Optimization**: Next.js Image component with Unsplash/Pexels

## Prerequisites

- **Node.js 18+ and npm** - [Download Node.js](https://nodejs.org/) (includes npm)
- Stripe account (for payment processing - optional for development)

> ✅ **No database required!** This project uses a simple file-based storage system (JSON files) for easy development.

> ⚠️ **Important**: If you don't have Node.js installed, please install it first from [nodejs.org](https://nodejs.org/). After installation, restart your terminal.

## Installation

1. **Verify Node.js is installed**

```bash
node --version
npm --version
```

If these commands don't work, install Node.js from [nodejs.org](https://nodejs.org/)

2. **Clone the repository** (if using git)

```bash
git clone <repository-url>
cd safarov-shop
```

Or if you already have the project files, navigate to the project directory.

3. **Install dependencies**

```bash
npm install
```

This will create a `node_modules` folder with all required packages (Next.js, React, Prisma, etc.)

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/safarovshop?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run db:seed
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

After seeding the database, you can use these test accounts:

- **Admin**: 
  - Email: `admin@safarovshop.com`
  - Password: `admin123`

- **User**: 
  - Email: `user@safarovshop.com`
  - Password: `user123`

## Project Structure

```
safarov-shop/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product pages
│   └── category/           # Category pages
├── components/             # React components
│   ├── layout/            # Header, Footer
│   ├── products/          # Product-related components
│   └── cart/              # Cart components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── prisma/                # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seed script
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env` file
4. For webhooks (production):
   - Set up a webhook endpoint in Stripe Dashboard
   - Use the URL: `https://yourdomain.com/api/webhooks/stripe`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Data Storage

The application uses a simple file-based storage system. All data is stored in JSON files in the `data/` directory:

- `users.json` - User accounts with roles (USER, ADMIN)
- `products.json` - Product information
- `categories.json` - Product categories with hierarchy
- `productImages.json` - Product images
- `variants.json` - Product variants (size, color)
- `inventory.json` - Stock management
- `orders.json` - Customer orders
- `orderItems.json` - Order line items
- `cartItems.json` - Shopping cart items
- `addresses.json` - Shipping addresses

> **Note**: For production, consider migrating to a proper database (PostgreSQL, MongoDB, etc.)

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from your `.env` file
   - Make sure to update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel domain

4. **Set up PostgreSQL**
   - Use Vercel Postgres or external service (Supabase, Neon, etc.)
   - Add `DATABASE_URL` to environment variables

5. **Run migrations**
   - In Vercel dashboard, go to your project settings
   - Use the Vercel CLI or add a build command:
   ```bash
   npx prisma migrate deploy && npm run build
   ```

6. **Configure Stripe Webhook**
   - In Stripe Dashboard, add webhook endpoint:
   - URL: `https://yourdomain.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### Database Migrations on Vercel

You can run migrations using Vercel CLI:

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

Or add to your build command in `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Image Sources

All product images are sourced from:
- [Unsplash](https://unsplash.com) - Free high-quality images
- [Pexels](https://pexels.com) - Free stock photos

**Note**: These are placeholder images. Replace them with your own product photos in production.

## Legal Notice

This project is inspired by luxury fashion brands but does not use any copyrighted materials, logos, or protected content. All branding, images, and content are original or from royalty-free sources.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
