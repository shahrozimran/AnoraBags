"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Box,
  ArrowUpRight,
  Layers,
  Sparkles
} from "lucide-react"

const Bag3DCanvas = dynamic(
  () => import("./bag-3d-canvas").then((m) => m.Bag3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-[#FAF6F1] rounded-2xl sm:rounded-3xl border border-[#E5DCD2] gap-3">
        <div className="w-7 h-7 border-2 border-[#462F1D] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-[#462F1D] font-sans">
          Initializing 3D Studio...
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
    alt: "The Anora Bags Signature Bordeaux Flap Crossbody on marble with baby's breath flowers and silk",
    productUrl: "/product/the-anora-bordeaux-flap-crossbody",
    colorName: "Rich Bordeaux Wine",
    colorHex: "#4A1525"
  },
  {
    id: "bordeaux-model",
    title: "Anora Bags Editorial Lookbook",
    subtitle: "Campaign 2026 • Parisian Silhouette On-Model",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Campaign Lookbook",
    image: "/images/products/bordeaux-crossbody-model.jpeg",
    alt: "Editorial fashion model wearing the Anora Bordeaux Flap Crossbody with gold chain",
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
    badge: "Limited Drop",
    image: "/images/products/cognac-espresso-satchel.jpeg",
    alt: "The Anora Dua Satchel in espresso brown and saddle cognac with rolled top handle",
    productUrl: "/product/the-anora-dua-satchel",
    colorName: "Espresso & Cognac Tan",
    colorHex: "#3D251E"
  },
  {
    id: "ivory-top-handle",
    title: "The Petit Ivory Top-Handle",
    subtitle: "Sculptural Alabaster Smooth Calfskin",
    price: "Rs. 7,290",
    originalPrice: "Rs. 9,490",
    badge: "New Silhouette",
    image: "/images/products/ivory-top-handle.jpeg",
    alt: "The Petit Ivory Top-Handle Handbag with high-polish palladium hardware",
    productUrl: "/product/the-anora-petit-ivory-handbag",
    colorName: "Alabaster Ivory Cream",
    colorHex: "#F5F0E6"
  },
  {
    id: "bordeaux-lifestyle",
    title: "Artisanal Edge & Dual Chain",
    subtitle: "18k Brushed Gold Clasp & Saddle Stitching",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Craft Details",
    image: "/images/products/bordeaux-crossbody-lifestyle.jpeg",
    alt: "Macro craftsmanship details of the Anora Bordeaux Flap Crossbody clasp and leather",
    productUrl: "/product/the-anora-bordeaux-flap-crossbody",
    colorName: "Rich Bordeaux Wine",
    colorHex: "#4A1525"
  },
  {
    id: "bordeaux-interior",
    title: "Accordion Architecture",
    subtitle: "Triple Bellows Compartments with Center Security Zip",
    price: "Rs. 6,990",
    originalPrice: "Rs. 8,990",
    badge: "Capacity",
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === "3d") return
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [viewMode, nextSlide, prevSlide])

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
    if (touchDeltaXRef.current > 40) {
      prevSlide()
    } else if (touchDeltaXRef.current < -40) {
      nextSlide()
    }
    touchStartXRef.current = null
    touchDeltaXRef.current = 0
  }

  return (
    <section
      className="relative overflow-hidden bg-[#FAF6F1] pt-3 pb-6 sm:pt-4 sm:pb-10 md:pt-6 md:pb-12 border-b border-[#E5DCD2]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Anora Luxury Bag Showcase"
    >
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#ECE2D8]/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] rounded-full bg-[#462F1D]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Cinematic Visual Stage — Visual First, Clean, Uncluttered */}
        <div
          className="relative w-full h-[58vh] min-h-[460px] max-h-[740px] xs:h-[62vh] sm:h-[68vh] md:h-[74vh] lg:h-[78vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8] shadow-md select-none group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar Floating Controls — Shared across Photo & 3D */}
          <div className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-5 flex items-center justify-between z-30 pointer-events-none">
            {/* Visual Slide Index Pill */}
            <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-sans font-medium text-white/90">
                0{activeIdx + 1} / 0{HERO_VISUALS.length}
              </span>
              <span className="hidden sm:inline-block text-white/50">·</span>
              <span className="hidden sm:inline-block text-xs text-white/90 font-sans">
                {activeVisual.badge}
              </span>
            </div>

            {/* Dual Mode Switcher: Lookbook vs 3D Orbit */}
            <div className="pointer-events-auto inline-flex items-center rounded-full bg-black/45 backdrop-blur-md border border-white/20 p-1 text-xs shadow-xs">
              <button
                onClick={() => setViewMode("photo")}
                className={`px-3 py-1 rounded-full transition-all duration-200 text-xs font-medium ${
                  viewMode === "photo"
                    ? "bg-white text-[#23170F] font-semibold shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Lookbook
              </button>

              <button
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1 rounded-full transition-all duration-200 text-xs font-medium flex items-center gap-1.5 ${
                  viewMode === "3d"
                    ? "bg-[#462F1D] text-white font-semibold shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Orbit</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ECE2D8] text-[#462F1D] font-bold">
                  360°
                </span>
              </button>
            </div>
          </div>

          {viewMode === "photo" ? (
            <div className="relative w-full h-full">
              {/* Pristine Full-Res Product Image (Zero baked-in text) */}
              <Image
                key={activeVisual.id}
                src={activeVisual.image}
                alt={activeVisual.alt}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
              />

              {/* Minimal Bottom Scrim for Text Contrast — Keeps the Bag Crystal Clear */}
              <div className="absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

              {/* Minimal Prev / Next Navigation Arrows */}
              <button
                onClick={prevSlide}
                aria-label="Previous bag image"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-white text-white hover:text-[#23170F] backdrop-blur-md border border-white/20 hover:border-white flex items-center justify-center transition-all duration-300 shadow-md z-20 group/btn"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover/btn:-translate-x-0.5" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next bag image"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-white text-white hover:text-[#23170F] backdrop-blur-md border border-white/20 hover:border-white flex items-center justify-center transition-all duration-300 shadow-md z-20 group/btn"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>

              {/* Minimal Understated Luxury Title & Action — Floating Cleanly at Bottom */}
              <div className="absolute bottom-3 inset-x-3 sm:bottom-6 sm:inset-x-6 z-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                  {/* Bag Identity & Price */}
                  <div className="space-y-1">
                    <span className="block text-xs font-sans text-[#ECE2D8]/90 font-medium">
                      Anora Bags · Autumn / Winter 2026
                    </span>
                    <h1 className="font-serif text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-light text-white drop-shadow-xs">
                      {activeVisual.title}
                    </h1>
                    <div className="flex items-center gap-2.5 pt-0.5">
                      <span className="font-sans text-base sm:text-xl font-semibold text-white tabular-nums">
                        {activeVisual.price}
                      </span>
                      {activeVisual.originalPrice && (
                        <span className="text-xs sm:text-sm text-white/55 line-through">
                          {activeVisual.originalPrice}
                        </span>
                      )}
                      <span className="text-white/30 text-xs">·</span>
                      <span className="text-xs text-[#ECE2D8]/90 font-light hidden xs:inline">
                        {activeVisual.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Understated Action Buttons */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
                    <Link
                      href={activeVisual.productUrl}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white hover:bg-[#FAF6F1] text-[#23170F] text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 group/link"
                    >
                      <span>Explore Bag</span>
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>

                    <button
                      onClick={() => setViewMode("3d")}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/20 transition-all duration-300"
                    >
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span className="hidden sm:inline">Inspect 3D</span>
                      <span className="sm:hidden">3D</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 3D WebGL Interactive Bag Canvas */
            <div className="relative w-full h-full bg-[#FAF6F1]">
              <Bag3DCanvas
                initialColor="#462F1D"
                interactive={true}
                className="w-full h-full"
                showControls={true}
              />
            </div>
          )}
        </div>

        {/* Visual-First Miniature Bag Showcase Gallery */}
        <div className="mt-3 sm:mt-5">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
            {HERO_VISUALS.map((item, idx) => {
              const isActive = viewMode === "photo" && activeIdx === idx
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveIdx(idx)
                    setViewMode("photo")
                  }}
                  className={`group relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-[#462F1D] ring-2 ring-[#462F1D]/30 scale-102 shadow-sm"
                      : "border-[#E5DCD2] opacity-75 hover:opacity-100 hover:border-[#462F1D]/60"
                  }`}
                  aria-label={`View silhouette ${idx + 1}: ${item.title}`}
                  title={item.title}
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
                      isActive ? "bg-transparent" : "bg-black/10 group-hover:bg-transparent"
                    }`}
                  />
                  <div className="absolute bottom-1 right-1 px-1 rounded-sm bg-black/60 text-[9px] text-white font-sans font-medium">
                    0{idx + 1}
                  </div>
                </button>
              )
            })}

            {/* 3D Orbit Shortcut Tile */}
            <button
              onClick={() => setViewMode("3d")}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                viewMode === "3d"
                  ? "border-[#462F1D] bg-[#462F1D] text-[#FAF6F1] ring-2 ring-[#462F1D]/30 shadow-sm"
                  : "border-[#E5DCD2] bg-[#ECE2D8]/50 hover:bg-[#ECE2D8] text-[#462F1D]"
              }`}
              aria-label="Launch 3D Interactive Studio"
              title="Launch 3D Interactive Studio"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[10px] font-sans font-semibold">
                3D Orbit
              </span>
            </button>
          </div>
        </div>

        {/* Minimal Understated Luxury Trust Ledger — Single Horizontal Line */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E5DCD2]/70 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-[#462F1D]/85 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <span className="font-medium text-[#23170F]">100% Cash On Delivery</span>
            <span className="text-[#462F1D]/60 hidden md:inline">Nationwide</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <span className="font-medium text-[#23170F]">Doorstep Inspection</span>
            <span className="text-[#462F1D]/60 hidden md:inline">Verify before payment</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <span className="font-medium text-[#23170F]">7-Day Doorstep Returns</span>
            <span className="text-[#462F1D]/60 hidden md:inline">Unconditional guarantee</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0" />
            <span className="font-medium text-[#23170F]">Full-Grain Calfskin</span>
            <span className="text-[#462F1D]/60 hidden md:inline">18k brushed gold hardware</span>
          </div>
        </div>
      </div>
    </section>
  )
}
