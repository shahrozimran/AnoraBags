"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "./cart-context"
import { BrandLogo } from "./brand-logo"
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react"

export function Header() {
  const { itemCount, setIsOpen } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#23170F] text-[#ECE2D8] text-xs font-sans py-2 px-3 sm:px-4 border-b border-[#3D291B]/60 select-none overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block text-[#ECE2D8]/85 font-normal">
            Maison Anora · Full-Grain Calfskin Leather
          </span>
          <div className="flex-1 text-center font-normal truncate px-2 min-w-0">
            <span className="truncate inline-block max-w-full text-xs">
              Cash on Delivery Nationwide <span className="opacity-40 mx-1.5">·</span> Doorstep Inspection <span className="opacity-40 mx-1.5">·</span> 7-Day Returns
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#ECE2D8]/85 hover:text-white transition font-normal text-xs">
            <Link href="/track-order" className="hover-editorial-line">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#E5DCD2] py-2.5 sm:py-3 shadow-xs"
            : "bg-[#FAF6F1]/90 backdrop-blur-xs border-b border-[#E5DCD2]/60 py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#462F1D] hover:text-[#23170F] focus:outline-hidden transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Left Category Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-[#23170F]/80">
            <Link
              href="/shop"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              Collection
            </Link>
            <Link
              href="/shop?category=crossbody"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              Crossbody
            </Link>
            <Link
              href="/shop?category=satchel"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              Satchels
            </Link>
            <Link
              href="/shop?category=top-handle"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              Top-Handle
            </Link>
            <Link
              href="/#studio3d"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1 flex items-center gap-1.5"
            >
              <span>3D Studio</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] font-sans font-medium">
                360°
              </span>
            </Link>
          </nav>

          {/* Centered Brand Mark */}
          <Link href="/" className="flex flex-col items-center group py-0.5" aria-label="Anora Bags Home">
            <BrandLogo size="md" showTagline={true} variant="dark" />
          </Link>

          {/* Right Action Icons & Editorial Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#23170F]/80">
              <Link
                href="/about"
                className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
              >
                Contact
              </Link>
            </nav>

            <Link
              href="/track-order"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-[#3D291B] hover:text-[#462F1D] hover-editorial-line transition"
            >
              Track Order
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full text-[#23170F] hover:bg-[#ECE2D8]/50 transition-all duration-200 focus:outline-hidden flex items-center gap-2 group"
              aria-label={`Open shopping bag with ${itemCount} items`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#462F1D] group-hover:scale-105 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#462F1D] text-[#ECE2D8] text-[10px] font-sans font-bold flex items-center justify-center leading-none ring-2 ring-[#FAF6F1] shadow-xs">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-[#462F1D]">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5DCD2] bg-[#FAF6F1] px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-300 shadow-xl">
            <nav className="flex flex-col space-y-1 text-sm font-medium text-[#23170F]">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>All Handbags</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/shop?category=crossbody"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Crossbody Bags</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/shop?category=satchel"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Satchels</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/shop?category=top-handle"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Top-Handle Handbags</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/#studio3d"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between text-[#462F1D]"
              >
                <span>3D Interactive Studio</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] font-medium">
                  360°
                </span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Our Story & Atelier</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Client Concierge</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Track Order (COD)</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>
            </nav>

            <div className="pt-3 border-t border-[#E5DCD2]">
              <div className="p-4 rounded-xl bg-[#ECE2D8]/40 border border-[#E5DCD2] space-y-1">
                <p className="font-serif italic text-base text-[#462F1D]">The Anora Assurance</p>
                <p className="text-xs sm:text-sm font-normal text-[#5A4333] leading-relaxed">
                  100% Cash on Delivery nationwide. Inspect your parcel at your doorstep before payment, with 7-day hassle-free returns.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

