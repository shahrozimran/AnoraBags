import React from "react"
import type { Metadata } from "next"
import { getProducts } from "@/lib/db"
import { Header } from "@/components/anora/header"
import { ProductGrid } from "@/components/anora/product-grid"
import { CartDrawer } from "@/components/anora/cart-drawer"
import { Footer } from "@/components/anora/footer"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Shop All Handcrafted Leather Handbags — Anora Bags",
  description:
    "Explore Anora Bags in two collections: Crossbody Bags and Top-Handle Bags. Cash On Delivery nationwide in Pakistan & 7-Day Doorstep Returns.",
  alternates: {
    canonical: "https://anorabags.com/shop"
  },
  openGraph: {
    title: "Shop All Handbags — Anora Bags",
    description: "Minimalist luxury leather handbags. 100% Cash On Delivery nationwide with 7-Day Returns.",
    url: "https://anorabags.com/shop",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: ["/images/products/bordeaux-white/front.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Handbags — Anora Bags",
    description: "Minimalist luxury leather handbags. 100% Cash On Delivery nationwide with 7-Day Returns.",
    images: ["/images/products/bordeaux-white/front.webp"]
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
            "name": "Shop Collection",
            "item": "https://anorabags.com/shop"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": "Anora Handbags Collection",
        "url": "https://anorabags.com/shop",
        "description": "Handcrafted minimalist luxury leather handbags available with Cash on Delivery nationwide.",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": products.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://anorabags.com/product/${p.id}`
          }))
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1]/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopSchema) }}
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
