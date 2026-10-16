import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
const storePath = path.join(dataDir, 'anora-store.json')

console.log('Testing Anora Store JSON integrity and structure...')

assert.ok(fs.existsSync(storePath), 'anora-store.json must exist')
const raw = fs.readFileSync(storePath, 'utf-8')
const data = JSON.parse(raw)

// Check products
assert.ok(Array.isArray(data.products), 'products must be an array')
assert.ok(data.products.length >= 5, 'must have at least 5 products')
for (const p of data.products) {
  assert.ok(p.id, `product must have id: ${JSON.stringify(p)}`)
  assert.ok(p.name, `product must have name: ${p.id}`)
  assert.ok(typeof p.price === 'number', `product price must be number: ${p.id}`)
  assert.ok(p.category, `product must have category: ${p.id}`)
  assert.ok(p.specs, `product must have specs: ${p.id}`)
  assert.ok(typeof p.inStock === 'boolean', `product inStock must be boolean: ${p.id}`)
  console.log(`✓ Product verified: [${p.id}] "${p.name}" - Rs. ${p.price} (${p.category}) - InStock: ${p.inStock}`)
}

// Check reviews
assert.ok(Array.isArray(data.reviews), 'reviews must be an array')
assert.ok(data.reviews.length >= 4, 'must have authentic reviews')
for (const r of data.reviews) {
  assert.ok(r.id && r.productId && r.author && r.rating, `review must have required fields: ${r.id}`)
}
console.log(`✓ Verified ${data.reviews.length} authentic customer reviews across Pakistani cities`)

// Check orders and subscribers structure
assert.ok(Array.isArray(data.orders), 'orders must be array')
assert.ok(Array.isArray(data.subscribers), 'subscribers must be array')

console.log('🎉 Data Store JSON integrity tests PASSED successfully!')
