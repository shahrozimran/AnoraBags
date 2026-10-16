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
      <div className="bg-[#23170F] text-[#ECE2D8] text-[10px] sm:text-xs font-sans tracking-[0.08em] sm:tracking-[0.12em] uppercase py-2 px-3 sm:px-4 border-b border-[#3D291B]/60 select-none overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block opacity-85 font-normal">
            Maison Anora • Pure Full-Grain Calfskin
          </span>
          <div className="flex-1 text-center font-normal truncate px-1 min-w-0">
            <span className="truncate inline-block max-w-full">
              Complimentary Cash On Delivery <span className="opacity-50 mx-1.5">•</span> 7-Day Privilege
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 opacity-85 hover:opacity-100 transition font-normal">
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
            ? "bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#E5DCD2] py-2.5 sm:py-3 shadow-xs"
            : "bg-[#FAF6F1]/85 backdrop-blur-xs border-b border-[#E5DCD2]/50 py-3 sm:py-4"
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

          {/* Left Editorial Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs lg:text-sm tracking-[0.14em] font-medium uppercase text-[#3D291B]">
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] tracking-wider font-sans font-semibold">
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
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/track-order"
              className="hidden sm:inline-block text-xs lg:text-sm tracking-[0.14em] font-medium uppercase text-[#3D291B] hover:text-[#462F1D] hover-editorial-line transition"
            >
              Track Order
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full text-[#23170F] hover:bg-[#ECE2D8]/50 transition-all duration-200 focus:outline-hidden flex items-center gap-2 group"
              aria-label={`Open shopping bag with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-[#462F1D] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs lg:text-sm tracking-[0.14em] font-medium uppercase text-[#462F1D]">
                Bag
              </span>
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#462F1D] text-[#ECE2D8] text-xs font-semibold flex items-center justify-center shrink-0">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5DCD2] bg-[#FAF6F1] px-6 py-8 space-y-6 animate-in slide-in-from-top-2 duration-300 shadow-xl">
            <nav className="flex flex-col space-y-4 text-sm tracking-[0.14em] uppercase font-medium text-[#23170F]">
              <Link
                href="/#collection"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>The Bag Collection</span>
                <ArrowUpRight className="w-4 h-4 opacity-60" />
              </Link>
              <Link
                href="/#studio3d"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between text-[#462F1D]"
              >
                <span>3D Interactive Atelier</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] font-semibold">
                  360°
                </span>
              </Link>
              <Link
                href="/refund-policy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>7-Day Return Privilege</span>
                <ArrowUpRight className="w-4 h-4 opacity-60" />
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 border-b border-[#E5DCD2]/70 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>Track Parcel (COD)</span>
                <ArrowUpRight className="w-4 h-4 opacity-60" />
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 flex items-center justify-between hover:text-[#462F1D]"
              >
                <span>About The Maison</span>
                <ArrowUpRight className="w-4 h-4 opacity-60" />
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#E5DCD2]">
              <div className="p-4 rounded-2xl bg-[#ECE2D8]/40 border border-[#E5DCD2] space-y-1.5">
                <p className="font-serif italic text-base text-[#462F1D]">The Anora Assurance</p>
                <p className="text-sm font-normal text-[#5A4333] leading-relaxed">
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

