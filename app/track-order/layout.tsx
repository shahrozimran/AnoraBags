import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Your COD Parcel — Anora Bags",
  description: "Securely track your COD order with your order number and full checkout mobile number.",
  alternates: {
    canonical: "https://anorabags.com/track-order"
  },
  openGraph: {
    title: "Track Your COD Parcel — Anora Bags",
    description: "Track live courier delivery status for your Cash On Delivery order across Pakistan.",
    url: "https://anorabags.com/track-order",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website"
  }
}

export default function TrackOrderLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
