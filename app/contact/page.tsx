import React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import { CartDrawer } from "@/components/anora/cart-drawer"
import { MessageCircle, Phone, Mail, Clock, ShieldCheck, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Concierge — Anora Bags",
  description: "Connect with the Anora Bags team for order inquiries, 7-day returns, and nationwide COD delivery assistance.",
  alternates: {
    canonical: "https://anorabags.com/contact"
  },
  openGraph: {
    title: "Contact Concierge — Anora Bags",
    description: "Connect with the Anora Bags team for order inquiries, 7-day returns, and COD assistance.",
    url: "https://anorabags.com/contact",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website"
  }
}

export default function ContactPage() {
  const contactSchema = {
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
            "name": "Contact Concierge",
            "item": "https://anorabags.com/contact"
          }
        ]
      },
      {
        "@type": "ContactPage",
        "name": "Anora Bags Concierge Support",
        "url": "https://anorabags.com/contact",
        "description": "WhatsApp, email, and live courier tracking assistance."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <Header />
      <CartDrawer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[#462F1D]/40" />
            <span className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase font-semibold text-[#462F1D]">
              Maison Concierge
            </span>
            <span className="h-px w-6 bg-[#462F1D]/40" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#23170F]">
            Personal Concierge <span className="italic font-normal text-[#462F1D]">Assistance</span>
          </h1>
          <p className="text-base sm:text-lg text-[#462F1D] font-light max-w-lg mx-auto leading-relaxed">
            Direct assistance with leather selections, nationwide COD parcel routing, and 7-day doorstep privilege arrangements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct channels */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5DCD2] shadow-2xs space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl font-light text-[#23170F] border-b border-[#E5DCD2] pb-3">
              Direct Channels
            </h2>

            <div className="space-y-4 text-sm">
              <a
                href="https://wa.me/923001234567?text=Hi%20Anora%20Bags,%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl bg-[#ECE2D8]/40 border border-[#462F1D]/20 flex items-center justify-between text-[#23170F] hover:bg-[#ECE2D8]/70 transition group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-normal text-base text-[#23170F]">WhatsApp Concierge</h4>
                    <p className="text-xs sm:text-sm text-[#462F1D] font-normal">Immediate response 9 AM - 10 PM PKT</p>
                  </div>
                </div>
                <span className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#462F1D] group-hover:translate-x-1 transition-transform">
                  Chat →
                </span>
              </a>

              <div className="p-5 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] flex items-center gap-3.5 text-[#23170F]">
                <div className="w-12 h-12 rounded-full bg-[#ECE2D8] flex items-center justify-center text-[#462F1D] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-normal text-base text-[#23170F]">Email Atelier</h4>
                  <p className="text-xs sm:text-sm text-[#462F1D] font-normal">concierge@anorabags.com</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] flex items-center gap-3.5 text-[#23170F]">
                <div className="w-12 h-12 rounded-full bg-[#ECE2D8] flex items-center justify-center text-[#462F1D] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-normal text-base text-[#23170F]">Concierge Hours</h4>
                  <p className="text-xs sm:text-sm text-[#462F1D] font-normal">Monday – Sunday, 9:00 AM – 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links & FAQ */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5DCD2] shadow-2xs space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl font-light text-[#23170F] border-b border-[#E5DCD2] pb-3">
              Self-Service Privileges
            </h2>

            <div className="space-y-4">
              <Link
                href="/track-order"
                className="block p-5 rounded-xl border border-[#E5DCD2] hover:border-[#462F1D] transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-normal text-[#23170F] group-hover:text-[#462F1D] transition-colors">
                      Track Your COD Order
                    </h4>
                    <p className="text-xs sm:text-sm text-[#462F1D] font-light mt-0.5">
                      Check real-time courier dispatch status with your order number.
                    </p>
                  </div>
                  <span className="text-[#462F1D] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>

              <Link
                href="/refund-policy"
                className="block p-5 rounded-xl border border-[#E5DCD2] hover:border-[#462F1D] transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-normal text-[#23170F] group-hover:text-[#462F1D] transition-colors">
                      7-Day Home Privilege
                    </h4>
                    <p className="text-xs sm:text-sm text-[#462F1D] font-light mt-0.5">
                      Review doorstep return collection and cash settlement terms.
                    </p>
                  </div>
                  <span className="text-[#462F1D] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>

              <div className="p-5 rounded-xl bg-[#ECE2D8]/30 border border-[#E5DCD2] text-sm text-[#462F1D] space-y-1.5">
                <span className="font-medium text-[#23170F] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#462F1D]" />
                  <span>The Anora Assurance</span>
                </span>
                <p className="font-light text-xs sm:text-sm leading-relaxed">
                  All shipments travel via insured express courier with 100% Cash On Delivery and doorstep parcel inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
