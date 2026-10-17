import React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import { CartDrawer } from "@/components/anora/cart-drawer"
import { ShieldCheck, Banknote, Sparkles, Heart, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Anora Bags — Bags For Every You | Handcrafted Luxury",
  description:
    "Discover the story of Anora Bags. Handcrafted luxury leather goods engineered for modern everyday elegance. 100% Cash On Delivery nationwide in Pakistan & 7-Day Doorstep Guarantee.",
  alternates: {
    canonical: "https://anorabags.com/about"
  },
  openGraph: {
    title: "About Anora Bags — Timeless Style, Modern You",
    description: "Handcrafted luxury leather goods engineered for modern everyday elegance.",
    url: "https://anorabags.com/about",
    siteName: "Anora Bags",
    locale: "en_PK",
    type: "website"
  }
}

export default function AboutPage() {
  const aboutSchema = {
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
            "name": "About Maison Anora",
            "item": "https://anorabags.com/about"
          }
        ]
      },
      {
        "@type": "AboutPage",
        "name": "About Anora Bags",
        "url": "https://anorabags.com/about",
        "description": "The story, craft, and architectural minimalism behind Anora Bags."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <Header />
      <CartDrawer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[#462F1D]/40" />
            <span className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase font-semibold text-[#462F1D]">
              The House of Anora • Atelier Édition
            </span>
            <span className="h-px w-6 bg-[#462F1D]/40" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#23170F] leading-tight">
            Sculpted Simplicity, <br />
            <span className="italic font-normal text-[#462F1D]">Modern You.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#462F1D] font-light max-w-xl mx-auto leading-relaxed">
            Anora was born from a resolute desire: to craft handbags that elevate everyday living with architectural restraint, bespoke full-grain calfskin, and uncompromising integrity.
          </p>
        </div>

        {/* Featured Visual */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm border border-[#E5DCD2] bg-[#F5EFE8]">
          <Image
            src="/images/products/bordeaux-crossbody-lifestyle.jpeg"
            alt="Anora Atelier Handbag Lifestyle"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#23170F]/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-serif italic text-lg sm:text-xl lg:text-2xl text-[#ECE2D8]">
              "Architectural form meets tactile softness."
            </span>
            <span className="text-xs text-white/80 font-sans tracking-[0.16em] uppercase font-medium">
              Maison Anora Atelier
            </span>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E5DCD2] shadow-2xs space-y-8">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23170F]">
              The Architecture of Confidence
            </h2>
            <p className="text-sm sm:text-base text-[#462F1D] font-light leading-relaxed">
              We reject the fast-fashion cycle of transient novelty. Every Anora silhouette is engineered to be an anchor in your capsule wardrobe. Whether stepping into a high-stakes presentation or enjoying a relaxed weekend brunch, your Anora bag holds your essentials with graceful poise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E5DCD2]">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-sans font-semibold tracking-wider text-[#462F1D] bg-[#ECE2D8] px-2.5 py-0.5 rounded-full border border-[#462F1D]/20">01</span>
                <span className="text-xs font-sans uppercase tracking-wider text-[#462F1D] font-semibold">Leather</span>
              </div>
              <h4 className="font-serif text-lg font-normal text-[#23170F]">
                Full-Grain Drum-Dyed Calfskin
              </h4>
              <p className="text-sm text-[#462F1D] font-light leading-relaxed">
                Tanned using traditional artisanal methods. Our leather resists daily abrasion while developing a rich, supple patina over years of companionship.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-sans font-semibold tracking-wider text-[#462F1D] bg-[#ECE2D8] px-2.5 py-0.5 rounded-full border border-[#462F1D]/20">02</span>
                <span className="text-xs font-sans uppercase tracking-wider text-[#462F1D] font-semibold">Privilege</span>
              </div>
              <h4 className="font-serif text-lg font-normal text-[#23170F]">
                7-Day Unconditional Privilege
              </h4>
              <p className="text-sm text-[#462F1D] font-light leading-relaxed">
                We believe trust is earned at your doorstep. Inspect your bag in person. If it doesn't surpass your expectations, our concierge collects it for an instant refund.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] text-xs sm:text-sm font-sans tracking-[0.14em] uppercase font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span>Explore The Permanent Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
