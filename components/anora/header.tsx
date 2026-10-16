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
      {/* Top Quiet Luxury Announcement Bar */}
      <div className="bg-[#23170F] text-[#ECE2D8] text-[10px] sm:text-[11px] font-sans tracking-[0.26em] uppercase py-2.5 px-4 border-b border-[#3D291B]/60 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block opacity-75">
            Maison Anora • Pure Full-Grain Calfskin
          </span>
          <div className="flex-1 text-center font-normal">
            <span>Complimentary Cash On Delivery Nationwide</span>
            <span className="mx-2.5 opacity-40">•</span>
            <span className="text-[#ECE2D8] font-medium">7-Day Home Privilege</span>
          </div>
          <div className="hidden md:flex items-center gap-4 opacity-75 hover:opacity-100 transition">
            <Link href="/track-order" className="hover-editorial-line">
              Track Parcel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#E5DCD2] py-2.5 shadow-xs"
            : "bg-[#FAF6F1]/85 backdrop-blur-xs border-b border-[#E5DCD2]/50 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#462F1D] hover:text-[#23170F] focus:outline-hidden transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Left Editorial Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.24em] font-medium uppercase text-[#5A4333]">
            <Link
              href="/#collection"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              Collection
            </Link>
            <Link
              href="/#studio3d"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1 flex items-center gap-1.5"
            >
              <span>3D Atelier</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] tracking-widest font-sans font-semibold">
                360°
              </span>
            </Link>
            <Link
              href="/refund-policy"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              7-Day Privilege
            </Link>
            <Link
              href="/about"
              className="hover:text-[#462F1D] transition-colors hover-editorial-line py-1"
            >
              The Maison
            </Link>
          </nav>

          {/* Centered Brand Mark */}
          <Link href="/" className="flex flex-col items-center group py-0.5" aria-label="Anora Bags Home">
            <BrandLogo size="md" showTagline={true} variant="dark" />
          </Link>

          {/* Right Action Icons & Bag Drawer */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/track-order"
              className="hidden sm:inline-block text-[11px] tracking-[0.2em] font-medium uppercase text-[#5A4333] hover:text-[#462F1D] hover-editorial-line transition"
            >
              Track Order
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full text-[#23170F] hover:bg-[#ECE2D8]/50 transition-all duration-200 focus:outline-hidden flex items-center gap-2 group"
              aria-label={`Open shopping bag with ${itemCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#462F1D] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-[11px] tracking-[0.2em] font-medium uppercase text-[#462F1D]">
                Bag
              </span>
              {itemCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#462F1D] text-[#ECE2D8] text-[10px] font-medium flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5DCD2] bg-[#FAF6F1] px-6 py-8 space-y-6 animate-in slide-in-from-top-2 duration-300 shadow-xl">
            <nav className="flex flex-col space-y-4 text-xs tracking-[0.24em] uppercase font-medium text-[#23170F]">
              <Link
                href="/#collection"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>The Bag Collection</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
              </Link>
              <Link
                href="/#studio3d"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 border-b border-[#E5DCD2]/70 flex items-center justify-between text-[#462F1D]"
              >
                <span>3D Interactive Atelier</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D]">
                  360°
                </span>
              </Link>
              <Link
                href="/refund-policy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>7-Day Return Privilege</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Track Parcel (COD)</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>About The Maison</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#E5DCD2]">
              <div className="p-4 rounded-2xl bg-[#ECE2D8]/30 border border-[#E5DCD2] text-xs text-[#5A4333] space-y-1">
                <p className="font-serif italic text-sm text-[#462F1D]">The Anora Assurance</p>
                <p className="text-[11px] font-light leading-relaxed">
                  100% Cash On Delivery nationwide. Inspect your parcel at your doorstep prior to payment.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

