import { safeJsonLd } from "@/lib/security/serialization"
import React from "react"
import type { Metadata } from "next"
import { getProducts } from "@/lib/db"
import { Header } from "@/components/anora/header"
import { ProductGrid } from "@/components/anora/product-grid"
import { CartDrawer } from "@/components/anora/cart-drawer"
import { Footer } from "@/components/anora/footer"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Shop Handcrafted Leather Handbags — Anora Bags Pakistan",
  description:
    "Browse Anora Bags' full collection of handcrafted luxury leather handbags. Crossbody bags & top-handle bags with 100% Cash on Delivery and free nationwide delivery across Pakistan — Karachi, Lahore, Islamabad, Rawalpindi & beyond.",
  alternates: {
    canonical: "https://anorabags.com/shop"
  },
  keywords: [
    "buy leather handbags Pakistan",
    "luxury bags cash on delivery",
    "crossbody bags Pakistan",
    "top handle bags Pakistan",
    "leather bags Karachi",
    "leather bags Lahore",
    "designer bags Islamabad",
    "Anora Bags collection",
    "women bags online Pakistan",
    "COD handbags",
    "free delivery leather bags"
  ],
  openGraph: {
    title: "Shop Handcrafted Leather Handbags — Anora Bags",
    description: "Crossbody & top-handle bags. Free COD delivery across Pakistan. 7-day returns.",
    url: "https://anorabags.com/shop",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: [{ url: "https://anorabags.com/images/products/bordeaux-white/front.webp", width: 1200, height: 630, alt: "Anora Bags Handcrafted Collection" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Anora Bags — Handcrafted Leather Handbags",
    description: "Crossbody & top-handle bags. Free COD delivery. 7-day returns across Pakistan.",
    images: ["https://anorabags.com/images/products/bordeaux-white/front.webp"]
  }
}

export default async function ShopPage(props: {
  searchParams?: Promise<{ category?: string }>
}) {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const products = await getProducts()

  const shopSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://anorabags.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Shop Handcrafted Handbags",
            "item": "https://anorabags.com/shop"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": "Anora Handbags Collection",
        "url": "https://anorabags.com/shop",
        "description": "Handcrafted minimalist luxury leather handbags available with 100% Cash on Delivery and free nationwide delivery across Pakistan.",
        "mainEntity": {
          "@type": "ItemList",
          "name": "Anora Bags Complete Collection",
          "numberOfItems": products.length,
          "itemListElement": products.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": p.name,
            "url": `https://anorabags.com/product/${p.id}`,
            "image": p.image.startsWith("http") ? p.image : `https://anorabags.com${p.image}`,
            "description": p.tagline,
          }))
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1]/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(shopSchema) }}
      />
      <Header />
      <CartDrawer />
      <div className="py-6">
        <ProductGrid products={products} initialCategory={category} />
      </div>
      <Footer />
    </main>
  )
}
