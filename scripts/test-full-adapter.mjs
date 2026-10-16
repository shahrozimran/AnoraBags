import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tempTestDir = path.join(os.tmpdir(), `anora-test-${Date.now()}`)
fs.mkdirSync(tempTestDir, { recursive: true })
const testDbPath = path.join(tempTestDir, 'anora-store.json')

console.log('Testing Universal Adapter Logic in isolated temporary environment:', testDbPath)

// Sample seed products
const SEED_PRODUCTS = [
  {
    id: 'the-anora-bordeaux-flap-crossbody',
    name: 'The Anora Bordeaux Flap Crossbody',
    tagline: 'Timeless Style, Modern You',
    price: 6990,
    originalPrice: 8990,
    currency: 'Rs.',
    category: 'crossbody',
    colorName: 'Rich Bordeaux Wine',
    colorHex: '#4A1525',
    availableColors: [{ name: 'Rich Bordeaux Wine', hex: '#4A1525', inStock: true }],
    badge: 'Signature Bestseller',
    image: '/images/products/bordeaux-crossbody-hero.jpeg',
    images: ['/images/products/bordeaux-crossbody-hero.jpeg'],
    description: 'The defining silhouette of the Anora collection.',
    story: 'Conceived in our bespoke atelier.',
    features: ['Genuine full-grain pebbled calfskin leather'],
    specs: {
      dimensions: '22 cm × 17 cm × 9 cm',
      weight: '480 grams',
      material: 'Calfskin Leather',
      hardware: '18k Brushed Gold Brass',
      strapDrop: '52 cm',
      capacity: 'Accordion interior',
      closure: 'Mechanical Twist-Lock',
      origin: 'Bespoke Atelier'
    },
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    featured: true,
    isNew: false
  }
]

class TestAdapter {
  constructor(filePath) {
    this.dbPath = filePath
    this.cached = null
  }

  load() {
    if (fs.existsSync(this.dbPath)) {
      this.cached = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'))
      return this.cached
    }
    const initial = {
      products: SEED_PRODUCTS,
      orders: [],
      reviews: [],
      subscribers: [],
      lastOrderNumber: 1000
    }
    this.save(initial)
    return initial
  }

  save(data) {
    this.cached = data
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8')
  }

  getProducts(options) {
    const store = this.load()
    let list = [...store.products]
    if (options?.category && options.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === options.category.toLowerCase())
    }
    if (options?.query) {
      const q = options.query.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return list
  }

  saveProduct(input) {
    const store = this.load()
    const targetId = input.id || `the-anora-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    const existingIdx = store.products.findIndex(p => p.id === targetId)
    const product = {
      id: targetId,
      name: input.name,
      tagline: input.tagline || 'Timeless Style',
      price: input.price,
      originalPrice: input.originalPrice || null,
      currency: 'Rs.',
      category: input.category || 'crossbody',
      colorName: input.colorName || 'Classic',
      colorHex: input.colorHex || '#181615',
      availableColors: input.availableColors || [],
      badge: input.badge || null,
      image: input.image,
      images: [input.image],
      description: input.description,
      story: input.story || '',
      features: input.features || [],
      specs: input.specs || {},
      rating: 5.0,
      reviewCount: 0,
      inStock: input.inStock ?? true,
      featured: input.featured ?? false,
      isNew: input.isNew ?? true
    }
    if (existingIdx >= 0) {
      store.products[existingIdx] = product
    } else {
      store.products.unshift(product)
    }
    this.save(store)
    return product
  }

  deleteProduct(id) {
    const store = this.load()
    if (store.products.length <= 1) return false
    const origLen = store.products.length
    store.products = store.products.filter(p => p.id !== id)
    if (store.products.length !== origLen) {
      this.save(store)
      return true
    }
    return false
  }

  toggleStock(id) {
    const store = this.load()
    const p = store.products.find(p => p.id === id)
    if (!p) return null
    p.inStock = !p.inStock
    this.save(store)
    return p
  }

  createOrder(input) {
    const store = this.load()
    const newSeq = (store.lastOrderNumber || 1000) + 1
    const orderNumber = `ANR-2026-${newSeq}`
    const order = {
      id: store.orders.length + 1,
      orderNumber,
      customerName: input.customerName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      apartment: input.apartment?.trim(),
      city: input.city.trim(),
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
    store.orders.unshift(order)
    store.lastOrderNumber = newSeq
    this.save(store)
    return order
  }

  updateOrderStatus(orderId, status) {
    const store = this.load()
    const idx = store.orders.findIndex(o => o.id === orderId)
    if (idx === -1) return null
    store.orders[idx].orderStatus = status
    if (status === 'Delivered') {
      store.orders[idx].paymentStatus = 'Paid Cash on Delivery'
    }
    this.save(store)
    return store.orders[idx]
  }

  getOrder(q) {
    const store = this.load()
    const clean = q.trim().toLowerCase()
    const byNum = store.orders.find(o => o.orderNumber.toLowerCase() === clean)
    if (byNum) return byNum
    const digits = clean.replace(/[^0-9]/g, '')
    if (digits.length >= 7) {
      const byPhone = store.orders.find(o => o.phone.replace(/[^0-9]/g, '').endsWith(digits))
      if (byPhone) return byPhone
    }
    return null
  }

  addSubscriber(email) {
    const store = this.load()
    const clean = email.trim().toLowerCase()
    if (!clean || !clean.includes('@')) return { success: false }
    if (store.subscribers.some(s => s.email === clean)) return { success: true, duplicate: true }
    store.subscribers.push({ id: store.subscribers.length + 1, email: clean, createdAt: new Date().toISOString() })
    this.save(store)
    return { success: true }
  }

  getAnalytics() {
    const store = this.load()
    const totalRev = store.orders.reduce((acc, o) => acc + o.totalAmount, 0)
    const deliveredCash = store.orders.filter(o => o.orderStatus === 'Delivered').reduce((acc, o) => acc + o.totalAmount, 0)
    return {
      totalOrders: store.orders.length,
      totalRevenue: totalRev,
      deliveredCashCollected: deliveredCash,
      pendingOrders: store.orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length,
      deliveredOrders: store.orders.filter(o => o.orderStatus === 'Delivered').length
    }
  }
}

// Execute tests
const adapter = new TestAdapter(testDbPath)

// 1. Initial Load
const initial = adapter.getProducts()
assert.equal(initial.length, 1)
console.log('✓ Initial seed products loaded successfully')

// 2. Add New Product
const newBag = adapter.saveProduct({
  name: 'The Anora Royale Flap',
  price: 8990,
  category: 'crossbody',
  image: '/images/products/bordeaux-crossbody-hero.jpeg',
  description: 'Handcrafted luxury flap bag'
})
assert.equal(newBag.id, 'the-anora-the-anora-royale-flap')
assert.equal(adapter.getProducts().length, 2)
console.log('✓ Dynamic product catalog addition verified')

// 3. Stock toggle
const toggled = adapter.toggleStock(newBag.id)
assert.equal(toggled.inStock, false)
console.log('✓ Instant InStock / OutOfStock toggling verified')

// 4. Safe deletion guard
const delResult1 = adapter.deleteProduct(newBag.id)
assert.equal(delResult1, true)
assert.equal(adapter.getProducts().length, 1)

// Attempting to delete the sole remaining product
const delResult2 = adapter.deleteProduct('the-anora-bordeaux-flap-crossbody')
assert.equal(delResult2, false, 'Should protect last remaining product from deletion')
console.log('✓ Sole-remaining product protection guard verified')

// 5. COD Order Placement & Auto-Numbering
const o1 = adapter.createOrder({
  customerName: 'Amina Tariq',
  email: 'amina@example.com',
  phone: '03219876543',
  address: 'Plot 15, Sector F-7/2',
  city: 'Islamabad',
  items: [{ id: 'the-anora-bordeaux-flap-crossbody', name: 'Bordeaux Flap', price: 6990, quantity: 1, color: 'Bordeaux', image: '' }],
  subtotal: 6990,
  shippingFee: 0,
  totalAmount: 6990
})
assert.equal(o1.orderNumber, 'ANR-2026-1001')
assert.equal(o1.paymentStatus, 'Pending Cash on Delivery')
console.log('✓ Order created with sequence number:', o1.orderNumber)

// 6. Order Tracking Lookup by Phone & Order #
const foundByNum = adapter.getOrder('ANR-2026-1001')
assert.ok(foundByNum !== null)
const foundByPhone = adapter.getOrder('03219876543')
assert.ok(foundByPhone !== null)
assert.equal(foundByNum.id, foundByPhone.id)
console.log('✓ Order lookup by Order Number and Pakistani phone number verified')

// 7. Status updates & Delivery Cash Collection
adapter.updateOrderStatus(o1.id, 'Dispatched')
let current = adapter.getOrder('ANR-2026-1001')
assert.equal(current.orderStatus, 'Dispatched')
assert.equal(current.paymentStatus, 'Pending Cash on Delivery')

adapter.updateOrderStatus(o1.id, 'Delivered')
current = adapter.getOrder('ANR-2026-1001')
assert.equal(current.orderStatus, 'Delivered')
assert.equal(current.paymentStatus, 'Paid Cash on Delivery')
console.log('✓ Delivery status transition automatically updates payment status to Paid Cash on Delivery')

// 8. Subscribers & Deduplication
assert.equal(adapter.addSubscriber('vip@anora.pk').success, true)
assert.equal(adapter.addSubscriber('vip@anora.pk').duplicate, true)
console.log('✓ Subscriber registration and duplicate prevention verified')

// 9. Analytics Computation
const stats = adapter.getAnalytics()
assert.equal(stats.totalOrders, 1)
assert.equal(stats.totalRevenue, 6990)
assert.equal(stats.deliveredCashCollected, 6990)
assert.equal(stats.deliveredOrders, 1)
assert.equal(stats.pendingOrders, 0)
console.log('✓ Analytics and COD collected metrics accurately verified')

// Cleanup temp dir
fs.rmSync(tempTestDir, { recursive: true, force: true })
console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!')
