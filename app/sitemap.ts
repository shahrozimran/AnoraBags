import { MetadataRoute } from "next"
import { getProducts } from "@/lib/db"

export const dynamic = "force-dynamic"

// Approximate dates of content creation/last update for crawl signals
const NOW = new Date()
const LAST_MONTH = new Date(NOW.getFullYear(), NOW.getMonth() - 1, 1)
const LAST_QUARTER = new Date(NOW.getFullYear(), NOW.getMonth() - 3, 1)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anorabags.com"
  const products = await getProducts()

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: NOW,
    changeFrequency: "weekly" as const,
    priority: 0.95
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: NOW,
      changeFrequency: "daily" as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: NOW,
      changeFrequency: "daily" as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: LAST_MONTH,
      changeFrequency: "monthly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: LAST_MONTH,
      changeFrequency: "monthly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/delivery-policy`,
      lastModified: LAST_MONTH,
      changeFrequency: "monthly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: LAST_MONTH,
      changeFrequency: "monthly" as const,
      priority: 0.75
    },
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_QUARTER,
      changeFrequency: "monthly" as const,
      priority: 0.65
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: LAST_QUARTER,
      changeFrequency: "monthly" as const,
      priority: 0.65
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: LAST_QUARTER,
      changeFrequency: "yearly" as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: LAST_QUARTER,
      changeFrequency: "yearly" as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: LAST_QUARTER,
      changeFrequency: "yearly" as const,
      priority: 0.4
    }
  ]

  return [...staticUrls, ...productUrls]
}
