import type { Metadata } from "next"
import Link from "next/link"
import { Banknote } from "lucide-react"
import { HelpPage } from "@/components/anora/help-page"
import { STORE_CONTACT } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Delivery Policy — Free Nationwide COD Delivery | Anora Bags",
  description: "Anora Bags offers free Cash on Delivery (COD) across Pakistan. Delivery in 2–3 working days. No advance payment. Read full delivery terms for Karachi, Lahore, Islamabad, and all cities.",
  alternates: { canonical: "https://anorabags.com/delivery-policy" },
  keywords: [
    "Anora Bags delivery policy",
    "free delivery bags Pakistan",
    "COD delivery Pakistan",
    "cash on delivery handbags",
    "Anora Bags shipping",
    "leather bag delivery Karachi Lahore",
    "2-3 day delivery bags Pakistan"
  ],
  openGraph: {
    title: "Delivery Policy — Anora Bags",
    description: "Free COD delivery across Pakistan in 2–3 working days. No advance payment required.",
    url: "https://anorabags.com/delivery-policy",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: [{ url: "/images/products/bordeaux-white/front.webp", width: 1200, height: 630, alt: "Anora Bags Delivery Policy" }]
  },
  twitter: {
    card: "summary",
    title: "Delivery Policy — Anora Bags",
    description: "Free COD delivery in 2–3 days across Pakistan."
  }
}

export default function DeliveryPolicyPage() {
  return (
    <HelpPage title="Delivery, made simple." description="From our collection to your doorstep. Here’s what to expect when you order with Anora." path="/delivery-policy" sections={[
      { id: "payment", title: "Cash on Delivery only", content: <>
        <div className="flex items-start gap-3 rounded-xl bg-[#EDE2D7] p-5 text-[#34251B]"><Banknote className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" /><p><strong>We currently offer Cash on Delivery (COD) only.</strong> Pay your order total in cash to the courier when your bag arrives. No advance payment is required.</p></div>
        <p>Online card payments, bank transfers, EasyPaisa, and JazzCash are not currently available as payment methods at checkout. Please have the amount shown on your order confirmation ready for delivery.</p>
      </> },
      { id: "coverage", title: "Where we deliver", content: <p>We deliver across Pakistan, subject to courier coverage at your address. This includes major cities and other serviceable areas. International shipping is not currently available. If you are unsure about your location, <a href={STORE_CONTACT.whatsapp}>ask us on WhatsApp</a> before ordering.</p> },
      { id: "charges", title: "Delivery charges", content: <p>We currently offer free nationwide delivery. Your checkout and order confirmation show the full order total, including any applicable delivery charge, before you place your order.</p> },
      { id: "timing", title: "Delivery estimates", content: <>
        <p>Delivery typically takes 2–3 working days after dispatch. This is an estimate rather than a guaranteed arrival date. Remote areas, public holidays, weather, and courier disruptions may take longer.</p>
        <p>We may contact you to confirm your order or address before dispatch. Please provide a complete address, city, and a reachable phone number to help avoid delays.</p>
      </> },
      { id: "tracking", title: "Track your parcel", content: <p>Keep the order number from your confirmation. Visit <Link href="/track-order">Track your order</Link> for the latest available status. If delivery is taking longer than expected, contact us with your order number and we will help you follow up.</p> },
      { id: "receiving", title: "Receiving your order", content: <>
        <p>Keep your phone available for the courier and arrange for someone to receive the parcel and pay the COD total. Check the parcel’s outer condition when it arrives. If it appears damaged or tampered with, contact us promptly and keep photos where possible.</p>
        <p>If the bag is damaged, incorrect, or not right for you, contact us within 7 days of delivery. See our <Link href="/return-policy">return policy</Link> for assistance.</p>
      </> },
      { id: "changes", title: "Address changes or missed delivery", content: <p>For an address change, cancellation, or missed delivery, <Link href="/contact">contact our team</Link> as soon as possible with your order number. Changes are easiest before dispatch; courier routing and re-delivery depend on the parcel’s status and service coverage.</p> },
    ]} />
  )
}
