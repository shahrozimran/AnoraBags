import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/components/anora/cart-context"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"]
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
})

export const metadata: Metadata = {
  metadataBase: new URL("https://anorabags.com"),
  alternates: {
    canonical: "https://anorabags.com"
  },
  title: {
    default: "Anora Bags — Bags For Every You | Handcrafted Luxury Handbags",
    template: "%s | Anora Bags"
  },
  description:
    "Discover handcrafted minimalist luxury leather bags at Anora Bags. 100% Cash On Delivery nationwide in Karachi, Lahore, Islamabad, Rawalpindi & all Pakistan cities with an unconditional 7-Day Doorstep Refund Guarantee.",
  keywords: [
    "Anora Bags",
    "anorabags.com",
    "handcrafted bags Pakistan",
    "luxury leather handbags Pakistan",
    "leather crossbody bag",
    "bordeaux bag",
    "dua satchel",
    "cash on delivery handbags",
    "7-day refund bags Pakistan",
    "minimalist luxury bags Lahore",
    "designer handbags Karachi",
    "women leather bags Islamabad"
  ],
  authors: [{ name: "Anora Atelier", url: "https://anorabags.com" }],
  creator: "Anora Bags",
  publisher: "Anora Bags",
  formatDetection: {
    email: true,
    address: true,
    telephone: true
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://anorabags.com",
    siteName: "Anora Bags",
    title: "Anora Bags — Bags For Every You | Handcrafted Luxury Handbags",
    description: "Minimalist luxury leather handbags. 100% Cash On Delivery nationwide across Pakistan & 7-Day Doorstep Refund Guarantee.",
    images: [
      {
        url: "/images/products/bordeaux-crossbody-hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Anora Bags Handcrafted Luxury Leather Bags"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Anora Bags — Bags For Every You | Handcrafted Luxury Handbags",
    description: "Minimalist luxury leather handbags. 100% Cash On Delivery nationwide across Pakistan & 7-Day Doorstep Refund Guarantee.",
    images: ["/images/products/bordeaux-crossbody-hero.jpeg"],
    creator: "@anorabags"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png"
  },
  other: {
    "geo.region": "PK",
    "geo.placename": "Pakistan; Lahore; Karachi; Islamabad",
    "rating": "General",
    "distribution": "Global"
  }
}

export const viewport: Viewport = {
  themeColor: "#462F1D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Global Schema.org graph for AEO and GEO engine consumption
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://anorabags.com/#website",
        "url": "https://anorabags.com",
        "name": "Anora Bags",
        "description": "Timeless Style, Modern You — Handcrafted luxury leather handbags with 100% Cash on Delivery nationwide.",
        "inLanguage": "en-PK",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://anorabags.com/shop?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://anorabags.com/#organization",
        "name": "Anora Bags",
        "url": "https://anorabags.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://anorabags.com/icon.svg",
          "caption": "Anora Bags Official Emblem"
        },
        "description": "Bespoke handcrafted leather accessories and minimalist luxury bags.",
        "slogan": "Timeless Style, Modern You — Bags For Every You",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+92-300-1234567",
          "contactType": "Customer Concierge",
          "areaServed": "PK",
          "availableLanguage": ["English", "Urdu"]
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "PK",
          "addressRegion": "Punjab",
          "addressLocality": "Lahore"
        }
      },
      {
        "@type": "OnlineStore",
        "@id": "https://anorabags.com/#store",
        "name": "Anora Bags Online Boutique",
        "url": "https://anorabags.com",
        "parentOrganization": {
          "@id": "https://anorabags.com/#organization"
        },
        "currenciesAccepted": "PKR",
        "paymentAccepted": "Cash on Delivery, COD",
        "priceRange": "Rs. 6990 - Rs. 10990",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "PK",
          "merchantReturnDays": 7,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn",
          "refundType": "https://schema.org/FullRefund",
          "customerRemorseReturnFees": "https://schema.org/FreeReturn",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow"
        },
        "areaServed": [
          { "@type": "City", "name": "Karachi" },
          { "@type": "City", "name": "Lahore" },
          { "@type": "City", "name": "Islamabad" },
          { "@type": "City", "name": "Rawalpindi" },
          { "@type": "City", "name": "Faisalabad" },
          { "@type": "City", "name": "Multan" },
          { "@type": "City", "name": "Peshawar" },
          { "@type": "City", "name": "Sialkot" },
          { "@type": "City", "name": "Quetta" },
          { "@type": "Country", "name": "Pakistan" }
        ]
      }
    ]
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className={`${dmSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} font-sans antialiased text-[#23170F] bg-[#FAF6F1]`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
