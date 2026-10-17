import { safeJsonLd } from "@/lib/security/serialization"
import React from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductById, getProducts, getReviewsForProduct } from "@/lib/db"
import { Header } from "@/components/anora/header"
import { ProductDetail } from "@/components/anora/product-detail"
import { ProductCard } from "@/components/anora/product-card"
import { CartDrawer } from "@/components/anora/cart-drawer"
import { Footer } from "@/components/anora/footer"

interface Props {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ color?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: "Bag Not Found — Anora Bags",
      description: "Handcrafted luxury bags by Anora."
    }
  }

  const canonicalUrl = `https://anorabags.com/product/${product.id}`

  return {
    title: `${product.name} — Handcrafted Luxury Handbag | Anora Bags`,
    description: `${product.description.slice(0, 140)} Cash on Delivery nationwide in Pakistan. Free delivery & 7-day hassle-free returns. Price: Rs. ${product.price.toLocaleString()} PKR.`,
    alternates: {
      canonical: canonicalUrl
    },
    keywords: [
      product.name,
      `${product.name} price Pakistan`,
      `buy ${product.name} online`,
      `${product.name} cash on delivery`,
      "Anora Bags",
      product.category,
      product.colorName,
      `${product.colorName} leather bag`,
      "luxury handbags Pakistan",
      "cash on delivery leather bags",
      "handcrafted bags Karachi",
      "designer handbags Lahore",
      "leather bags Islamabad",
      "7-day refund bags Pakistan"
    ],
    openGraph: {
      title: `${product.name} — Rs. ${product.price.toLocaleString()} | Anora Bags`,
      description: `${product.tagline}. Free delivery & 7-day return. Cash on Delivery in Pakistan.`,
      url: canonicalUrl,
      siteName: "Anora Bags",
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: product.image.startsWith("http") ? product.image : `https://anorabags.com${product.image}`,
          width: 800,
          height: 1000,
          alt: `${product.name} — Anora Bags`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Anora Bags`,
      description: `${product.tagline}. Cash on Delivery. 7-day returns.`,
      images: [product.image.startsWith("http") ? product.image : `https://anorabags.com${product.image}`]
    }
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const [allProducts, reviews] = await Promise.all([
    getProducts(),
    getReviewsForProduct(product.id)
  ])
  const initialColor = (await searchParams)?.color

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3)

  // Rich Schema.org structured graph for AEO & Google Rich Results
  const productSchema = {
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
            "name": "Shop Handbags",
            "item": "https://anorabags.com/shop"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": `https://anorabags.com/product/${product.id}`
          }
        ]
      },
      {
        "@type": "Product",
        "@id": `https://anorabags.com/product/${product.id}#product`,
        "name": product.name,
        "image": [
          product.image.startsWith("http") ? product.image : `https://anorabags.com${product.image}`,
          ...(product.images || []).map((img) =>
            img.startsWith("http") ? img : `https://anorabags.com${img}`
          )
        ],
        "description": product.description,
        "sku": product.id,
        "mpn": product.id.toUpperCase(),
        "color": product.availableColors.map((color) => color.name),
        "material": product.specs?.material || "Full-Grain Calfskin Leather",
        "brand": {
          "@type": "Brand",
          "name": "Anora Bags"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://anorabags.com/product/${product.id}`,
          "priceCurrency": "PKR",
          "price": product.price,
          "priceValidUntil": "2027-12-31",
          "availability": product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Anora Bags"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": 0,
              "currency": "PKR"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "PK"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 3,
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "PK",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",
            "refundType": "https://schema.org/FullRefund"
          }
        },
        ...(product.reviewCount > 0 ? { "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount
        } } : {}),
        ...(reviews.length > 0
          ? {
              "review": reviews.map((r) => ({
                "@type": "Review",
                "author": { "@type": "Person", "name": r.author },
                "datePublished": r.createdAt,
                "reviewBody": r.comment,
                "name": r.title,
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": r.rating,
                  "bestRating": 5
                }
              }))
            }
          : {})
      }
    ]
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
      />
      <Header />
      <CartDrawer />
      <ProductDetail key={`${product.id}:${initialColor || product.colorName}`} product={product} reviews={reviews} initialColor={initialColor} />

      {/* Related Handbags Section */}
      {related.length > 0 && (
        <section className="py-16 bg-[#FAF6F1] border-t border-[#E5DCD2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center space-y-1.5">
              <span className="text-xs sm:text-sm font-medium text-[#462F1D]">
                Curated Selection
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#23170F]">
                You May Also Like
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
