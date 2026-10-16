import { getProducts as dbGetProducts, getProductById as dbGetProductById, Product as AnoraProduct } from './db'

export type Product = AnoraProduct

export async function getProducts(options?: {
  category?: string
  query?: string
  sort?: string
}): Promise<Product[]> {
  return dbGetProducts(options)
}

export async function getProduct(idOrHandle: string): Promise<Product | null> {
  return dbGetProductById(idOrHandle)
}

export type CartLine = {
  id: string
  quantity: number
  merchandiseId: string
  productHandle: string
  title: string
  image: string
  price: number
  color?: string
  currencyCode: string
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
  lines: CartLine[]
}
