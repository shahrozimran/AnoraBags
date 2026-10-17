"use client"

import React from "react"
import Link from "next/link"
import { BrandLogo } from "./brand-logo"

export function Footer() {
  return (
    <footer className="bg-[#1A110B] text-[#ECE2D8] pt-20 pb-12 border-t border-[#3D291B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Assurance Ledger */}
        <div className="pb-16 border-b border-[#3D291B]/80 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-sans font-semibold tracking-wider text-[#C5A880] bg-[#2E1E14] px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 shrink-0">
                01
              </span>
              <h4 className="text-sm sm:text-base font-medium text-white">
                7-Day Home Privilege
              </h4>
            </div>
            <p className="text-sm text-[#ECE2D8]/85 font-light leading-relaxed">
              Take 7 full days to try the silhouette with your wardrobe. If not delighted, we arrange doorstep pickup and refund your cash.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-sans font-semibold tracking-wider text-[#C5A880] bg-[#2E1E14] px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 shrink-0">
                02
              </span>
              <h4 className="text-sm sm:text-base font-medium text-white">
                100% Cash On Delivery
              </h4>
            </div>
            <p className="text-sm text-[#ECE2D8]/85 font-light leading-relaxed">
              Zero advance payment or cards required. Inspect your parcel condition at your doorstep and settle cash directly with the courier.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-sans font-semibold tracking-wider text-[#C5A880] bg-[#2E1E14] px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 shrink-0">
                03
              </span>
              <h4 className="text-sm sm:text-base font-medium text-white">
                Archival Presentation
              </h4>
            </div>
            <p className="text-sm text-[#ECE2D8]/85 font-light leading-relaxed">
              Every bag is hand-inspected and enclosed in a rigid keepsake box, protective microfiber dustbag, and inspection certificate.
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block group">
              <BrandLogo size="md" showTagline={true} variant="light" />
            </Link>

            <p className="text-sm text-[#ECE2D8]/80 font-light max-w-sm leading-relaxed">
              Bespoke luxury leather goods crafted with quiet geometry and architectural discipline. Available nationwide through our signature Cash on Delivery privilege.
            </p>

            <div className="pt-2 text-sm text-[#ECE2D8]/90 space-y-1 font-light">
              <p>Maison Concierge: concierge@anorabags.com</p>
              <p>Direct WhatsApp: +92 300 1234567</p>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-white">
              Collections
            </h5>
            <ul className="space-y-3 text-sm text-[#ECE2D8]/80 font-light">
              <li>
                <Link href="/product/the-anora-bordeaux-flap-crossbody" className="hover-editorial-line hover:text-white transition">
                  The Bordeaux Flap
                </Link>
              </li>
              <li>
                <Link href="/product/the-anora-dua-satchel" className="hover-editorial-line hover:text-white transition">
                  The Dua Satchel
                </Link>
              </li>
              <li>
                <Link href="/product/the-anora-petit-ivory-handbag" className="hover-editorial-line hover:text-white transition">
                  The Petit Ivory
                </Link>
              </li>
              <li>
                <Link href="/product/the-anora-noir-crossbody" className="hover-editorial-line hover:text-white transition">
                  The Noir Flap
                </Link>
              </li>
              <li>
                <Link href="/#studio3d" className="hover-editorial-line text-[#ECE2D8] transition">
                  3D Spatial Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Privileges */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-white">
              Client Services
            </h5>
            <ul className="space-y-3 text-sm text-[#ECE2D8]/80 font-light">
              <li>
                <Link href="/refund-policy" className="hover-editorial-line hover:text-white transition">
                  7-Day Return Privilege
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover-editorial-line hover:text-white transition">
                  Track Parcel (COD)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover-editorial-line hover:text-white transition">
                  The Maison Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover-editorial-line hover:text-white transition">
                  Private Concierge
                </Link>
              </li>
              <li>
                <Link href="/refund-policy#faq" className="hover-editorial-line hover:text-white transition">
                  Delivery & Inspection FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms & Guarantees */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-white">
              Assurance
            </h5>
            <ul className="space-y-3 text-sm text-[#ECE2D8]/80 font-light">
              <li>Payment: 100% Cash On Delivery</li>
              <li>Shipping: Free Express Nationwide</li>
              <li>Returns: 7-Day Doorstep Pickup</li>
              <li>Hardware: 18k Brushed Gold Core</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#3D291B] text-xs font-sans text-[#ECE2D8]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Maison Anora Bags. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-[#ECE2D8]/85 text-xs font-normal">
            <Link href="/refund-policy" className="hover:text-white transition whitespace-nowrap">
              7-Day Privilege
            </Link>
            <span className="hidden sm:inline opacity-40">·</span>
            <span className="whitespace-nowrap">Cash On Delivery Nationwide</span>
            <span className="hidden sm:inline opacity-40">·</span>
            <Link href="/contact" className="hover:text-white transition whitespace-nowrap">
              Concierge
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

