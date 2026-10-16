import React from "react"
import type { Metadata } from "next"
import { getProducts } from "@/lib/db"
import { Header } from "@/components/anora/header"
import { Hero } from "@/components/anora/hero"
import { Studio3DSection } from "@/components/anora/studio-3d-section"
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
    "Carry confidence everyday with Anora Bags. Handcrafted minimalist luxury leather handbags with 3D interactive studio, 100% Cash On Delivery nationwide, and an unconditional 7-day doorstep refund guarantee.",
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
        url: "/images/products/bordeaux-crossbody-hero.jpeg",
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
    images: ["/images/products/bordeaux-crossbody-hero.jpeg"]
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
              "text": "Yes. Anora Bags offers 100% Cash On Delivery (COD) nationwide across Pakistan with zero advance payment. You can inspect your parcel at your doorstep before handing payment to the courier rider."
            }
          },
          {
            "@type": "Question",
            "name": "What is Anora Bags' 7-day refund guarantee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every Anora order is protected by our unconditional 7-Day Hassle-Free Doorstep Return Guarantee. If you are not completely delighted with your bag, our courier picks it up directly from your doorstep and your refund is processed within 24 hours."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <Header />
      <CartDrawer />
      <Hero />
      <Studio3DSection />
      <ProductGrid products={products} />
      <BrandStory />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}
