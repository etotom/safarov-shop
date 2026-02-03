# Project Structure

```
safarov-shop/
├── app/                          # Next.js App Router
│   ├── account/                  # User account pages
│   │   └── page.tsx             # Account dashboard
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx           # Admin layout with navigation
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── products/            # Product management
│   │   ├── categories/          # Category management
│   │   └── orders/              # Order management
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── signup/          # User registration
│   │   ├── cart/                # Shopping cart API
│   │   ├── checkout/            # Checkout API
│   │   ├── orders/              # Orders API
│   │   ├── products/            # Products API
│   │   └── webhooks/            # Webhooks
│   │       └── stripe/          # Stripe webhook handler
│   ├── auth/                     # Authentication pages
│   │   ├── signin/              # Sign in page
│   │   └── signup/              # Sign up page
│   ├── cart/                     # Shopping cart page
│   ├── category/                 # Category pages
│   │   └── [slug]/              # Dynamic category page
│   ├── checkout/                 # Checkout flow
│   │   ├── page.tsx             # Checkout form
│   │   └── success/             # Success page
│   ├── products/                 # Product pages
│   │   ├── page.tsx             # Products listing
│   │   └── [slug]/              # Product detail page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── not-found.tsx            # 404 page
│   ├── page.tsx                 # Homepage
│   └── providers.tsx            # Client providers
│
├── components/                   # React components
│   ├── cart/                    # Cart components
│   │   └── AddToCartButton.tsx
│   ├── layout/                  # Layout components
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   └── products/               # Product components
│       ├── ProductCard.tsx
│       ├── ProductFilters.tsx
│       ├── ProductFiltersClient.tsx
│       └── ProductGallery.tsx
│
├── lib/                         # Utility libraries
│   ├── auth.ts                  # NextAuth configuration
│   └── prisma.ts                # Prisma client
│
├── prisma/                       # Database
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script
│
├── types/                        # TypeScript types
│   └── next-auth.d.ts          # NextAuth type definitions
│
├── middleware.ts                 # Next.js middleware
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # Main documentation
├── QUICKSTART.md                # Quick start guide
├── DEPLOYMENT.md                # Deployment guide
└── env.example                  # Environment variables example
```

## Key Files

### Configuration
- `next.config.js` - Next.js configuration (image domains, etc.)
- `tailwind.config.js` - Tailwind CSS theme and custom styles
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Dependencies and npm scripts

### Database
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Database seeding script
- `lib/prisma.ts` - Prisma client singleton

### Authentication
- `lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `middleware.ts` - Route protection middleware

### Styling
- `app/globals.css` - Global CSS with Tailwind directives
- Custom Tailwind classes defined in `tailwind.config.js`

### API Routes
- `/api/cart` - Shopping cart operations (GET, POST, PATCH, DELETE)
- `/api/checkout` - Stripe checkout session creation
- `/api/orders` - User order history
- `/api/products` - Product listing with filters
- `/api/webhooks/stripe` - Stripe webhook handler

## Component Hierarchy

```
RootLayout
├── Header
│   ├── Navigation (Categories)
│   ├── Search
│   ├── User Menu
│   └── Cart Icon
├── Main Content (pages)
└── Footer
    ├── Links
    ├── Newsletter
    └── Social Media
```

## Data Flow

1. **Products**: Database → API Route → Server Component → Client Component
2. **Cart**: Client Component → API Route → Database
3. **Checkout**: Client Form → API Route → Stripe → Webhook → Database
4. **Authentication**: Client Form → NextAuth → JWT → Session

## Environment Variables

See `env.example` for all required environment variables.
