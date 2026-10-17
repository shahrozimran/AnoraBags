import type { Metadata } from "next"
import Link from "next/link"
import { HelpPage } from "@/components/anora/help-page"
import { STORE_CONTACT } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "7-Day Return & Exchange Policy — Anora Bags",
  description: "Return or exchange your Anora Bag within 7 days of delivery. Free doorstep collection, no hassle. COD refunds via bank transfer, EasyPaisa, or JazzCash. Pakistan nationwide.",
  alternates: { canonical: "https://anorabags.com/return-policy" },
  keywords: [
    "Anora Bags return policy",
    "7 day return bags Pakistan",
    "exchange handbag Pakistan",
    "COD refund Pakistan",
    "free return leather bag",
    "Anora Bags refund",
    "return bags Karachi Lahore Islamabad"
  ],
  openGraph: {
    title: "7-Day Return & Exchange Policy — Anora Bags",
    description: "Return or exchange within 7 days. Free doorstep collection and fast COD refunds across Pakistan.",
    url: "https://anorabags.com/return-policy",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: [{ url: "/images/products/bordeaux-white/front.webp", width: 1200, height: 630, alt: "Anora Bags Return Policy" }]
  },
  twitter: {
    card: "summary",
    title: "7-Day Return Policy — Anora Bags",
    description: "Free doorstep collection. COD refunds within 24 hours of verification."
  }
}

export default function ReturnPolicyPage() {
  return (
    <HelpPage title="A little peace of mind." description="We want you to love your bag. If it isn’t right for you, get in touch within 7 days of delivery for a return or exchange." path="/return-policy" sections={[
      { id: "window", title: "Your 7-day return window", content: <p>Request a return or exchange within 7 days of receiving your order. You can contact us even if the courier collection will take place later. Please include your order number so we can locate your purchase.</p> },
      { id: "condition", title: "Getting your bag ready", content: <p>You are welcome to inspect and try the bag at home. Please return it unused, without wear, damage, stains, or alterations, with its original tags, included straps and accessories, and original packaging. If your bag arrived damaged or incorrect, tell us and share photos so we can help with that issue.</p> },
      { id: "request", title: "Three simple steps", content: <ol>
        <li><strong>Message us.</strong> Contact <a href={STORE_CONTACT.whatsapp}>WhatsApp</a> or <a href={`mailto:${STORE_CONTACT.email}`}>{STORE_CONTACT.email}</a> with your order number and whether you would prefer a return or exchange.</li>
        <li><strong>Arrange collection.</strong> Our team will confirm your request and coordinate free doorstep collection with you. Pack the bag and all included items securely; keep the pickup receipt.</li>
        <li><strong>Receive your resolution.</strong> After collection and verification of the returned items, we arrange your refund or dispatch an available replacement.</li>
      </ol> },
      { id: "fees", title: "Collection & exchanges", content: <p>We arrange doorstep collection at no return fee. Exchanges are subject to the requested product and colour being in stock. Only the colours listed on the product page are available. If your replacement has a different price, our team will confirm any difference with you before proceeding.</p> },
      { id: "refunds", title: "Refunds for COD orders", content: <>
        <p>As you paid cash on delivery, our team will agree on a bank transfer, EasyPaisa, or JazzCash refund with you. We aim to process an approved refund within 24 hours of collection and verification. Bank or wallet posting times can vary; contact us if your refund has not arrived.</p>
        <p>These are refund channels only. We currently accept <strong>Cash on Delivery only</strong> for purchases. Never share a PIN, password, or one-time verification code with anyone.</p>
      </> },
      { id: "damaged", title: "Damaged or incorrect items", content: <p>Let us know as soon as you notice a problem. Send your order number, photos of the item, and photos of the parcel packaging to our team. Keep the bag and all packaging so we can arrange the appropriate return or replacement. For order status, visit <Link href="/track-order">Track your order</Link>.</p> },
    ]} />
  )
}
