import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { SEED_PRODUCTS, SEED_REVIEWS } from './seed-data'
import type {
  Product,
  Order,
  OrderItem,
  Review,
  Subscriber,
  ProductSpec,
  ProductInput,
  CustomerSummary,
  AdminAnalytics,
  DatabaseStatus
} from './types'

export type {
  Product,
  Order,
  OrderItem,
  Review,
  Subscriber,
  ProductSpec,
  ProductInput,
  CustomerSummary,
  AdminAnalytics,
  DatabaseStatus
}
export { SEED_PRODUCTS, SEED_REVIEWS }

export interface StoreData {
  adminSessions?: AdminSession[]
  products: Product[]
  orders: Order[]
  reviews: Review[]
  subscribers: Subscriber[]
  lastOrderNumber: number
}

export interface CreateOrderInput {
  accessTokenHash?: string
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
}

export interface AdminSession {
  tokenHash: string
  keyHash: string
  expiresAt: number
}

export interface IDatabaseAdapter {
  createAdminSession(session: AdminSession): Promise<void>
  findAdminSession(tokenHash: string): Promise<AdminSession | null>
  revokeAdminSession(tokenHash: string): Promise<void>
  readonly engine: DatabaseStatus['engine']
  readonly isRemote: boolean
  getProducts(options?: { category?: string; query?: string; sort?: string }): Promise<Product[]>
  getProductById(id: string): Promise<Product | null>
  saveProduct(input: ProductInput): Promise<Product>
  deleteProduct(id: string): Promise<boolean>
  toggleProductStock(id: string): Promise<Product | null>
  getOrders(): Promise<Order[]>
  getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null>
  createOrder(input: CreateOrderInput): Promise<Order>
  updateOrderStatus(orderId: number, status: Order['orderStatus']): Promise<Order | null>
  getReviewsForProduct(productId: string): Promise<Review[]>
  addReview(input: {
    productId: string
    author: string
    rating: number
    title: string
    comment: string
    location?: string
  }): Promise<Review>
  getSubscribers(): Promise<Subscriber[]>
  addSubscriber(email: string): Promise<{ success: boolean; message: string }>
  getAdminAnalytics(): Promise<AdminAnalytics>
  getCustomerSummaries(): Promise<CustomerSummary[]>
  getDatabaseStatus(): Promise<DatabaseStatus>
  resetToSeed(): Promise<void>
}

// ---------------------------------------------------------------------------
// 1. Local Persistent Store Adapter (Zero-cost, Edge/Serverless Resilient)
// ---------------------------------------------------------------------------
class LocalJsonAdapter implements IDatabaseAdapter {
  readonly engine: DatabaseStatus['engine'] = 'local-persistent-json'
  readonly isRemote: boolean = false

  private dataDir: string
  private dbPath: string
  private cachedData: StoreData | null = null
  private cachedMtime = 0
  private isWritablePath = true

  constructor(skipLocal = false) {
    const primaryDir = process.env.ANORA_DATA_DIR || path.join(process.cwd(), '.anora-data')
    const primaryPath = path.join(primaryDir, 'anora-store.json')
    this.dataDir = primaryDir
    this.dbPath = primaryPath
    if (skipLocal) return

    // Check if process.cwd() is writable (on some serverless edge providers it is read-only)
    try {
      if (!fs.existsSync(/* turbopackIgnore: true */ primaryDir)) {
        fs.mkdirSync(primaryDir, { recursive: true })
      }
      this.dataDir = primaryDir
      this.dbPath = primaryPath
      const legacyPath = path.join(process.cwd(), 'data', 'anora-store.json')
      if (!fs.existsSync(primaryPath) && fs.existsSync(legacyPath)) {
        fs.copyFileSync(legacyPath, primaryPath)
      }
    } catch {
      if (process.env.NODE_ENV === 'production' || process.env.ANORA_DATA_DIR) {
        throw new Error('Configure a writable, durable ANORA_DATA_DIR for private store data.')
      }
      // Fallback to OS temp directory which is guaranteed writable on Vercel/AWS Lambda
      const fallbackDir = path.join(os.tmpdir(), 'anora-data')
      try {
        if (!fs.existsSync(fallbackDir)) {
          fs.mkdirSync(fallbackDir, { recursive: true })
        }
        this.dataDir = fallbackDir
        this.dbPath = path.join(fallbackDir, 'anora-store.json')
      } catch {
        this.dataDir = os.tmpdir()
        this.dbPath = path.join(os.tmpdir(), 'anora-store.json')
        this.isWritablePath = false
      }
    }
  }

  protected async loadStore(): Promise<StoreData> {
    if (fs.existsSync(this.dbPath)) {
      try {
        const stats = fs.statSync(this.dbPath)
        if (this.cachedData && this.cachedMtime === stats.mtimeMs) {
          return this.cachedData
        }
        const raw = fs.readFileSync(this.dbPath, 'utf-8')
        const parsed = JSON.parse(raw)
        this.cachedData = {
          adminSessions: Array.isArray(parsed.adminSessions) ? parsed.adminSessions : [],
          products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : SEED_PRODUCTS,
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          reviews: Array.isArray(parsed.reviews) && parsed.reviews.length > 0 ? parsed.reviews : SEED_REVIEWS,
          subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
          lastOrderNumber: typeof parsed.lastOrderNumber === 'number' ? parsed.lastOrderNumber : 1000
        }
        this.cachedMtime = stats.mtimeMs
        return this.cachedData
      } catch {
        this.cachedData = null
        throw new Error('Store data could not be read safely.')
      }
    }

    const initial: StoreData = {
      products: SEED_PRODUCTS,
      orders: [],
      reviews: SEED_REVIEWS,
      subscribers: [],
      lastOrderNumber: 1000
    }
    await this.saveStore(initial)
    this.cachedData = initial
    return initial
  }

  protected async saveStore(data: StoreData) {
    this.cachedData = data
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true })
      }
      const tempPath = path.join(this.dataDir, `anora-store.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`)
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8')
      try {
        fs.renameSync(tempPath, this.dbPath)
      } catch (err: any) {
        if (err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'EEXIST') {
          fs.copyFileSync(tempPath, this.dbPath)
          try {
            fs.unlinkSync(tempPath)
          } catch {}
        } else {
          throw err
        }
      }
      try {
        this.cachedMtime = fs.statSync(this.dbPath).mtimeMs
      } catch {}
    } catch (writeErr) {
      this.cachedData = null
      throw new Error('Store data could not be saved.')
    }
  }

  async getProducts(options?: { category?: string; query?: string; sort?: string }): Promise<Product[]> {
    const store = await this.loadStore()
    let list = [...store.products]

    if (options?.category && options.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase())
    }

    if (options?.query) {
      const q = options.query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colorName.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      )
    }

    if (options?.sort) {
      switch (options.sort) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          list.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          list.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        default:
          list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      }
    }

    return list
  }

  async getProductById(id: string): Promise<Product | null> {
    const store = await this.loadStore()
    const found = store.products.find((p) => p.id === id)
    return found || null
  }

  async saveProduct(input: ProductInput): Promise<Product> {
    const store = await this.loadStore()

    const defaultSpecs: ProductSpec = {
      dimensions: input.specs?.dimensions || '22 cm (W) × 17 cm (H) × 9 cm (D)',
      weight: input.specs?.weight || '480 grams',
      material: input.specs?.material || 'Full-Grain Pebbled Calfskin Leather',
      hardware: input.specs?.hardware || '18k Brushed Gold Brass',
      strapDrop: input.specs?.strapDrop || '52 cm (Adjustable)',
      capacity: input.specs?.capacity || 'Accordion interior with center zip divider',
      closure: input.specs?.closure || 'Mechanical Circular Twist-Lock',
      origin: input.specs?.origin || 'Bespoke Handcrafted Leather Atelier'
    }

    const defaultColors = input.availableColors && input.availableColors.length > 0
      ? input.availableColors
      : [{ name: input.colorName || 'Midnight Noir', hex: input.colorHex || '#181615', inStock: true }]

    const defaultFeatures = input.features && input.features.length > 0
      ? input.features
      : [
          'Handcrafted genuine full-grain calfskin leather',
          'Architectural brushed gold custom hardware',
          'Triple accordion compartments with security zip',
          '100% Cash On Delivery Nationwide',
          '7-Day Hassle-Free Doorstep Return Guarantee'
        ]

    const targetId = input.id?.trim() || `the-anora-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

    const existingIndex = store.products.findIndex((p) => p.id === targetId)

    const updatedProduct: Product = {
      id: targetId,
      name: input.name.trim(),
      tagline: input.tagline.trim() || 'Timeless Style, Modern You — Bags For Every You',
      price: Math.max(1, Math.round(Number(input.price) || 6990)),
      originalPrice: input.originalPrice ? Math.round(Number(input.originalPrice)) : null,
      currency: input.currency || 'Rs.',
      category: input.category || 'crossbody',
      colorName: input.colorName.trim() || 'Classic Noir',
      colorHex: input.colorHex.trim() || '#181615',
      availableColors: defaultColors,
      badge: input.badge ? input.badge.trim() : null,
      image: input.image.trim() || '/images/products/bordeaux-crossbody-hero.jpeg',
      images: input.images && input.images.length > 0 ? input.images : [input.image.trim() || '/images/products/bordeaux-crossbody-hero.jpeg'],
      description: input.description.trim(),
      story: input.story?.trim() || 'Handcrafted in our bespoke atelier with devotion to clean lines and sculptural minimalism.',
      features: defaultFeatures,
      specs: defaultSpecs,
      rating: input.rating !== undefined ? Number(input.rating) : (existingIndex >= 0 ? store.products[existingIndex].rating : 5.0),
      reviewCount: input.reviewCount !== undefined ? Number(input.reviewCount) : (existingIndex >= 0 ? store.products[existingIndex].reviewCount : 0),
      inStock: input.inStock !== undefined ? Boolean(input.inStock) : true,
      featured: input.featured !== undefined ? Boolean(input.featured) : false,
      isNew: input.isNew !== undefined ? Boolean(input.isNew) : true,
      supports3D: input.supports3D ?? (existingIndex >= 0 ? store.products[existingIndex].supports3D : undefined)
    }

    if (existingIndex >= 0) {
      store.products[existingIndex] = updatedProduct
    } else {
      store.products.unshift(updatedProduct)
    }

    await this.saveStore(store)
    return updatedProduct
  }

  async deleteProduct(id: string): Promise<boolean> {
    const store = await this.loadStore()
    const initialLen = store.products.length
    if (initialLen <= 1) {
      // Keep at least one signature bag to prevent store breaking
      return false
    }
    store.products = store.products.filter((p) => p.id !== id)
    if (store.products.length !== initialLen) {
      await this.saveStore(store)
      return true
    }
    return false
  }

  async toggleProductStock(id: string): Promise<Product | null> {
    const store = await this.loadStore()
    const product = store.products.find((p) => p.id === id)
    if (!product) return null
    product.inStock = !product.inStock
    await this.saveStore(store)
    return product
  }

  async getOrders(): Promise<Order[]> {
    const store = await this.loadStore()
    return [...store.orders]
  }

  async getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
    const store = await this.loadStore()
    const clean = idOrNumber.trim().toLowerCase()
    if (!clean) return null

    // Exact order number match (ANR-2026-1001)
    const byOrderNum = store.orders.find((o) => o.orderNumber.toLowerCase() === clean)
    if (byOrderNum) return byOrderNum

    // Lookup by numeric id
    const byId = store.orders.find((o) => String(o.id) === clean)
    if (byId) return byId

    return null
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const store = await this.loadStore()
    const newOrderSeq = (store.lastOrderNumber || 1000) + 1
    const year = new Date().getFullYear()
    const orderNumber = `ANR-${year}-${newOrderSeq}`

    const newOrder: Order = {
      accessTokenHash: input.accessTokenHash,
      id: newOrderSeq,
      orderNumber,
      customerName: input.customerName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      apartment: input.apartment?.trim(),
      city: input.city.trim(),
      postalCode: input.postalCode?.trim(),
      deliveryNotes: input.deliveryNotes?.trim(),
      items: input.items,
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      totalAmount: input.totalAmount,
      currency: 'Rs.',
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'Pending Cash on Delivery',
      orderStatus: 'Confirmed',
      refundWindowDays: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    store.orders.unshift(newOrder)
    store.lastOrderNumber = newOrderSeq
    await this.saveStore(store)

    return newOrder
  }

  async updateOrderStatus(orderId: number, status: Order['orderStatus']): Promise<Order | null> {
    const store = await this.loadStore()
    const idx = store.orders.findIndex((o) => o.id === orderId)
    if (idx === -1) return null

    store.orders[idx].orderStatus = status
    store.orders[idx].updatedAt = new Date().toISOString()
    if (status === 'Delivered') {
      store.orders[idx].paymentStatus = 'Paid Cash on Delivery'
    }
    await this.saveStore(store)
    return store.orders[idx]
  }

  async getReviewsForProduct(productId: string): Promise<Review[]> {
    const store = await this.loadStore()
    return store.reviews.filter((r) => r.productId === productId)
  }

  async addReview(input: {
    productId: string
    author: string
    rating: number
    title: string
    comment: string
    location?: string
  }): Promise<Review> {
    const store = await this.loadStore()
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: input.productId,
      author: input.author.trim(),
      rating: Math.max(1, Math.min(5, input.rating)),
      title: input.title.trim(),
      comment: input.comment.trim(),
      verified: true,
      location: input.location?.trim() || 'Verified Customer',
      createdAt: new Date().toISOString()
    }

    store.reviews.unshift(newReview)
    await this.saveStore(store)
    return newReview
  }

  async getSubscribers(): Promise<Subscriber[]> {
    const store = await this.loadStore()
    return [...store.subscribers]
  }

  async addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
    const store = await this.loadStore()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' }
    }

    const existing = store.subscribers.find((s) => s.email.toLowerCase() === cleanEmail)
    if (existing) {
      return { success: true, message: 'You are already subscribed to Anora Bags updates!' }
    }

    store.subscribers.push({
      id: store.subscribers.length + 1,
      email: cleanEmail,
      createdAt: new Date().toISOString()
    })
    await this.saveStore(store)
    return { success: true, message: "Welcome to the Anora Club. You'll receive early access to new bag releases!" }
  }

  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const store = await this.loadStore()
    const orders = store.orders

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0)
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length
    const dispatchedOrders = orders.filter((o) => o.orderStatus === 'Dispatched' || o.orderStatus === 'Out for Delivery').length
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length
    const deliveredCashCollected = orders
      .filter((o) => o.orderStatus === 'Delivered')
      .reduce((acc, o) => acc + o.totalAmount, 0)
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    // Group by city
    const cityMap = new Map<string, { count: number; total: number }>()
    for (const ord of orders) {
      const city = ord.city || 'Unknown'
      const cur = cityMap.get(city) || { count: 0, total: 0 }
      cityMap.set(city, { count: cur.count + 1, total: cur.total + ord.totalAmount })
    }

    const topCities = Array.from(cityMap.entries())
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      dispatchedOrders,
      deliveredOrders,
      deliveredCashCollected,
      cancelledOrders,
      averageOrderValue,
      topCities,
      subscribersCount: store.subscribers.length,
      totalProductsCount: store.products.length,
      outOfStockCount: store.products.filter((p) => !p.inStock).length
    }
  }

  async getCustomerSummaries(): Promise<CustomerSummary[]> {
    const store = await this.loadStore()
    const map = new Map<string, CustomerSummary>()

    for (const order of store.orders) {
      const key = order.phone.replace(/[^0-9]/g, '') || order.email.toLowerCase()
      if (!key) continue

      const existing = map.get(key)
      if (existing) {
        existing.orderCount += 1
        existing.totalSpent += order.totalAmount
        if (new Date(order.createdAt) > new Date(existing.latestOrderDate)) {
          existing.latestOrderDate = order.createdAt
          existing.name = order.customerName
          existing.city = order.city
        }
      } else {
        map.set(key, {
          name: order.customerName,
          phone: order.phone,
          email: order.email,
          city: order.city,
          orderCount: 1,
          totalSpent: order.totalAmount,
          latestOrderDate: order.createdAt
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  }

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    const store = await this.loadStore()
    return {
      engine: this.engine,
      isRemote: this.isRemote,
      isWritable: this.isWritablePath,
      storagePath: this.dbPath,
      counts: {
        products: store.products.length,
        orders: store.orders.length,
        reviews: store.reviews.length,
        subscribers: store.subscribers.length
      }
    }
  }

  async createAdminSession(session: AdminSession): Promise<void> {
    const store = await this.loadStore()
    store.adminSessions = [...(store.adminSessions || []).filter(item => item.expiresAt > Date.now()), session]
    await this.saveStore(store)
  }

  async findAdminSession(tokenHash: string): Promise<AdminSession | null> {
    return (await this.loadStore()).adminSessions?.find(item => item.tokenHash === tokenHash && item.expiresAt > Date.now()) || null
  }

  async revokeAdminSession(tokenHash: string): Promise<void> {
    const store = await this.loadStore()
    store.adminSessions = (store.adminSessions || []).filter(item => item.tokenHash !== tokenHash && item.expiresAt > Date.now())
    await this.saveStore(store)
  }

  async resetToSeed(): Promise<void> {
    const initial: StoreData = {
      products: SEED_PRODUCTS,
      orders: [],
      reviews: SEED_REVIEWS,
      subscribers: [],
      lastOrderNumber: 1000
    }
    await this.saveStore(initial)
  }
}

// ---------------------------------------------------------------------------
// 2. Serverless Edge PostgreSQL Adapter (Neon / Supabase 1-Click Ready)
// ---------------------------------------------------------------------------
class ServerlessPostgresAdapter extends LocalJsonAdapter {
  private sessionTableInitialized = false

  private async ensureSessionTable() {
    if (this.sessionTableInitialized) return
    await this.executeQuery("CREATE TABLE IF NOT EXISTS anora_admin_sessions (token_hash VARCHAR(64) PRIMARY KEY, key_hash VARCHAR(64) NOT NULL, expires_at BIGINT NOT NULL);")
    this.sessionTableInitialized = true
  }

  override async createAdminSession(session: AdminSession) {
    await this.ensureSessionTable()
    await this.executeQuery("DELETE FROM anora_admin_sessions WHERE expires_at <= $1;", [Date.now()])
    await this.executeQuery("INSERT INTO anora_admin_sessions (token_hash, key_hash, expires_at) VALUES ($1, $2, $3);", [session.tokenHash, session.keyHash, session.expiresAt])
  }

  override async findAdminSession(tokenHash: string): Promise<AdminSession | null> {
    await this.ensureSessionTable()
    const rows = await this.executeQuery("SELECT token_hash, key_hash, expires_at FROM anora_admin_sessions WHERE token_hash = $1 AND expires_at > $2 LIMIT 1;", [tokenHash, Date.now()])
    const row = rows[0]
    return row ? { tokenHash: row.token_hash, keyHash: row.key_hash, expiresAt: Number(row.expires_at) } : null
  }

  override async revokeAdminSession(tokenHash: string) {
    await this.ensureSessionTable()
    await this.executeQuery("DELETE FROM anora_admin_sessions WHERE token_hash = $1;", [tokenHash])
  }
  override readonly engine: DatabaseStatus['engine'] = 'serverless-postgres'
  override readonly isRemote = true

  private connectionUrl: string
  private host = ''
  private password = ''
  private isTableInitialized = false

  constructor(connectionUrl: string) {
    super(true)
    this.connectionUrl = connectionUrl
    try {
      const url = new URL(connectionUrl)
      this.host = url.hostname
      this.password = decodeURIComponent(url.password)
    } catch (e) {
      console.warn('[Anora DB] Notice: Could not parse database URL host/password:', e)
    }
  }

  private async executeQuery(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.host || !this.password) {
      throw new Error('Incomplete PostgreSQL connection credentials.')
    }
    const endpoint = `https://${this.host}/sql`
    const res = await fetch(endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        'Authorization': `Bearer ${this.password}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql, params })
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Serverless Postgres query failed (${res.status}): ${errText}`)
    }

    const data = await res.json()
    return Array.isArray(data) ? data : (data.rows || [])
  }

  private async ensureTable(): Promise<void> {
    if (this.isTableInitialized) return
    await this.executeQuery(`
      CREATE TABLE IF NOT EXISTS anora_store (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    this.isTableInitialized = true
  }

  private async fetchRemoteStore(): Promise<StoreData> {
    await this.ensureTable()
    const rows = await this.executeQuery(`SELECT data FROM anora_store WHERE key = 'store' LIMIT 1;`)
    if (rows.length > 0 && rows[0].data) {
      const remote = rows[0].data as StoreData
      return {
        products: Array.isArray(remote.products) && remote.products.length > 0 ? remote.products : SEED_PRODUCTS,
        orders: Array.isArray(remote.orders) ? remote.orders : [],
        reviews: Array.isArray(remote.reviews) && remote.reviews.length > 0 ? remote.reviews : SEED_REVIEWS,
        subscribers: Array.isArray(remote.subscribers) ? remote.subscribers : [],
        lastOrderNumber: typeof remote.lastOrderNumber === 'number' ? remote.lastOrderNumber : 1000
      }
    }

    const initial: StoreData = {
      products: SEED_PRODUCTS,
      orders: [],
      reviews: SEED_REVIEWS,
      subscribers: [],
      lastOrderNumber: 1000
    }
    await this.persistRemoteStore(initial)
    return initial
  }

  private async persistRemoteStore(data: StoreData): Promise<void> {
    await this.ensureTable()
    await this.executeQuery(
      `INSERT INTO anora_store (key, data, updated_at)
       VALUES ('store', $1::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();`,
      [JSON.stringify(data)]
    )
  }

  // All catalog/order/customer methods use the same authoritative store boundary.
  // Remote failures must never read from or write to a different local database.
  protected override async loadStore(): Promise<StoreData> {
    return this.fetchRemoteStore()
  }

  protected override async saveStore(data: StoreData): Promise<void> {
    await this.persistRemoteStore(data)
  }

  override async getDatabaseStatus(): Promise<DatabaseStatus> {
    const store = await this.fetchRemoteStore()
    return {
      engine: this.engine, isRemote: true, isWritable: true,
      storagePath: this.connectionUrl.replace(/:([^:@]+)@/, ':***@'),
      counts: { products: store.products.length, orders: store.orders.length, reviews: store.reviews.length, subscribers: store.subscribers.length },
    }
  }

}

// ---------------------------------------------------------------------------
// 3. Adapter Factory: Selects engine based on environment configuration
// ---------------------------------------------------------------------------
function createActiveAdapter(): IDatabaseAdapter {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_URL
  if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
    return new ServerlessPostgresAdapter(dbUrl)
  }
  return new LocalJsonAdapter()
}

const activeAdapter: IDatabaseAdapter = createActiveAdapter()

export const createAdminSession = (session: AdminSession) => activeAdapter.createAdminSession(session)
export const findAdminSession = (tokenHash: string) => activeAdapter.findAdminSession(tokenHash)
export const revokeAdminSession = (tokenHash: string) => activeAdapter.revokeAdminSession(tokenHash)

// ---------------------------------------------------------------------------
// 4. Public Database API (Universal Module Exports)
// ---------------------------------------------------------------------------
export async function getProducts(options?: {
  category?: string
  query?: string
  sort?: string
}): Promise<Product[]> {
  return activeAdapter.getProducts(options)
}

export async function getProductById(id: string): Promise<Product | null> {
  return activeAdapter.getProductById(id)
}

export async function saveProduct(input: ProductInput): Promise<Product> {
  return activeAdapter.saveProduct(input)
}

export async function deleteProduct(id: string): Promise<boolean> {
  return activeAdapter.deleteProduct(id)
}

export async function toggleProductStock(id: string): Promise<Product | null> {
  return activeAdapter.toggleProductStock(id)
}

export async function getOrders(): Promise<Order[]> {
  return activeAdapter.getOrders()
}

export async function getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
  return activeAdapter.getOrderByIdOrNumber(idOrNumber)
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return activeAdapter.createOrder(input)
}

export async function updateOrderStatus(
  orderId: number,
  status: Order['orderStatus']
): Promise<Order | null> {
  return activeAdapter.updateOrderStatus(orderId, status)
}

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  return activeAdapter.getReviewsForProduct(productId)
}

export async function addReview(input: {
  productId: string
  author: string
  rating: number
  title: string
  comment: string
  location?: string
}): Promise<Review> {
  return activeAdapter.addReview(input)
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return activeAdapter.getSubscribers()
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  return activeAdapter.addSubscriber(email)
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  return activeAdapter.getAdminAnalytics()
}

export async function getCustomerSummaries(): Promise<CustomerSummary[]> {
  return activeAdapter.getCustomerSummaries()
}

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  return activeAdapter.getDatabaseStatus()
}

export async function resetDatabaseToSeed(): Promise<void> {
  return activeAdapter.resetToSeed()
}
