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
    description: `${product.description} 100% Cash On Delivery nationwide in Pakistan with 7-Day Hassle-Free Returns. Price: Rs. ${product.price.toLocaleString()} PKR.`,
    alternates: {
      canonical: canonicalUrl
    },
    keywords: [
      product.name,
      "Anora Bags",
      product.category,
      product.colorName,
      "luxury handbags Pakistan",
      "cash on delivery leather bags",
      "7-day refund bags"
    ],
    openGraph: {
      title: `${product.name} — Anora Bags`,
      description: product.tagline,
      url: canonicalUrl,
      siteName: "Anora Bags",
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Anora Bags`,
      description: product.tagline,
      images: [product.image]
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const [allProducts, reviews] = await Promise.all([
    getProducts(),
    getReviewsForProduct(product.id)
  ])

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
        "color": product.colorName,
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount || Math.max(reviews.length, 1)
        },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header />
      <CartDrawer />
      <ProductDetail product={product} reviews={reviews} />

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
