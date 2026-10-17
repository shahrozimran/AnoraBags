"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react"
import { useCart } from "./cart-context"
import { BrandLogo } from "./brand-logo"
import { COLLECTIONS } from "@/lib/site-config"

const navigationLinks = [
  { label: "Shop All", href: "/shop" },
  ...COLLECTIONS,
]
const storyLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
]
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#77573E]"

export function Header() {
  const { itemCount, setIsOpen } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isMobileMenuOpen])

  return (
    <>
      <div className="border-b border-white/5 bg-[#2A1D14] text-[#F1E7DC]">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-center px-5 py-2 text-center sm:px-8">
          <p className="text-[10px] tracking-[0.08em] text-[#D3C0AD]">
            Anora Bags <span className="mx-2 text-[#A2876C]" aria-hidden="true">/</span> Full-Grain Calfskin Leather
          </p>
        </div>
      </div>

      <header className={`sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ${isScrolled ? "border-[#DCCFC2] bg-[#FAF6F1]/95 shadow-[0_4px_24px_-16px_rgba(46,31,20,0.3)] backdrop-blur-xl" : "border-[#E6DCD2] bg-[#FAF6F1]"}`}>
        <div className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 transition-[height] duration-300 sm:px-8 ${isScrolled ? "h-[76px] sm:h-[84px]" : "h-[80px] sm:h-[100px]"}`}>
          <div className="min-w-0 justify-self-start">
            <button type="button" onClick={() => setIsMobileMenuOpen(open => !open)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD0C3] text-[#462F1D] transition-colors hover:bg-[#EDE2D7] lg:hidden ${focusStyle}`}>
              {isMobileMenuOpen ? <X className="h-[18px] w-[18px]" aria-hidden="true" /> : <Menu className="h-[18px] w-[18px]" aria-hidden="true" />}
            </button>

            <nav aria-label="Collections" className="hidden items-center gap-1 whitespace-nowrap text-[13px] font-medium lg:flex xl:gap-2">
              {navigationLinks.map(({ label, href }, index) => (
                <Link key={href} href={href}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 transition-colors ${index === 0 ? "bg-[#39291D] text-[#FFF9F3] hover:bg-[#553C28]" : "text-[#654F3E] hover:bg-[#EDE2D7] hover:text-[#302217]"} ${focusStyle}`}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" aria-label="Anora Bags Home" className={`group flex flex-col items-center justify-center rounded-sm px-3 py-1 ${focusStyle}`}>
            <BrandLogo size="md" showTagline variant="dark" />
          </Link>

          <div className="flex items-center gap-4 justify-self-end sm:gap-6">
            <nav aria-label="About Anora" className="hidden items-center gap-5 text-[13px] font-medium text-[#654F3E] lg:flex xl:gap-7">
              {storyLinks.map(({ label, href }) => (
                <Link key={href} href={href} className={`py-2 transition-colors hover:text-[#23170F] ${focusStyle}`}>
                  {label}
                </Link>
              ))}
            </nav>
            <span className="hidden h-5 w-px bg-[#DDCEC0] lg:block" aria-hidden="true" />
            <button type="button" onClick={() => setIsOpen(true)}
              aria-label={`Open shopping bag with ${itemCount} items`}
              className={`group inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-[#D5C4B3] bg-[#F5EDE4]/60 px-3.5 text-[#39291D] transition-colors hover:border-[#A88B70] hover:bg-[#EDE2D7] sm:px-4 ${focusStyle}`}>
              <span className="relative">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
                {itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#39291D] px-1 text-[9px] font-semibold text-white ring-2 ring-[#FAF6F1] sm:hidden">{itemCount}</span>}
              </span>
              <span className="hidden text-[13px] font-medium sm:inline">Bag</span>
              <span className="hidden h-5 min-w-5 items-center justify-center rounded-full bg-[#E6D9CB] px-1 text-[10px] font-semibold sm:flex" aria-hidden="true">{itemCount}</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-[#DCCFC2] bg-[#FAF6F1] px-5 pb-6 pt-2 shadow-[0_20px_30px_-25px_rgba(46,31,20,0.45)] sm:px-8 lg:hidden">
            <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl">
              <p className="pb-3 pt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#947B64]">Explore Anora</p>
              {navigationLinks.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between border-b border-[#E5D9CD] py-4 text-sm font-medium text-[#39291D] ${focusStyle}`}>
                  {label}<ArrowUpRight className="h-4 w-4 text-[#947B64]" aria-hidden="true" />
                </Link>
              ))}
              <div className="flex gap-7 pt-5">
                {storyLinks.map(({ label, href }) => (
                  <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className={`py-2 text-sm text-[#74604F] hover:text-[#39291D] ${focusStyle}`}>{label}</Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
