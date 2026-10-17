"use client"

import React, { useState, useMemo, useEffect } from "react"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"
import { ChevronDown } from "lucide-react"

interface ProductGridProps {
  products: Product[]
  initialCategory?: string
}

const CATEGORIES = [
  { id: "all", label: "All Handbags" },
  { id: "crossbody", label: "Crossbody" },
  { id: "satchel", label: "Satchels" },
  { id: "top-handle", label: "Top-Handle" },
  { id: "shoulder", label: "Shoulder Bags" }
]

export function ProductGrid({ products, initialCategory }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all")
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured")

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory)
    }
  }, [initialCategory])

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory)
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "rating":
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return list
  }, [products, activeCategory, sortBy])

  return (
    <section id="collection" className="py-20 md:py-28 bg-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b border-[#E5DCD2]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#462F1D]/40" />
              <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
                Permanent Collection
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
              Handcrafted <span className="italic font-normal text-[#462F1D]">Silhouettes</span>
            </h2>

            <p className="text-base sm:text-lg text-[#3D291B] font-light max-w-lg leading-relaxed">
              Meticulously sculpted from full-grain calfskin leather, hand-burnished edge paint, and bespoke brass hardware. 100% Cash On Delivery with doorstep inspection.
            </p>
          </div>

          {/* Refined Sort Dropdown */}
          <div className="flex items-center gap-2.5 self-start md:self-end">
            <span className="text-xs sm:text-sm font-sans text-[#462F1D] font-medium whitespace-nowrap">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#E5DCD2] rounded-full py-2 pl-4 pr-9 text-xs sm:text-sm text-[#23170F] font-medium focus:outline-hidden focus:border-[#462F1D] cursor-pointer shadow-2xs hover:border-[#462F1D]/60 transition"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Client Favorites</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#462F1D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0 mb-10 border-b border-[#E5DCD2]">
          {/* Mobile Right Edge Scroll Hint Gradient */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAF6F1] via-[#FAF6F1]/80 to-transparent sm:hidden z-10" />

          <div className="overflow-x-auto scrollbar-none pb-0.5">
            <div className="flex items-center gap-6 sm:gap-8 min-w-max pb-3 pr-12 sm:pr-0 text-sm font-sans">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`pb-2.5 relative transition-colors duration-200 whitespace-nowrap font-medium ${
                      isActive
                        ? "text-[#462F1D] font-semibold"
                        : "text-[#462F1D]/70 hover:text-[#23170F]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#462F1D] animate-in fade-in duration-200" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>


        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

