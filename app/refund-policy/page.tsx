import React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import { CartDrawer } from "@/components/anora/cart-drawer"
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Phone,
  ArrowRight,
  Clock,
  Sparkles,
  PackageCheck
} from "lucide-react"

export const metadata: Metadata = {
  title: "7-Day Refund & Exchange Policy — Anora Bags",
  description:
    "Learn about our 7-day hassle-free return and exchange policy. 100% Cash On Delivery nationwide with complete doorstep protection and instant 24-hour bank or mobile cash refunds.",
  alternates: {
    canonical: "https://anorabags.com/refund-policy"
  },
  openGraph: {
    title: "7-Day Refund & Exchange Policy — Anora Bags",
    description: "100% Cash On Delivery nationwide in Pakistan with unconditional 7-Day Doorstep Returns.",
    url: "https://anorabags.com/refund-policy",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "article"
  }
}

export default function RefundPolicyPage() {
  const policySchema = {
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
            "name": "7-Day Refund Policy",
            "item": "https://anorabags.com/refund-policy"
          }
        ]
      },
      {
        "@type": "MerchantReturnPolicy",
        "name": "Anora 7-Day Doorstep Return Policy",
        "applicableCountry": "PK",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "refundType": "https://schema.org/FullRefund",
        "customerRemorseReturnFees": "https://schema.org/FreeReturn",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I inspect the handbag before paying the courier rider?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you are fully entitled and encouraged to inspect the outer parcel and verify your handbag at the doorstep before handing cash to the delivery courier."
            }
          },
          {
            "@type": "Question",
            "name": "How do I receive my refund if I paid Cash On Delivery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Since you paid cash at delivery, our team refunds your full amount directly into your Bank Account (IBAN), EasyPaisa, or JazzCash within 24 hours of package collection."
            }
          },
          {
            "@type": "Question",
            "name": "Do I have to pay courier charges to return or exchange the bag?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Doorstep collection is completely arranged by Anora with zero return fees."
            }
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(policySchema) }}
      />

      <Header />
      <CartDrawer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full space-y-12">
        {/* Page Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ECE2D8] text-[#462F1D] text-xs sm:text-sm font-sans font-semibold tracking-[0.16em] uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>The Maison Privilege</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#23170F]">
            7-Day Doorstep <br />
            <span className="italic font-normal text-[#462F1D]">Home Privilege & Exchange</span>
          </h1>

          <p className="text-base sm:text-lg text-[#462F1D] font-light max-w-xl mx-auto leading-relaxed">
            We want you to carry your Anora silhouette with absolute serenity. Every piece acquired through our Cash on Delivery service includes an unconditional 7-day doorstep return and inspection guarantee.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5DCD2] shadow-2xs space-y-3">
            <span className="font-serif italic text-sm text-[#462F1D]">01. Window</span>
            <h3 className="font-serif text-lg font-normal text-[#23170F]">7 Full Days</h3>
            <p className="text-sm text-[#462F1D] font-light leading-relaxed">
              Your 7-day privilege commences at the exact moment the courier hands you the parcel at your doorstep.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5DCD2] shadow-2xs space-y-3">
            <span className="font-serif italic text-sm text-[#462F1D]">02. Doorstep</span>
            <h3 className="font-serif text-lg font-normal text-[#23170F]">At-Home Collection</h3>
            <p className="text-sm text-[#462F1D] font-light leading-relaxed">
              Zero transit hassle. Our courier rider arrives directly at your home or office address to inspect and retrieve the parcel.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5DCD2] shadow-2xs space-y-3">
            <span className="font-serif italic text-sm text-[#462F1D]">03. Settlement</span>
            <h3 className="font-serif text-lg font-normal text-[#23170F]">100% Cash / Bank Refund</h3>
            <p className="text-sm text-[#462F1D] font-light leading-relaxed">
              Full cash refunds are dispatched within 24 hours of collection via Bank Transfer (IBAN), EasyPaisa, or JazzCash.
            </p>
          </div>
        </div>

        {/* Step-by-Step Return Flow */}
        <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white border border-[#E5DCD2] shadow-xs space-y-6 sm:space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23170F] border-b border-[#E5DCD2] pb-4">
            How to Return or Exchange in 3 Simple Steps
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center text-sm font-serif shrink-0 mt-0.5">
                I
              </span>
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-serif font-normal text-[#23170F]">
                  Notify Concierge
                </h4>
                <p className="text-sm text-[#462F1D] font-light leading-relaxed">
                  Send a quick message to our concierge at <strong>+92 300 1234567</strong> or use our{" "}
                  <Link href="/track-order" className="text-[#462F1D] underline font-medium">
                    Track Order portal
                  </Link>{" "}
                  with your order number (e.g. <code>ANR-2026-1001</code>). Indicate whether you prefer a shade exchange or a full cash refund.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center text-sm font-serif shrink-0 mt-0.5">
                II
              </span>
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-serif font-normal text-[#23170F]">
                  Doorstep Courier Pickup Scheduled
                </h4>
                <p className="text-sm text-[#462F1D] font-light leading-relaxed">
                  Our dispatch team schedules a courier rider to pick up the bag from your provided address within 24–48 hours. Please enclose the bag in its original protective dust cover with all tags intact.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center text-sm font-serif shrink-0 mt-0.5">
                III
              </span>
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-serif font-normal text-[#23170F]">
                  Prompt Settlement or Exchange Dispatch
                </h4>
                <p className="text-sm text-[#462F1D] font-light leading-relaxed">
                  Upon verification at the atelier, your replacement bag is dispatched immediately, or your full refund is transferred to your bank account / mobile wallet within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-[#F5EFE8] border border-[#E5DCD2] space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#23170F]">
            Eligibility & Quality Preservation
          </h3>
          <p className="text-sm sm:text-base text-[#462F1D] font-light leading-relaxed">
            To ensure every Anora client receives brand-new, immaculate leather goods, returns must satisfy the following:
          </p>
          <ul className="space-y-3 text-sm text-[#23170F] font-light">
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#462F1D] shrink-0" />
              <span>Bag must be unworn, undamaged, and free of stains, scratches, or perfumes.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#462F1D] shrink-0" />
              <span>Must include the original satin dust bag and brand tags.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#462F1D] shrink-0" />
              <span>Request must be registered within 7 calendar days of delivery confirmation.</span>
            </li>
          </ul>
        </div>

        {/* FAQs */}
        <div id="faq" className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23170F]">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            <div className="p-6 rounded-2xl bg-white border border-[#E5DCD2] text-sm space-y-2">
              <h4 className="font-serif text-base font-normal text-[#23170F]">Can I inspect the bag before paying the rider?</h4>
              <p className="text-[#462F1D] font-light leading-relaxed">
                Yes. You are fully encouraged to inspect the exterior package and contents at the time of delivery before handing cash to the courier.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5DCD2] text-sm space-y-2">
              <h4 className="font-serif text-base font-normal text-[#23170F]">What if I paid cash on delivery and want a refund?</h4>
              <p className="text-[#462F1D] font-light leading-relaxed">
                Since payment was settled via Cash on Delivery, our team transfers your refund directly to your IBAN / Bank Account, EasyPaisa, or JazzCash immediately after the bag is collected.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5DCD2] text-sm space-y-2">
              <h4 className="font-serif text-base font-normal text-[#23170F]">Can I exchange for another color instead of a refund?</h4>
              <p className="text-[#462F1D] font-light leading-relaxed">
                Absolutely. If you ordered Rich Bordeaux and would prefer Alabaster Ivory or Espresso Tan, we will arrange a zero-hassle exchange.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#23170F] text-[#ECE2D8] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left border border-[#3D291B]">
          <div className="space-y-1.5">
            <h3 className="font-serif text-xl sm:text-2xl font-light text-white">Have a Question About Your Silhouette?</h3>
            <p className="text-sm text-[#ECE2D8]/90 font-light">
              Our concierge team is available 7 days a week on WhatsApp to assist you.
            </p>
          </div>
          <a
            href="https://wa.me/923001234567?text=Hi%20Anora%20Bags,%20I%20have%20a%20question%20regarding%20returns"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-[#ECE2D8] hover:bg-white text-[#23170F] text-xs sm:text-sm font-sans tracking-[0.14em] uppercase font-semibold transition shrink-0 shadow-sm"
          >
            Chat with Concierge
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
