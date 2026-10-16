"use client"

import React, { useState, useMemo } from "react"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
}

const CATEGORIES = [
  { id: "all", label: "All Silhouettes" },
  { id: "crossbody", label: "Crossbody" },
  { id: "satchel", label: "Satchel" },
  { id: "top-handle", label: "Top-Handle" },
  { id: "shoulder", label: "Shoulder" }
]

export function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured")

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
              <span className="text-xs sm:text-sm font-sans tracking-[0.18em] uppercase font-semibold text-[#462F1D]">
                Catalogue Permanent
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
              The Handcrafted <span className="italic font-normal text-[#462F1D]">Silhouettes</span>
            </h2>

            <p className="text-base sm:text-lg text-[#3D291B] font-light max-w-lg leading-relaxed">
              Meticulously sculpted from full-grain calfskin leather, hand-burnished edge paint, and bespoke brass hardware. 100% Cash On Delivery with doorstep inspection.
            </p>
          </div>

          {/* Minimalist Sort Dropdown */}
          <div className="flex items-center gap-2.5 self-start md:self-end">
            <span className="text-xs tracking-[0.14em] uppercase font-sans text-[#462F1D] font-semibold">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-b border-[#462F1D]/40 py-1.5 px-2 text-sm text-[#23170F] font-medium tracking-wide focus:outline-hidden focus:border-[#462F1D] cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Client Favorites</option>
            </select>
          </div>
        </div>

        {/* Minimalist Typographic Category Navigation */}
        <div className="flex items-center gap-8 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-[#E5DCD2] text-xs sm:text-sm font-sans tracking-[0.16em] uppercase">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pb-3 relative transition-colors duration-200 whitespace-nowrap font-medium ${
                  isActive
                    ? "text-[#462F1D] font-semibold"
                    : "text-[#755944] hover:text-[#23170F]"
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

