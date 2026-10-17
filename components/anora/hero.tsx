"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Box,
  ShieldCheck,
  Sparkles,
  Check
} from "lucide-react"

const Bag3DCanvas = dynamic(
  () => import("./bag-3d-canvas").then((m) => m.Bag3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[440px] flex flex-col items-center justify-center bg-[#FAF6F1] rounded-2xl sm:rounded-3xl border border-[#E5DCD2] gap-3">
        <div className="w-7 h-7 border-2 border-[#462F1D] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-[#462F1D] font-sans tracking-[0.18em] uppercase">
          Initializing 3D Atelier...
        </span>
      </div>
    )
  }
)

export interface HeroVisual {
  id: string
  title: string
  subtitle: string
  price: string
  originalPrice?: string
  badge: string
  image: string
  alt: string
  productUrl: string
  colorName: string
  colorHex: string
}

const HERO_VISUALS: HeroVisual[] = [
  {
    id: "bordeaux-hero",
    title: "The Anora Bordeaux Flap Crossbody",
    subtitle: "Pebbled Calfskin with 18k Brushed Gold Clasp",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Signature Bestseller",
    image: "/images/products/bordeaux-crossbody-hero.jpeg",
    alt: "The Anora Bags Signature Bordeaux Flap Crossbody in rich wine pebbled calfskin",
    productUrl: "/product/the-anora-bordeaux-flap-crossbody",
    colorName: "Rich Bordeaux Wine",
    colorHex: "#4A1525"
  },
  {
    id: "bordeaux-model",
    title: "Maison Anora Editorial Lookbook",
    subtitle: "Campaign 2026 • Parisian Silhouette On-Model",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Campaign Lookbook",
    image: "/images/products/bordeaux-crossbody-model.jpeg",
    alt: "Editorial model carrying the Anora Bordeaux Flap Crossbody bag",
    productUrl: "/product/the-anora-bordeaux-flap-crossbody",
    colorName: "Rich Bordeaux Wine",
    colorHex: "#4A1525"
  },
  {
    id: "dua-satchel",
    title: "The Anora Dua Satchel",
    subtitle: "Dual-Tone Italian Espresso & Saddle Cognac",
    price: "Rs. 8,490",
    originalPrice: "Rs. 10,990",
    badge: "Limited Artisan Drop",
    image: "/images/products/cognac-espresso-satchel.jpeg",
    alt: "The Anora Dua Satchel in espresso brown and cognac tan with rolled top handle",
    productUrl: "/product/the-anora-dua-satchel",
    colorName: "Espresso & Cognac Tan",
    colorHex: "#3D251E"
  },
  {
    id: "ivory-top-handle",
    title: "The Petit Ivory Top-Handle",
    subtitle: "Sculptural Alabaster Smooth Calfskin & Silver Lock",
    price: "Rs. 7,290",
    originalPrice: "Rs. 9,490",
    badge: "New Arrival",
    image: "/images/products/ivory-top-handle.jpeg",
    alt: "The Petit Ivory Top-Handle Handbag with high-polish palladium hardware",
    productUrl: "/product/the-anora-petit-ivory-handbag",
    colorName: "Alabaster Ivory Cream",
    colorHex: "#F5F0E6"
  },
  {
    id: "bordeaux-lifestyle",
    title: "Artisanal Edge & Dual Chain",
    subtitle: "Solid Brass Ring-Lock Clasp & Microfiber Interior",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Atelier Details",
    image: "/images/products/bordeaux-crossbody-lifestyle.jpeg",
    alt: "Close-up craftsmanship details of the Anora Bordeaux Flap Crossbody",
    productUrl: "/product/the-anora-bordeaux-flap-crossbody",
    colorName: "Rich Bordeaux Wine",
    colorHex: "#4A1525"
  },
  {
    id: "bordeaux-interior",
    title: "Bespoke Accordion Architecture",
    subtitle: "Triple Bellows Compartments with Center Security Zip",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Capacity & Interior",
    image: "/images/products/bordeaux-crossbody-interior.jpeg",
    alt: "Interior triple accordion compartments of the Anora Crossbody bag",
    productUrl: "/product/the-anora-bordeaux-flap-crossbody",
    colorName: "Rich Bordeaux Wine",
    colorHex: "#4A1525"
  }
]

export function Hero() {
  const [viewMode, setViewMode] = useState<"photo" | "3d">("photo")
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartXRef = useRef<number | null>(null)
  const touchDeltaXRef = useRef<number>(0)

  const activeVisual = HERO_VISUALS[activeIdx]

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % HERO_VISUALS.length)
  }, [])

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + HERO_VISUALS.length) % HERO_VISUALS.length)
  }, [])

  // Auto-advance photos every 6 seconds when not paused or in 3D mode
  useEffect(() => {
    if (viewMode === "3d" || isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [viewMode, isPaused, nextSlide])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode === "3d") return
    touchStartXRef.current = e.touches[0].clientX
    touchDeltaXRef.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (viewMode === "3d" || touchStartXRef.current === null) return
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current
  }

  const handleTouchEnd = () => {
    if (viewMode === "3d" || touchStartXRef.current === null) return
    if (touchDeltaXRef.current > 45) {
      prevSlide()
    } else if (touchDeltaXRef.current < -45) {
      nextSlide()
    }
    touchStartXRef.current = null
    touchDeltaXRef.current = 0
  }

  return (
    <section
      className="relative overflow-hidden bg-[#FAF6F1] pt-3 pb-8 sm:pt-6 sm:pb-12 md:pt-8 md:pb-16 border-b border-[#E5DCD2]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ECE2D8]/45 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[420px] h-[420px] rounded-full bg-[#462F1D]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header Bar Above Stage */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4 pb-2 border-b border-[#E5DCD2]/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#462F1D]" />
            <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
              Maison Anora · Autumn / Winter 2026
            </span>
          </div>

          {/* Mode Switcher: Editorial Lookbook vs 3D Orbit */}
          <div className="inline-flex items-center rounded-full bg-[#ECE2D8]/80 p-1 text-xs font-medium text-[#462F1D] self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setViewMode("photo")}
              className={`px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 text-xs font-medium flex items-center gap-1.5 ${
                viewMode === "photo"
                  ? "bg-white text-[#23170F] shadow-xs font-semibold"
                  : "hover:text-[#23170F]"
              }`}
            >
              <span>Editorial Lookbook</span>
              <span className="text-[11px] opacity-70">({HERO_VISUALS.length})</span>
            </button>

            <button
              onClick={() => setViewMode("3d")}
              className={`px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 text-xs font-medium flex items-center gap-1.5 ${
                viewMode === "3d"
                  ? "bg-[#462F1D] text-[#FAF6F1] shadow-xs font-semibold"
                  : "hover:text-[#23170F]"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Interactive 3D</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#ECE2D8] text-[#462F1D] font-bold">
                360°
              </span>
            </button>
          </div>
        </div>

        {/* Cinematic Product Visual Stage */}
        <div
          className="relative h-[420px] xs:h-[480px] sm:h-[540px] md:h-[620px] lg:h-[680px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8] shadow-sm select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {viewMode === "photo" ? (
            <div className="relative w-full h-full group">
              {/* Product Hero Image */}
              <Image
                key={activeVisual.id}
                src={activeVisual.image}
                alt={activeVisual.alt}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
              />

              {/* Luxury Vignette & Depth Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#23170F]/90 via-[#23170F]/20 to-[#23170F]/30 pointer-events-none" />

              {/* Top Editorial Floating Badges */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 z-10">
                <span className="text-xs font-medium text-white/95 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xs">
                  Fig. 0{activeIdx + 1} · {activeVisual.badge}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/90 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/40"
                    style={{ backgroundColor: activeVisual.colorHex }}
                  />
                  <span>{activeVisual.colorName}</span>
                </span>
              </div>

              {/* Top-Right Quick 3D Switch Pill */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
                <button
                  onClick={() => setViewMode("3d")}
                  className="flex items-center gap-1.5 text-xs font-sans font-medium text-white bg-black/45 hover:bg-[#462F1D] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition-all duration-300 shadow-xs"
                >
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Inspect in 3D</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] font-bold">
                    360°
                  </span>
                </button>
              </div>

              {/* Prev / Next Slide Arrows */}
              <button
                onClick={prevSlide}
                aria-label="Previous product visual"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-white text-white hover:text-[#23170F] backdrop-blur-md border border-white/20 hover:border-white flex items-center justify-center transition-all duration-300 shadow-md z-10 group"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next product visual"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-white text-white hover:text-[#23170F] backdrop-blur-md border border-white/20 hover:border-white flex items-center justify-center transition-all duration-300 shadow-md z-10 group"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Bottom Minimalist Floating Editorial Card */}
              <div className="absolute bottom-3 inset-x-3 sm:bottom-6 sm:inset-x-6 z-10">
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#23170F]/70 backdrop-blur-md border border-white/20 text-[#FAF6F1] shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                    {/* Minimalist Title & Price */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#ECE2D8]">
                          {activeVisual.badge}
                        </span>
                        <span className="text-[#ECE2D8]/40">·</span>
                        <span className="text-xs text-[#ECE2D8]/80 font-normal">
                          100% Cash On Delivery
                        </span>
                      </div>

                      <h1 className="font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-light text-white truncate">
                        {activeVisual.title}
                      </h1>

                      <p className="text-xs sm:text-sm text-[#ECE2D8]/85 font-light line-clamp-1">
                        {activeVisual.subtitle}
                      </p>
                    </div>

                    {/* Price & Primary Call To Action */}
                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t border-white/10 md:border-t-0">
                      <div className="text-left md:text-right">
                        <div className="font-sans text-lg sm:text-2xl font-semibold text-white tabular-nums">
                          {activeVisual.price}
                        </div>
                        {activeVisual.originalPrice && (
                          <div className="text-xs text-white/50 line-through">
                            {activeVisual.originalPrice}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={activeVisual.productUrl}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#FAF6F1] hover:bg-white text-[#23170F] text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 group shrink-0"
                        >
                          <span>Discover Bag</span>
                          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        <Link
                          href="/shop"
                          className="hidden sm:inline-flex px-4 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-medium transition border border-white/20 shrink-0"
                        >
                          All Bags
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 3D WebGL Spatial Orbit Stage */
            <div className="relative w-full h-full">
              <Bag3DCanvas
                initialColor="#462F1D"
                interactive={true}
                className="w-full h-full"
                showControls={true}
              />

              {/* Close 3D / Return to Photography Button */}
              <button
                onClick={() => setViewMode("photo")}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 px-3.5 py-1.5 rounded-full bg-white/95 text-[#23170F] hover:bg-white text-xs font-medium border border-[#E5DCD2] shadow-md transition"
              >
                Back to Lookbook
              </button>
            </div>
          )}
        </div>

        {/* Interactive Visual Thumbnail Strip */}
        <div className="mt-4 sm:mt-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-sans text-[#462F1D] font-medium">
              Select silhouette:
            </span>
            <div className="flex items-center gap-1 text-xs text-[#462F1D]/80 font-sans">
              <span>{activeIdx + 1}</span>
              <span>/</span>
              <span>{HERO_VISUALS.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {HERO_VISUALS.map((item, idx) => {
              const isActive = viewMode === "photo" && activeIdx === idx
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveIdx(idx)
                    setViewMode("photo")
                  }}
                  className={`group relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 text-left cursor-pointer ${
                    isActive
                      ? "border-[#462F1D] ring-2 ring-[#462F1D]/30 scale-102 shadow-sm"
                      : "border-[#E5DCD2] opacity-75 hover:opacity-100 hover:border-[#462F1D]/50"
                  }`}
                  title={item.title}
                  aria-label={`View ${item.title}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 transition-opacity ${
                      isActive ? "bg-transparent" : "bg-black/15 group-hover:bg-transparent"
                    }`}
                  />
                  <div className="absolute bottom-1 right-1 px-1 rounded-sm bg-black/60 text-[9px] text-white font-sans font-medium">
                    0{idx + 1}
                  </div>
                </button>
              )
            })}

            {/* 3D Interactive Thumbnail Button */}
            <button
              onClick={() => setViewMode("3d")}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                viewMode === "3d"
                  ? "border-[#462F1D] bg-[#462F1D] text-[#FAF6F1] ring-2 ring-[#462F1D]/30 shadow-sm"
                  : "border-[#E5DCD2] bg-[#ECE2D8]/50 hover:bg-[#ECE2D8] text-[#462F1D]"
              }`}
              title="Launch 3D Interactive Atelier"
              aria-label="Launch 3D Interactive Atelier"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[10px] font-sans font-semibold">
                3D Orbit
              </span>
            </button>
          </div>
        </div>

        {/* Minimal Understated Luxury Trust Ledger */}
        <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-[#E5DCD2] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-[#23170F]">
          <div className="flex items-center gap-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-medium text-[#23170F] truncate">
                100% Cash On Delivery
              </span>
              <span className="text-xs text-[#462F1D]/80 block truncate">
                Nationwide across Pakistan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-medium text-[#23170F] truncate">
                Doorstep Inspection
              </span>
              <span className="text-xs text-[#462F1D]/80 block truncate">
                Verify before payment
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-medium text-[#23170F] truncate">
                7-Day Home Privilege
              </span>
              <span className="text-xs text-[#462F1D]/80 block truncate">
                Hassle-free doorstep returns
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-medium text-[#23170F] truncate">
                Full-Grain Calfskin
              </span>
              <span className="text-xs text-[#462F1D]/80 block truncate">
                18k brushed gold hardware
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
