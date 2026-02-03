import fs from 'fs'
import path from 'path'
import type {
  User,
  Product,
  Category,
  ProductImage,
  Variant,
  Inventory,
  Order,
  OrderItem,
  Address,
  CartItem,
} from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

const getFilePath = (filename: string) => path.join(DATA_DIR, filename)

// Simple file-based database
class Database {
  private readFile<T>(filename: string): T[] {
    ensureDataDir()
    const filePath = getFilePath(filename)
    if (!fs.existsSync(filePath)) {
      return []
    }
    try {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  private writeFile<T>(filename: string, data: T[]): void {
    ensureDataDir()
    const filePath = getFilePath(filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  // Users
  users = {
    findMany: async (where?: any): Promise<User[]> => {
      let users = this.readFile<User>('users.json')
      if (where?.email) {
        users = users.filter((u) => u.email === where.email)
      }
      if (where?.id) {
        users = users.filter((u) => u.id === where.id)
      }
      return users
    },
    findUnique: async (where: { email?: string; id?: string }): Promise<User | null> => {
      const users = this.readFile<User>('users.json')
      if (where.email) {
        return users.find((u) => u.email === where.email) || null
      }
      if (where.id) {
        return users.find((u) => u.id === where.id) || null
      }
      return null
    },
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const users = this.readFile<User>('users.json')
      const user: User = {
        ...data,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(user)
      this.writeFile('users.json', users)
      return user
    },
    update: async (where: { id: string }, data: Partial<User>): Promise<User> => {
      const users = this.readFile<User>('users.json')
      const index = users.findIndex((u) => u.id === where.id)
      if (index === -1) throw new Error('User not found')
      users[index] = { ...users[index], ...data, updatedAt: new Date() }
      this.writeFile('users.json', users)
      return users[index]
    },
    delete: async (where: { id: string }): Promise<void> => {
      const users = this.readFile<User>('users.json')
      const filtered = users.filter((u) => u.id !== where.id)
      this.writeFile('users.json', filtered)
    },
  }

  // Categories
  category = {
    findMany: async (where?: any): Promise<Category[]> => {
      let categories = this.readFile<Category>('categories.json')
      if (where?.slug) {
        categories = categories.filter((c) => c.slug === where.slug)
      }
      if (where?.parentId !== undefined) {
        if (where.parentId === null) {
          categories = categories.filter((c) => !c.parentId)
        } else {
          categories = categories.filter((c) => c.parentId === where.parentId)
        }
      }
      return categories
    },
    findUnique: async (where: { slug?: string; id?: string }): Promise<Category | null> => {
      const categories = this.readFile<Category>('categories.json')
      if (where.slug) {
        return categories.find((c) => c.slug === where.slug) || null
      }
      if (where.id) {
        return categories.find((c) => c.id === where.id) || null
      }
      return null
    },
    create: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
      const categories = this.readFile<Category>('categories.json')
      const category: Category = {
        ...data,
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      categories.push(category)
      this.writeFile('categories.json', categories)
      return category
    },
    upsert: async (args: {
      where: { slug: string }
      update: Partial<Category>
      create: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
    }): Promise<Category> => {
      const categories = this.readFile<Category>('categories.json')
      const index = categories.findIndex((c) => c.slug === args.where.slug)
      if (index !== -1) {
        categories[index] = { ...categories[index], ...args.update, updatedAt: new Date() }
        this.writeFile('categories.json', categories)
        return categories[index]
      }
      return this.category.create(args.create)
    },
    update: async (where: { id: string }, data: Partial<Category>): Promise<Category> => {
      const categories = this.readFile<Category>('categories.json')
      const index = categories.findIndex((c) => c.id === where.id)
      if (index === -1) throw new Error('Category not found')
      categories[index] = { ...categories[index], ...data, updatedAt: new Date() }
      this.writeFile('categories.json', categories)
      return categories[index]
    },
  }

  // Products
  product = {
    findMany: async (where?: any, options?: any): Promise<Product[]> => {
      let products = this.readFile<Product>('products.json')
      if (where) {
        if (where.categoryId) {
          products = products.filter((p) => p.categoryId === where.categoryId)
        }
        if (where.featured !== undefined) {
          products = products.filter((p) => p.featured === where.featured)
        }
        if (where.id?.not) {
          products = products.filter((p) => p.id !== where.id.not)
        }
        if (where.price) {
          if (where.price.gte) {
            products = products.filter((p) => p.price >= where.price.gte)
          }
          if (where.price.lte) {
            products = products.filter((p) => p.price <= where.price.lte)
          }
        }
      }
      if (options?.orderBy) {
        const [key, direction] = Object.entries(options.orderBy)[0]
        products.sort((a, b) => {
          const aVal = (a as any)[key]
          const bVal = (b as any)[key]
          if (direction === 'asc') return aVal > bVal ? 1 : -1
          return aVal < bVal ? 1 : -1
        })
      }
      if (options?.skip) {
        products = products.slice(options.skip)
      }
      if (options?.take) {
        products = products.slice(0, options.take)
      }
      return products
    },
    findUnique: async (where: { slug?: string; id?: string }): Promise<Product | null> => {
      const products = this.readFile<Product>('products.json')
      if (where.slug) {
        return products.find((p) => p.slug === where.slug) || null
      }
      if (where.id) {
        return products.find((p) => p.id === where.id) || null
      }
      return null
    },
    create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
      const products = this.readFile<Product>('products.json')
      const product: Product = {
        ...data,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      products.push(product)
      this.writeFile('products.json', products)
      return product
    },
    update: async (where: { id: string }, data: Partial<Product>): Promise<Product> => {
      const products = this.readFile<Product>('products.json')
      const index = products.findIndex((p) => p.id === where.id)
      if (index === -1) throw new Error('Product not found')
      products[index] = { ...products[index], ...data, updatedAt: new Date() }
      this.writeFile('products.json', products)
      return products[index]
    },
    delete: async (where: { id: string }): Promise<void> => {
      const products = this.readFile<Product>('products.json')
      const filtered = products.filter((p) => p.id !== where.id)
      this.writeFile('products.json', filtered)
    },
    count: async (where?: any): Promise<number> => {
      const products = await this.product.findMany(where || {})
      return products.length
    },
  }

  // Product Images
  productImage = {
    findMany: async (where?: any, options?: any): Promise<ProductImage[]> => {
      let images = this.readFile<ProductImage>('productImages.json')
      if (where?.productId) {
        images = images.filter((img) => img.productId === where.productId)
      }
      if (options?.orderBy) {
        const [key, direction] = Object.entries(options.orderBy)[0]
        images.sort((a, b) => {
          const aVal = (a as any)[key]
          const bVal = (b as any)[key]
          if (direction === 'asc') return aVal > bVal ? 1 : -1
          return aVal < bVal ? 1 : -1
        })
      }
      if (options?.take) {
        images = images.slice(0, options.take)
      }
      return images
    },
    create: async (data: Omit<ProductImage, 'id' | 'createdAt'>): Promise<ProductImage> => {
      const images = this.readFile<ProductImage>('productImages.json')
      const image: ProductImage = {
        ...data,
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      }
      images.push(image)
      this.writeFile('productImages.json', images)
      return image
    },
    createMany: async (data: Omit<ProductImage, 'id' | 'createdAt'>[]): Promise<void> => {
      const images = this.readFile<ProductImage>('productImages.json')
      data.forEach((img) => {
        images.push({
          ...img,
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        })
      })
      this.writeFile('productImages.json', images)
    },
  }

  // Variants
  variant = {
    findMany: async (where?: any): Promise<Variant[]> => {
      let variants = this.readFile<Variant>('variants.json')
      if (where?.productId) {
        variants = variants.filter((v) => v.productId === where.productId)
      }
      if (where?.name) {
        variants = variants.filter((v) => v.name === where.name)
      }
      if (where?.value) {
        variants = variants.filter((v) => v.value === where.value)
      }
      return variants
    },
    findFirst: async (where?: any): Promise<Variant | null> => {
      const variants = await this.variant.findMany(where)
      return variants[0] || null
    },
    create: async (data: Omit<Variant, 'id' | 'createdAt'>): Promise<Variant> => {
      const variants = this.readFile<Variant>('variants.json')
      const variant: Variant = {
        ...data,
        id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      }
      variants.push(variant)
      this.writeFile('variants.json', variants)
      return variant
    },
  }

  // Inventory
  inventory = {
    findMany: async (where?: any): Promise<Inventory[]> => {
      let inventory = this.readFile<Inventory>('inventory.json')
      if (where?.productId) {
        inventory = inventory.filter((inv) => inv.productId === where.productId)
      }
      if (where?.variantId !== undefined) {
        inventory = inventory.filter((inv) => inv.variantId === where.variantId)
      }
      return inventory
    },
    create: async (data: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inventory> => {
      const inventory = this.readFile<Inventory>('inventory.json')
      const item: Inventory = {
        ...data,
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      inventory.push(item)
      this.writeFile('inventory.json', inventory)
      return item
    },
  }

  // Orders
  order = {
    findMany: async (where?: any, options?: any): Promise<Order[]> => {
      let orders = this.readFile<Order>('orders.json')
      if (where?.userId) {
        orders = orders.filter((o) => o.userId === where.userId)
      }
      if (where?.status) {
        if (where.status.not) {
          orders = orders.filter((o) => o.status !== where.status.not)
        } else {
          orders = orders.filter((o) => o.status === where.status)
        }
      }
      if (options?.orderBy) {
        const [key, direction] = Object.entries(options.orderBy)[0]
        orders.sort((a, b) => {
          const aVal = (a as any)[key]
          const bVal = (b as any)[key]
          if (direction === 'asc') return aVal > bVal ? 1 : -1
          return aVal < bVal ? 1 : -1
        })
      }
      if (options?.take) {
        orders = orders.slice(0, options.take)
      }
      return orders
    },
    findUnique: async (where: { id: string }): Promise<Order | null> => {
      const orders = this.readFile<Order>('orders.json')
      return orders.find((o) => o.id === where.id) || null
    },
    create: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
      const orders = this.readFile<Order>('orders.json')
      const order: Order = {
        ...data,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      orders.push(order)
      this.writeFile('orders.json', orders)
      return order
    },
    updateMany: async (where: any, data: Partial<Order>): Promise<number> => {
      const orders = this.readFile<Order>('orders.json')
      let count = 0
      orders.forEach((order) => {
        if (where.stripePaymentId && order.stripePaymentId === where.stripePaymentId) {
          Object.assign(order, data, { updatedAt: new Date() })
          count++
        }
      })
      if (count > 0) {
        this.writeFile('orders.json', orders)
      }
      return count
    },
    update: async (where: { id: string }, data: Partial<Order>): Promise<Order> => {
      const orders = this.readFile<Order>('orders.json')
      const index = orders.findIndex((o) => o.id === where.id)
      if (index === -1) throw new Error('Order not found')
      orders[index] = { ...orders[index], ...data, updatedAt: new Date() }
      this.writeFile('orders.json', orders)
      return orders[index]
    },
    aggregate: async (args: { _sum: { total: true }; where?: any }): Promise<{ _sum: { total: number | null } }> => {
      let orders = this.readFile<Order>('orders.json')
      if (args.where?.status?.not) {
        orders = orders.filter((o) => o.status !== args.where.status.not)
      }
      const total = orders.reduce((sum, o) => sum + o.total, 0)
      return { _sum: { total } }
    },
    count: async (where?: any): Promise<number> => {
      const orders = await this.order.findMany(where)
      return orders.length
    },
  }

  // Order Items
  orderItem = {
    findMany: async (where?: any): Promise<OrderItem[]> => {
      let items = this.readFile<OrderItem>('orderItems.json')
      if (where?.orderId) {
        items = items.filter((item) => item.orderId === where.orderId)
      }
      if (where?.productId) {
        items = items.filter((item) => item.productId === where.productId)
      }
      return items
    },
    create: async (data: Omit<OrderItem, 'id' | 'createdAt'>): Promise<OrderItem> => {
      const items = this.readFile<OrderItem>('orderItems.json')
      const item: OrderItem = {
        ...data,
        id: `oi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      }
      items.push(item)
      this.writeFile('orderItems.json', items)
      return item
    },
  }

  // Addresses
  address = {
    findMany: async (where?: any): Promise<Address[]> => {
      let addresses = this.readFile<Address>('addresses.json')
      if (where?.userId) {
        addresses = addresses.filter((a) => a.userId === where.userId)
      }
      return addresses
    },
    findUnique: async (where: { id: string }): Promise<Address | null> => {
      const addresses = this.readFile<Address>('addresses.json')
      return addresses.find((a) => a.id === where.id) || null
    },
    create: async (data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
      const addresses = this.readFile<Address>('addresses.json')
      const address: Address = {
        ...data,
        id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addresses.push(address)
      this.writeFile('addresses.json', addresses)
      return address
    },
    update: async (where: { id: string }, data: Partial<Address>): Promise<Address> => {
      const addresses = this.readFile<Address>('addresses.json')
      const index = addresses.findIndex((a) => a.id === where.id)
      if (index === -1) throw new Error('Address not found')
      addresses[index] = { ...addresses[index], ...data, updatedAt: new Date() }
      this.writeFile('addresses.json', addresses)
      return addresses[index]
    },
    delete: async (where: { id: string }): Promise<void> => {
      const addresses = this.readFile<Address>('addresses.json')
      const filtered = addresses.filter((a) => a.id !== where.id)
      this.writeFile('addresses.json', filtered)
    },
  }

  // Cart Items
  cartItem = {
    findMany: async (where?: any): Promise<CartItem[]> => {
      let items = this.readFile<CartItem>('cartItems.json')
      if (where?.userId) {
        items = items.filter((item) => item.userId === where.userId)
      }
      return items
    },
    findUnique: async (where: {
      userId_productId_variantId: { userId: string; productId: string; variantId: string | null }
    }): Promise<CartItem | null> => {
      const items = this.readFile<CartItem>('cartItems.json')
      return (
        items.find(
          (item) =>
            item.userId === where.userId_productId_variantId.userId &&
            item.productId === where.userId_productId_variantId.productId &&
            item.variantId === where.userId_productId_variantId.variantId
        ) || null
      )
    },
    findFirst: async (where: any): Promise<CartItem | null> => {
      const items = await this.cartItem.findMany(where)
      return items[0] || null
    },
    create: async (data: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CartItem> => {
      const items = this.readFile<CartItem>('cartItems.json')
      const item: CartItem = {
        ...data,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      items.push(item)
      this.writeFile('cartItems.json', items)
      return item
    },
    update: async (where: { id: string }, data: Partial<CartItem>): Promise<CartItem> => {
      const items = this.readFile<CartItem>('cartItems.json')
      const index = items.findIndex((item) => item.id === where.id)
      if (index === -1) throw new Error('Cart item not found')
      items[index] = { ...items[index], ...data, updatedAt: new Date() }
      this.writeFile('cartItems.json', items)
      return items[index]
    },
    delete: async (where: { id: string }): Promise<void> => {
      const items = this.readFile<CartItem>('cartItems.json')
      const filtered = items.filter((item) => item.id !== where.id)
      this.writeFile('cartItems.json', filtered)
    },
    deleteMany: async (where: any): Promise<number> => {
      const items = this.readFile<CartItem>('cartItems.json')
      const beforeCount = items.length
      const filtered = items.filter((item) => {
        if (where.userId) {
          return item.userId !== where.userId
        }
        return true
      })
      this.writeFile('cartItems.json', filtered)
      return beforeCount - filtered.length
    },
  }
}

export const db = new Database()
