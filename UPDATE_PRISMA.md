# Prisma Removal - File Updates Needed

The following files need to be updated to use the new file-based database system:

## Files to Update:

1. ✅ `lib/prisma.ts` - Updated to re-export db
2. ✅ `lib/auth.ts` - Updated
3. ✅ `app/page.tsx` - Updated
4. ⏳ `app/products/page.tsx` - Needs update
5. ⏳ `app/products/[slug]/page.tsx` - Needs update
6. ⏳ `app/category/[slug]/page.tsx` - Needs update
7. ⏳ `app/admin/page.tsx` - Needs update
8. ⏳ `app/admin/products/page.tsx` - Needs update
9. ⏳ `app/admin/orders/page.tsx` - Needs update
10. ⏳ `app/admin/categories/page.tsx` - Needs update
11. ⏳ `app/api/cart/route.ts` - Needs update
12. ⏳ `app/api/checkout/route.ts` - Needs update
13. ⏳ `app/api/orders/route.ts` - Needs update
14. ⏳ `app/api/auth/signup/route.ts` - Needs update
15. ⏳ `app/api/products/route.ts` - Needs update

## Migration Pattern:

**Old:**
```typescript
import { prisma } from '@/lib/prisma'
const products = await prisma.product.findMany({
  where: { featured: true },
  include: { images: true, category: true }
})
```

**New:**
```typescript
import { db } from '@/lib/db'
const products = await db.product.findMany({ featured: true })
const productsWithData = await Promise.all(
  products.map(async (p) => {
    const [images, category] = await Promise.all([
      db.productImage.findMany({ productId: p.id }),
      db.category.findUnique({ id: p.categoryId })
    ])
    return { ...p, images, category }
  })
)
```
