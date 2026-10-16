"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
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
  const [isHovered, setIsHovered] = useState(false)

  const secondaryImage = product.images?.[1] || product.image

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        image: product.image,
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Canvas with Smooth Image Cross-Fade */}
      <div className="w-full aspect-[4/5] bg-[#F5EFE8] overflow-hidden relative">
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0 z-10 block"
          aria-label={`View silhouette: ${product.name}`}
        >
          {/* Primary View */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && secondaryImage !== product.image
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100 group-hover:scale-[1.03]"
            }`}
          />

          {/* Secondary View (Cross-Fade on Hover) */}
          {secondaryImage !== product.image && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Minimalist Top Stamp (No noisy badges) */}
          <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
            {product.badge ? (
              <span className="text-[10px] tracking-[0.22em] uppercase font-sans font-medium text-[#23170F] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E5DCD2]/60 shadow-2xs">
                {product.badge}
              </span>
            ) : (
              <span className="text-[9px] tracking-[0.22em] uppercase font-sans text-[#755944] bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-full">
                Fig. 0{index + 1}
              </span>
            )}
          </div>

          {/* Doorstep COD Guarantee Tag */}
          <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
            <span className="text-[9px] tracking-[0.2em] uppercase font-sans font-medium text-[#462F1D] bg-[#ECE2D8]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#462F1D]/15">
              COD Privilege
            </span>
          </div>
        </Link>

        {/* Sleek Quick-Action Bar (Cleanly decoupled from Link; accessible on touch viewports) */}
        <div className="absolute inset-x-3.5 bottom-3.5 z-20 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-3 px-4 rounded-xl text-xs font-sans tracking-[0.16em] uppercase font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
              isAdded
                ? "bg-[#23170F] text-[#ECE2D8]"
                : "bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1]"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Atelier Bag</span>
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
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#755944]">
            <span>{product.category}</span>
            <span className="font-serif italic capitalize text-[#462F1D]/80">Full-grain</span>
          </div>

          <Link href={`/product/${product.id}`} className="block group/link">
            <h3 className="font-serif text-lg font-light text-[#23170F] group-hover/link:text-[#462F1D] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#755944] line-clamp-1 font-light leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatches & Price */}
        <div className="pt-3 border-t border-[#E5DCD2]/60 flex items-center justify-between">
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
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
                  className={`w-4 h-4 rounded-full transition-all duration-200 border ${
                    isSelected
                      ? "scale-125 border-[#23170F] ring-1 ring-[#23170F]/40 shadow-xs"
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
              <span className="text-xs text-[#9E8B7C] line-through mr-1.5 font-light">
                {product.currency} {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-serif text-base font-normal text-[#23170F]">
              {product.currency} {product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Delivery Guarantee Line */}
        <div className="flex items-center justify-between text-[10px] tracking-[0.14em] uppercase text-[#755944] pt-0.5">
          <span>Doorstep Inspection</span>
          <span>7-Day Return</span>
        </div>
      </div>
    </div>
  )
}

