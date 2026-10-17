export interface ProductSpec {
  dimensions: string
  weight: string
  material: string
  hardware: string
  strapDrop: string
  capacity: string
  closure: string
  origin: string
}

export interface ProductColor {
  name: string
  hex: string
  inStock: boolean
  image?: string
  images?: string[]
}

export interface Product {
  id: string
  name: string
  tagline: string
  price: number
  originalPrice: number | null
  currency: string
  category: 'crossbody' | 'satchel' | 'top-handle' | 'tote' | 'shoulder'
  colorName: string
  colorHex: string
  availableColors: ProductColor[]
  badge: string | null
  image: string
  images: string[]
  description: string
  story: string
  features: string[]
  specs: ProductSpec
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  isNew: boolean
  supports3D?: boolean
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  color: string
  image: string
}

export interface Order {
  accessTokenHash?: string
  id: number
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  postalCode?: string
  deliveryNotes?: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  totalAmount: number
  currency: string
  paymentMethod: 'CASH_ON_DELIVERY'
  paymentStatus: 'Pending Cash on Delivery' | 'Paid Cash on Delivery'
  orderStatus: 'Confirmed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
  refundWindowDays: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  comment: string
  verified: boolean
  location: string
  createdAt: string
}

export interface Subscriber {
  id: number
  email: string
  createdAt: string
}

export interface ProductInput {
  id?: string
  name: string
  tagline: string
  price: number
  originalPrice?: number | null
  currency?: string
  category: 'crossbody' | 'satchel' | 'top-handle' | 'tote' | 'shoulder'
  colorName: string
  colorHex: string
  availableColors?: ProductColor[]
  badge?: string | null
  image: string
  images?: string[]
  description: string
  story?: string
  features?: string[]
  specs?: Partial<ProductSpec>
  rating?: number
  reviewCount?: number
  inStock?: boolean
  featured?: boolean
  isNew?: boolean
  supports3D?: boolean
}

export interface CustomerSummary {
  name: string
  phone: string
  email: string
  city: string
  orderCount: number
  totalSpent: number
  latestOrderDate: string
}

export interface AdminAnalytics {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  dispatchedOrders: number
  deliveredOrders: number
  deliveredCashCollected: number
  cancelledOrders: number
  averageOrderValue: number
  topCities: { city: string; count: number; total: number }[]
  subscribersCount: number
  totalProductsCount: number
  outOfStockCount: number
}

export interface DatabaseStatus {
  engine: 'local-persistent-json' | 'serverless-postgres' | 'turso-edge' | 'memory-ephemeral'
  isRemote: boolean
  isWritable: boolean
  storagePath: string
  counts: {
    products: number
    orders: number
    reviews: number
    subscribers: number
  }
}

