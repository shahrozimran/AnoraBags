import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Your Order — Anora Bags Pakistan",
  description: "Track your Anora Bags Cash on Delivery order status in real time. Enter your order number and mobile number to see if your parcel is confirmed, dispatched, or delivered.",
  alternates: {
    canonical: "https://anorabags.com/track-order"
  },
  keywords: [
    "track Anora Bags order",
    "Anora order tracking Pakistan",
    "COD order status Pakistan",
    "track handbag order",
    "Anora Bags delivery status",
    "track parcel Pakistan"
  ],
  openGraph: {
    title: "Track Your Order — Anora Bags",
    description: "Check your Anora Bags parcel live. Enter order number and checkout mobile number.",
    url: "https://anorabags.com/track-order",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: [{ url: "/images/products/bordeaux-white/front.webp", width: 1200, height: 630, alt: "Track Your Anora Bags Order" }]
  },
  twitter: {
    card: "summary",
    title: "Track Your Anora Bags Order",
    description: "Live COD order tracking for Anora Bags Pakistan."
  }
}


export default function TrackOrderLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
