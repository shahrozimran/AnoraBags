import { safeJsonLd } from "@/lib/security/serialization"
import React from "react"
import type { Metadata } from "next"
import { getProducts } from "@/lib/db"
import { Header } from "@/components/anora/header"
import { Hero } from "@/components/anora/hero"
import { ProductGrid } from "@/components/anora/product-grid"
import { BrandStory } from "@/components/anora/brand-story"
import { Testimonials } from "@/components/anora/testimonials"
import { Newsletter } from "@/components/anora/newsletter"
import { Footer } from "@/components/anora/footer"
import { CartDrawer } from "@/components/anora/cart-drawer"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Anora Bags — Bags For Every You | Handcrafted Luxury Handbags",
  description:
    "Carry confidence everyday with Anora Bags. Explore our collection of handbags with 100% Cash On Delivery nationwide and a 7-day doorstep refund guarantee.",
  keywords: [
    "Anora Bags",
    "anorabags.com",
    "luxury handbags Pakistan",
    "leather crossbody bags",
    "leather satchel",
    "bordeaux bag",
    "cash on delivery bags Karachi",
    "7-day refund bags Lahore",
    "minimalist leather bag Islamabad",
    "bespoke handbags Pakistan"
  ],
  alternates: {
    canonical: "https://anorabags.com"
  },
  openGraph: {
    title: "Anora Bags — Bags For Every You | Handcrafted Luxury",
    description: "Handcrafted minimalist luxury leather bags. 100% Cash On Delivery nationwide across Pakistan & 7-Day Doorstep Refund Policy.",
    url: "https://anorabags.com",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/images/products/bordeaux-white/front.webp",
        width: 1200,
        height: 630,
        alt: "Anora Bags Signature Bordeaux Flap Crossbody"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Anora Bags — Bags For Every You | Handcrafted Luxury",
    description: "Handcrafted minimalist luxury leather bags. 100% Cash On Delivery nationwide across Pakistan & 7-Day Doorstep Refund Policy.",
    images: ["/images/products/bordeaux-white/front.webp"]
  }
}

export default async function HomePage() {
  const products = await getProducts()

  // Schema.org Structured Data graph for AEO & GEO
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "Anora Handcrafted Handbag Collection",
        "description": "Signature minimalist luxury handbags available with 100% Cash on Delivery across Pakistan.",
        "itemListElement": products.map((prod, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "Product",
            "name": prod.name,
            "url": `https://anorabags.com/product/${prod.id}`,
            "image": `https://anorabags.com${prod.image}`,
            "description": prod.description,
            "offers": {
              "@type": "Offer",
              "price": prod.price,
              "priceCurrency": "PKR",
              "availability": prod.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does Anora Bags offer Cash on Delivery (COD) in Pakistan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anora Bags currently accepts Cash on Delivery (COD) only. Pay the order total in cash to the courier when your parcel arrives. No advance payment is required."
            }
          },
          {
            "@type": "Question",
            "name": "What is Anora Bags' 7-day refund guarantee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Contact us within 7 days of delivery to request a return or exchange. We arrange free doorstep collection and process approved refunds after return verification. Please see our return policy for item condition and refund details."
            }
          },
          {
            "@type": "Question",
            "name": "Which cities does Anora deliver to?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anora provides express courier delivery to all cities across Pakistan, including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Sialkot, and Quetta, typically arriving within 2 to 3 business days."
            }
          },
          {
            "@type": "Question",
            "name": "Are Anora bags genuine leather?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Every silhouette in the Anora collection is meticulously handcrafted from authentic full-grain pebbled calfskin leather and finished with custom 18k brushed gold brass hardware."
            }
          }
        ]
      }
    ]
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeSchema) }}
      />
      <Header />
      <CartDrawer />
      <Hero products={products} />
      <ProductGrid products={products} />
      <BrandStory product={products[0]} />
      <Testimonials products={products} />
      <Newsletter />
      <Footer />
    </main>
  )
}
