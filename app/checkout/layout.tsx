import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Secure Cash On Delivery Checkout — Anora Bags",
  description: "Complete your Anora Bags order with 100% Cash On Delivery nationwide. No credit card required.",
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: "https://anorabags.com/checkout"
  }
}

export default function CheckoutLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
