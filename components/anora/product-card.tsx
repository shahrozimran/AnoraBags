"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { getProductMedia } from "@/lib/product-media"
import { useCart } from "./cart-context"
import { ArrowUpRight, Check } from "lucide-react"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [isAdded, setIsAdded] = useState(false)
  const canPurchase = product.inStock && (product.availableColors.find(color => color.name === selectedColor)?.inStock ?? true)
  const media = getProductMedia(product, selectedColor)
  const productUrl = `/product/${product.id}${product.availableColors.length > 1 ? `?color=${encodeURIComponent(media.color)}` : ""}`

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canPurchase) return
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        image: media.image,
        currency: product.currency
      },
      1
    )
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1800)
  }

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E5DCD2]/70 hover-luxury-lift hover:border-[#462F1D]/30"
    >
      {/* Catalog display image */}
      <div className="w-full aspect-[4/5] bg-[#F5EFE8] overflow-hidden relative">
        <Link
          href={productUrl}
          className="absolute inset-0 z-10 block"
          aria-label={`View silhouette: ${product.name}`}
        >
          {/* Primary View */}
          <Image
            src={media.image}
            alt={`${product.name} — ${media.color}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Minimalist Top Stamp */}
          <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10 pointer-events-none max-w-[55%]">
            {product.badge ? (
              <span className="text-xs font-sans font-medium text-[#23170F] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#E5DCD2] shadow-2xs truncate block">
                {product.badge}
              </span>
            ) : (
              <span className="text-xs font-sans font-medium text-[#462F1D] bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E5DCD2]/80">
                Fig. 0{index + 1}
              </span>
            )}
          </div>

        </Link>

        {/* Sleek Quick-Action Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3.5 sm:bottom-3.5 z-20 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-300">
          <button
            type="button"
            disabled={!canPurchase}
                onClick={handleQuickAdd}
            className={`w-full py-3 sm:py-3.5 px-4 rounded-xl text-sm font-sans font-medium transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
              isAdded
                ? "bg-[#23170F] text-[#ECE2D8]"
                : "bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1]"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <span>Quick Reserve (COD)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Info & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#462F1D] font-medium">
            <span className="capitalize">{product.category}</span>
            <span className="font-serif italic text-[#462F1D]/80 truncate max-w-[65%]">{product.specs.material}</span>
          </div>

          <Link href={productUrl} className="block group/link">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#23170F] group-hover/link:text-[#462F1D] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-[#462F1D] line-clamp-1 font-light leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatches & Price */}
        <div className="pt-3 border-t border-[#E5DCD2]/80 flex items-center justify-between gap-2">
          {/* Swatches */}
          <div className="flex items-center gap-1.5 shrink-0">
            {product.availableColors.map((c) => {
              const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase()
              return (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedColor(c.name)
                  }}
                  title={c.name}
                  aria-label={`${product.name}: ${c.name}`}
                  aria-pressed={isSelected}
                  disabled={!c.inStock}
                  className={`w-5 h-5 rounded-full transition-all duration-200 border ${
                    isSelected
                      ? "scale-115 border-[#23170F] ring-2 ring-[#23170F]/40 shadow-xs"
                      : "border-[#DCCFC2] hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              )
            })}
          </div>

          {/* Pricing */}
          <div className="text-right">
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-[#462F1D]/60 line-through mr-1.5 font-normal">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-sans font-semibold text-base sm:text-lg text-[#23170F]">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Delivery Guarantee Line */}
        <div className="flex items-center justify-between text-xs text-[#462F1D]/80 font-normal pt-1">
          <span>Doorstep Inspection</span>
          <span>7-Day Return</span>
        </div>
      </div>
    </div>
  )
}

