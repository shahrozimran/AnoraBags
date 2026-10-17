"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import type { Product } from "@/lib/types"

export function Hero({ products }: { products: Product[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = products.length
  const currentIdx = count ? activeIdx % count : 0
  const product = products[currentIdx]

  const nextSlide = useCallback(() => {
    if (count > 1) setActiveIdx((idx) => (idx + 1) % count)
  }, [count])
  const prevSlide = useCallback(() => {
    if (count > 1) setActiveIdx((idx) => (idx - 1 + count) % count)
  }, [count])

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (count < 2 || isPaused || isHovered || isFocused || reducedMotion.matches) return
    const timer = window.setInterval(nextSlide, 6000)
    return () => window.clearInterval(timer)
  }, [count, isPaused, isHovered, isFocused, nextSlide])

  if (!product) return null

  return (
    <section
      className="relative overflow-hidden bg-[#FAF6F1] pt-4 pb-6 sm:pt-6 sm:pb-10 border-b border-[#E5DCD2]"
      aria-label="Anora Product Showcase"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false)
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          className="grid lg:grid-cols-[0.85fr_1.15fr] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5DCD2] bg-[#F1E9DF] shadow-sm"
          onTouchStart={(event) => {
            touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
          }}
          onTouchEnd={(event) => {
            if (!touchStart.current) return
            const dx = event.changedTouches[0].clientX - touchStart.current.x
            const dy = event.changedTouches[0].clientY - touchStart.current.y
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
              if (dx > 0) prevSlide()
              else nextSlide()
            }
            touchStart.current = null
          }}
          onTouchCancel={() => { touchStart.current = null }}
        >
          <div className="order-2 lg:order-1 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
            <div className="flex items-center gap-3 mb-5 sm:mb-7">
              <span className="h-px w-6 bg-[#462F1D]/45" />
              <span className="text-xs font-medium tracking-[0.16em] uppercase text-[#462F1D]">The Anora Collection</span>
            </div>
            <div aria-live={isPaused || isFocused ? "polite" : "off"} aria-atomic="true">
              <p className="text-xs font-medium text-[#5A4333] capitalize mb-3">{product.category} · {product.colorName}</p>
              <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-light leading-[1.12] tracking-[-0.025em] text-[#23170F]">{product.name}</h1>
              <p className="mt-4 text-sm sm:text-base text-[#5A4333] font-light leading-relaxed max-w-md">{product.tagline}</p>
              <div className="flex items-baseline gap-3 mt-6">
                <span className="text-2xl sm:text-3xl font-semibold text-[#23170F] tabular-nums">{product.currency} {product.price.toLocaleString("en-PK")}</span>
                {product.originalPrice && <span className="text-sm text-[#5A4333]/70 line-through">{product.currency} {product.originalPrice.toLocaleString("en-PK")}</span>}
              </div>
              <p className="mt-2 text-xs text-[#5A4333]">Cash on Delivery · Free nationwide delivery</p>
            </div>
            <Link
              href={`/product/${product.id}`}
              className="mt-7 inline-flex items-center justify-center gap-3 self-start px-6 py-3.5 rounded-full bg-[#462F1D] text-[#FAF6F1] hover:bg-[#23170F] transition-colors text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#462F1D]"
              aria-label={`Explore ${product.name}`}
            >
              Explore Bag <ArrowUpRight className="w-4 h-4" />
            </Link>
            {count > 1 && (
              <div className="flex items-center gap-3 mt-8 sm:mt-10">
                <button type="button" onClick={prevSlide} aria-label="Previous product" className="w-10 h-10 rounded-full border border-[#462F1D]/25 text-[#462F1D] hover:bg-white/70 transition-colors flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#462F1D] tabular-nums" aria-label={`Product ${currentIdx + 1} of ${count}`}>{String(currentIdx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
                <button type="button" onClick={nextSlide} aria-label="Next product" className="w-10 h-10 rounded-full border border-[#462F1D]/25 text-[#462F1D] hover:bg-white/70 transition-colors flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Play product slideshow" : "Pause product slideshow"} className="ml-1 w-9 h-9 rounded-full text-[#462F1D]/75 hover:bg-white/70 transition-colors flex items-center justify-center">
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
          <div className="relative order-1 lg:order-2 aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[600px] bg-[#F6EFE5]" role="group" aria-roledescription="slide" aria-label={`${currentIdx + 1} of ${count}: ${product.name}`}>
            <Image key={product.id} src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 710px" className="object-contain object-center" />
            {product.badge && <span className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 text-xs font-medium bg-[#FAF6F1]/95 text-[#462F1D] border border-[#E5DCD2] rounded-full">{product.badge}</span>}
          </div>
        </div>
        {count > 1 && (
          <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-5 overflow-x-auto pb-1 scrollbar-none" aria-label="Choose a showcase product">
            {products.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`Show ${item.name}`}
                aria-pressed={currentIdx === idx}
                className={`flex flex-none w-20 sm:w-56 lg:flex-1 lg:min-w-0 lg:w-auto items-center gap-3 p-2 sm:p-3 rounded-xl border transition-colors text-left ${currentIdx === idx ? "border-[#462F1D] bg-[#ECE2D8]/70" : "border-[#E5DCD2] bg-white/40 hover:border-[#462F1D]/50"}`}
              >
                <span className="relative w-full sm:w-14 h-16 shrink-0 rounded-lg overflow-hidden bg-[#F6EFE5]"><Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 30vw, 56px" className="object-contain" /></span>
                <span className="hidden sm:block min-w-0">
                  <span className="block font-serif text-sm lg:text-base text-[#23170F] truncate">{item.name}</span>
                  <span className="block mt-1 text-xs text-[#462F1D] tabular-nums">{item.currency} {item.price.toLocaleString("en-PK")}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="mt-5 sm:mt-6 pt-4 border-t border-[#E5DCD2] flex flex-wrap items-center justify-between gap-x-5 gap-y-3 text-xs text-[#462F1D]">
          <span>● <span className="ml-1.5">100% Cash On Delivery</span><span className="hidden md:inline text-[#5A4333]/70 ml-2">Nationwide</span></span>
          <span>● <span className="ml-1.5">Doorstep Inspection</span><span className="hidden md:inline text-[#5A4333]/70 ml-2">Verify before payment</span></span>
          <span>● <span className="ml-1.5">7-Day Doorstep Returns</span><span className="hidden md:inline text-[#5A4333]/70 ml-2">Shop with confidence</span></span>
        </div>
      </div>
    </section>
  )
}
