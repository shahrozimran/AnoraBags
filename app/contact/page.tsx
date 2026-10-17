import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react"
import { HelpPage } from "@/components/anora/help-page"
import { STORE_CONTACT } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Contact Us — Anora Bags Customer Support",
  description: "Contact Anora Bags via WhatsApp, phone, or email for orders, delivery status, and 7-day returns. Reach us at +92 319 4186103 or anorabags10@gmail.com. Pakistan nationwide.",
  alternates: { canonical: "https://anorabags.com/contact" },
  keywords: [
    "contact Anora Bags",
    "Anora Bags WhatsApp",
    "Anora Bags phone number",
    "Anora Bags customer support Pakistan",
    "handbag customer service Pakistan",
    "COD bag help Pakistan"
  ],
  openGraph: {
    title: "Contact Us — Anora Bags",
    description: "Reach Anora Bags on WhatsApp, phone, or email for orders, tracking, and 7-day return requests.",
    url: "https://anorabags.com/contact",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website",
    images: [{ url: "/images/products/bordeaux-white/front.webp", width: 1200, height: 630, alt: "Contact Anora Bags" }]
  },
  twitter: {
    card: "summary",
    title: "Contact Anora Bags",
    description: "WhatsApp, phone, or email — we're here to help with your order."
  }
}

export default function ContactPage() {
  return (
    <HelpPage title="Let’s talk." description="A question about a bag, an order, or a return? Get in touch with the Anora team. We’re here to help." path="/contact">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: MessageCircle, label: "WhatsApp", value: STORE_CONTACT.phoneLabel, href: STORE_CONTACT.whatsapp, external: true, text: "Send us a message about your order or a bag you love." },
          { icon: Phone, label: "Call us", value: STORE_CONTACT.phoneLabel, href: `tel:${STORE_CONTACT.phone}`, external: false, text: "Talk to our team about product and delivery questions." },
          { icon: Mail, label: "Email us", value: STORE_CONTACT.email, href: `mailto:${STORE_CONTACT.email}`, external: false, text: "For order enquiries, returns, or other questions." },
        ].map(({ icon: Icon, label, value, href, external, text }) => (
          <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group rounded-2xl border border-[#DECFBF] bg-white/70 p-6 transition-colors hover:border-[#9E8269] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#462F1D]">
            <div className="mb-6 flex items-center justify-between"><Icon className="h-5 w-5 text-[#806650]" aria-hidden="true" /><ArrowUpRight className="h-4 w-4 text-[#806650] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></div>
            <h2 className="font-serif text-3xl">{label}</h2>
            <p className="mt-3 break-all text-sm font-medium">{value}</p>
            <p className="mt-3 text-sm leading-6 text-[#74604F]">{text}</p>
          </a>
        ))}
        <div className="rounded-2xl bg-[#EDE2D7] p-6">
          <h2 className="font-serif text-3xl">Have your order number?</h2>
          <p className="mt-3 text-sm leading-6 text-[#74604F]">Include it in your message so we can help you faster. Please never send passwords, PINs, or verification codes.</p>
          <Link href="/track-order" className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">Track your order<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-[#DECFBF] px-6 py-5 text-sm leading-7 text-[#74604F]">
        Looking for a quick answer? Visit our <Link href="/faq" className="font-medium text-[#34251B] underline underline-offset-4">FAQs</Link>, <Link href="/delivery-policy" className="font-medium text-[#34251B] underline underline-offset-4">delivery policy</Link>, or <Link href="/return-policy" className="font-medium text-[#34251B] underline underline-offset-4">return policy</Link>.
      </div>
    </HelpPage>
  )
}
