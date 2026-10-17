import type { Product } from './types'

export function getProductMedia(product: Product, requestedColor?: string) {
  const variant = product.availableColors.find((color) => color.name.toLowerCase() === requestedColor?.toLowerCase())
    || product.availableColors.find((color) => color.name === product.colorName)
  const image = variant?.image || product.image
  const images = variant?.images?.length
    ? variant.images
    : variant?.image ? [variant.image] : product.images.length ? product.images : [image]

  return { color: variant?.name || product.colorName, image, images }
}
