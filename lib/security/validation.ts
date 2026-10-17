import { z } from "zod"
import type { Product, OrderItem } from "@/lib/types"
import { getProductMedia } from "@/lib/product-media"

export const MAX_QUANTITY = 20
export class CartValidationError extends Error {}
const text = (max: number) => z.string().trim().max(max).refine(value => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value), "Invalid characters.")
export function normalizePhone(value: string): string | null {
  if (!/^[+\d\s()-]+$/.test(value) || value.length > 30) return null
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("0092")) digits = digits.slice(2)
  if (/^03\d{9}$/.test(digits)) digits = "92" + digits.slice(1)
  return /^923\d{9}$/.test(digits) ? digits : null
}
export const checkoutSchema = z.object({
  customerName: text(100).pipe(z.string().min(2)),
  phone: text(30).refine(value => !!normalizePhone(value), "Enter a complete Pakistani mobile number."),
  email: text(254).pipe(z.union([z.literal(""), z.string().email()])),
  address: text(300).pipe(z.string().min(5)),
  apartment: text(100), city: text(80).pipe(z.string().min(2)),
  postalCode: text(12), deliveryNotes: text(1000),
})
export const cartSchema = z.array(z.object({
  id: text(150).pipe(z.string().min(1)),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
  color: text(100).optional(),
})).min(1).max(20)

export async function canonicalCart(input: unknown, findProduct: (id: string) => Promise<Product | null>): Promise<OrderItem[]> {
  const cart = cartSchema.parse(input)
  const merged = new Map<string, OrderItem>()
  for (const item of cart) {
    const product = await findProduct(item.id)
    if (!product || !product.inStock || !Number.isSafeInteger(product.price) || product.price < 1) throw new CartValidationError("A selected bag is unavailable. Please refresh your bag.")
    const variants = product.availableColors.length ? product.availableColors : [{ name: product.colorName, inStock: product.inStock }]
    const variant = variants.find(color => color.name.toLowerCase() === (item.color || product.colorName).toLowerCase())
    if (!variant || !variant.inStock) throw new CartValidationError("A selected colour is unavailable. Please choose an available colour.")
    const key = product.id + "\0" + variant.name
    const quantity = (merged.get(key)?.quantity || 0) + item.quantity
    if (quantity > MAX_QUANTITY) throw new CartValidationError("Please order no more than 20 of each bag and colour.")
    merged.set(key, { id: product.id, name: product.name, price: product.price, color: variant.name, image: getProductMedia(product, variant.name).image, quantity })
  }
  return [...merged.values()]
}

export const orderStatuses = z.enum(["Confirmed", "Processing", "Dispatched", "Out for Delivery", "Delivered", "Cancelled"])
const image = z.string().max(500).refine(value => /^\/images\/[a-zA-Z0-9_./% -]+$/.test(value) && !value.includes(".."), "Use a local /images/ product image.")
const hex = z.string().regex(/^#[a-fA-F0-9]{6}$/)
export const productInputSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,150}$/).optional(),
  name: text(150).pipe(z.string().min(2)), tagline: text(250),
  price: z.number().int().min(1).max(1000000), originalPrice: z.number().int().min(1).max(1000000).nullable().optional(),
  category: z.enum(["crossbody", "satchel", "top-handle", "tote", "shoulder"]),
  colorName: text(100).pipe(z.string().min(1)), colorHex: hex, image,
  images: z.array(image).max(20).optional(),
  availableColors: z.array(z.object({ name: text(100).pipe(z.string().min(1)), hex, inStock: z.boolean(), image: image.optional(), images: z.array(image).max(20).optional() })).max(20).optional(),
  badge: text(100).nullable().optional(), description: text(5000), story: text(5000).optional(),
  features: z.array(text(500)).max(30).optional(),
  specs: z.object({ dimensions: text(300).optional(), weight: text(300).optional(), material: text(300).optional(), hardware: text(300).optional(), strapDrop: text(300).optional(), capacity: text(500).optional(), closure: text(300).optional(), origin: text(300).optional() }).optional(),
  rating: z.number().min(0).max(5).optional(), reviewCount: z.number().int().min(0).max(1000000).optional(),
  inStock: z.boolean().optional(), featured: z.boolean().optional(), isNew: z.boolean().optional(), supports3D: z.boolean().optional(),
})
