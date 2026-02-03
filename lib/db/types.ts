export type Role = 'USER' | 'ADMIN'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface User {
  id: string
  email: string
  name?: string | null
  password?: string | null
  role: Role
  emailVerified?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  currency: string
  categoryId: string
  material?: string | null
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt?: string | null
  position: number
  createdAt: Date
}

export interface Variant {
  id: string
  productId: string
  name: string
  value: string
  createdAt: Date
}

export interface Inventory {
  id: string
  productId: string
  variantId?: string | null
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  total: number
  currency: string
  stripePaymentId?: string | null
  shippingAddressId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  variantId?: string | null
  createdAt: Date
}

export interface Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  street: string
  city: string
  state?: string | null
  zipCode: string
  country: string
  phone?: string | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  variantId?: string | null
  createdAt: Date
  updatedAt: Date
}
