"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product, Review } from "@/lib/types"
import dynamic from "next/dynamic"
import { useCart } from "./cart-context"

const Bag3DCanvas = dynamic(
  () => import("./bag-3d-canvas").then((m) => m.Bag3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center bg-[#FAF6F1] rounded-2xl border border-[#E5DCD2] gap-3">
        <div className="w-8 h-8 border-2 border-[#462F1D] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#462F1D] font-serif tracking-widest uppercase">Loading 3D Studio...</span>
      </div>
    )
  }
)
import {
  Star,
  ShieldCheck,
  Banknote,
  Truck,
  Sparkles,
  Check,
  ShoppingBag,
  ArrowRight,
  Rotate3D,
  Ruler,
  Maximize2,
  Heart,
  Share2
} from "lucide-react"

interface ProductDetailProps {
  product: Product
  reviews?: Review[]
}

export function ProductDetail({ product, reviews = [] }: ProductDetailProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const [activeImage, setActiveImage] = useState(product.images[0] || product.image)
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"specs" | "capacity" | "refund" | "reviews">("specs")
  const [viewMode, setViewMode] = useState<"gallery" | "3d">("gallery")
  const [isCopied, setIsCopied] = useState(false)

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        image: activeImage,
        currency: product.currency
      },
      quantity
    )
  }

  const handleBuyNowCOD = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        image: activeImage,
        currency: product.currency
      },
      quantity
    )
    router.push("/checkout")
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="py-10 bg-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#755944] mb-8 font-light">
          <Link href="/" className="hover:text-[#23170F] hover-editorial-line transition">Home</Link>
          <span>/</span>
          <Link href="/#collection" className="hover:text-[#23170F] hover-editorial-line transition">Collection</Link>
          <span>/</span>
          <span className="text-[#23170F] font-medium">{product.name}</span>
        </nav>

        {/* Top Product View: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Visual Media (Gallery or 3D Canvas) */}
          <div className="lg:col-span-7 space-y-4">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#755944] font-medium font-sans">
                {viewMode === "gallery" ? "Editorial Lookbook" : "3D Spatial Studio"}
              </span>
              <div className="inline-flex rounded-full bg-[#ECE2D8]/70 p-1 text-[11px] font-medium text-[#462F1D]">
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`px-3 py-1 rounded-full transition-all duration-200 ${
                    viewMode === "gallery" ? "bg-white text-[#23170F] shadow-xs" : "hover:text-[#23170F]"
                  }`}
                >
                  Lookbook
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
                    viewMode === "3d" ? "bg-[#462F1D] text-white shadow-xs" : "hover:text-[#23170F]"
                  }`}
                >
                  <span>Interactive 3D</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#ECE2D8] text-[#462F1D] font-sans font-semibold">
                    360°
                  </span>
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8] shadow-sm">
              {viewMode === "gallery" ? (
                <>
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover object-center transition-all duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#23170F]/85 backdrop-blur-md text-[10px] font-medium tracking-[0.22em] uppercase text-[#FAF6F1]">
                      {product.badge}
                    </div>
                  )}
                </>
              ) : (
                <Bag3DCanvas
                  initialColor={product.colorHex}
                  color={product.availableColors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase())?.hex || product.colorHex}
                  onColorChange={(newHex) => {
                    const match = product.availableColors.find((c) => c.hex.toLowerCase() === newHex.toLowerCase())
                    if (match) setSelectedColor(match.name)
                  }}
                  interactive={true}
                  className="w-full h-full"
                  showControls={true}
                />
              )}
            </div>

            {/* Thumbnails row (when in photo mode) */}
            {viewMode === "gallery" && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border transition-all duration-200 shrink-0 ${
                      activeImage === img ? "border-[#462F1D] ring-2 ring-[#462F1D]/30 shadow-xs" : "border-[#E5DCD2] hover:border-[#462F1D]/50"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & COD Checkout Actions */}
          <div className="lg:col-span-5 space-y-7">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#462F1D]/40" />
                <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase font-semibold text-[#755944]">
                  {product.category} • Handcrafted Atelier
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-[-0.02em] text-[#23170F]">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#755944] font-light italic leading-relaxed">
                "{product.tagline}"
              </p>

              {/* Minimalist Patron Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#755944]">
                <span className="text-[#462F1D] font-medium tracking-wider">★ {product.rating}</span>
                <span className="opacity-40">•</span>
                <span className="text-[11px] font-light">({product.reviewCount} verified patron reviews)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-[#FAF6F1] border border-[#E5DCD2] flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-light text-[#23170F]">
                    {product.currency} {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#9E8B7C] line-through font-light">
                      {product.currency} {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-sans text-[#462F1D] font-medium mt-1">
                  Complimentary Express Courier • 100% Cash On Delivery
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#ECE2D8] text-[#462F1D] text-[10px] font-sans font-semibold tracking-widest uppercase">
                Atelier In Stock
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="font-medium text-[#755944] uppercase tracking-wider text-[11px]">Leather Shade:</span>
                <span className="text-[#23170F] font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.availableColors.map((col) => {
                  const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase()
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-sans transition-all duration-200 ${
                        isSelected
                          ? "border-[#23170F] bg-[#23170F] text-[#FAF6F1] shadow-xs"
                          : "border-[#E5DCD2] bg-white text-[#5A4333] hover:bg-[#FAF6F1]"
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: col.hex }} />
                      <span className="tracking-wide">{col.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-[#E5DCD2] rounded-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-[#755944] hover:text-[#23170F] transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-xs font-medium text-[#23170F]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-[#755944] hover:text-[#23170F] transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleBuyNowCOD}
                className="w-full py-4 px-6 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] font-sans font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Order with Cash on Delivery (COD)</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-full bg-transparent hover:bg-[#FAF6F1] text-[#23170F] border border-[#462F1D]/30 hover:border-[#462F1D] font-sans font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Atelier Bag</span>
              </button>
            </div>

            {/* Luxury Assurance Ledger */}
            <div className="p-5 rounded-2xl bg-[#FAF6F1] border border-[#E5DCD2] space-y-3 text-xs text-[#5A4333]">
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-normal text-[#23170F]">
                  The 7-Day Unconditional Home Privilege
                </h4>
                <p className="font-light leading-relaxed text-[#755944]">
                  Experience the piece in your own home. If you are not completely enchanted, our concierge coordinates doorstep collection and full refund.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5DCD2] flex items-center justify-between text-[10px] font-sans tracking-wider uppercase text-[#755944]">
                <span>100% Cash On Delivery</span>
                <span>•</span>
                <span>Zero Advance Payment</span>
                <span>•</span>
                <span>Doorstep Inspection</span>
              </div>
            </div>

            {/* Quick Share */}
            <div className="flex items-center justify-between text-xs text-[#755944] pt-2 border-t border-[#E5DCD2]">
              <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-[#23170F] transition">
                <Share2 className="w-3.5 h-3.5" />
                <span className="font-sans text-[11px] tracking-wider uppercase">{isCopied ? "Link Copied!" : "Share Silhouette"}</span>
              </button>
              <span className="font-serif italic text-[#755944] text-[11px]">Bespoke Artisan Creation</span>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Capacity, Refund Policy, Reviews */}
        <div className="border-t border-[#E5DCD2] pt-16">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-6 sm:gap-10 border-b border-[#E5DCD2] overflow-x-auto pb-px mb-10 scrollbar-none text-xs font-sans tracking-[0.2em] uppercase">
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#755944] hover:text-[#23170F]"
              }`}
            >
              Craft & Material
            </button>
            <button
              onClick={() => setActiveTab("capacity")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "capacity"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#755944] hover:text-[#23170F]"
              }`}
            >
              Interior Storage & Fit
            </button>
            <button
              onClick={() => setActiveTab("refund")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "refund"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#755944] hover:text-[#23170F]"
              }`}
            >
              7-Day Home Privilege
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#755944] hover:text-[#23170F]"
              }`}
            >
              Patron Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content 1: Specifications */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-light text-[#23170F]">Craftsmanship Details</h3>
                <p className="text-[#5A4333] font-light leading-relaxed">{product.description}</p>
                <ul className="space-y-2.5 pt-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[#23170F] text-xs font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F5EFE8] p-6 rounded-2xl border border-[#E5DCD2] space-y-3">
                <h4 className="font-serif text-base font-normal text-[#23170F] mb-4">Technical Dimensions</h4>
                <div className="divide-y divide-[#E5DCD2] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#755944]">Dimensions</span>
                    <span className="font-medium text-[#23170F]">{product.specs.dimensions}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#755944]">Weight</span>
                    <span className="font-medium text-[#23170F]">{product.specs.weight}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#755944]">Material</span>
                    <span className="font-medium text-[#23170F]">{product.specs.material}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#755944]">Hardware Finish</span>
                    <span className="font-medium text-[#23170F]">{product.specs.hardware}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#755944]">Strap Drop</span>
                    <span className="font-medium text-[#23170F]">{product.specs.strapDrop}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#755944]">Lock Closure</span>
                    <span className="font-medium text-[#23170F]">{product.specs.closure}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Interior Storage */}
          {activeTab === "capacity" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8]">
                <Image
                  src="/images/products/bordeaux-crossbody-interior.jpeg"
                  alt="Bag interior capacity breakdown"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-7 space-y-4">
                <h3 className="font-serif text-xl font-light text-[#23170F]">
                  Architectural Interior Engineering
                </h3>
                <p className="text-xs sm:text-sm text-[#5A4333] font-light leading-relaxed">
                  Every Anora silhouette features structured triple-accordion bellows that maximize utility and preserve the clean exterior form.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1 shadow-2xs">
                    <span className="font-serif italic text-xs text-[#462F1D]">I. Smartphone Fit</span>
                    <p className="text-[11px] text-[#755944] font-light leading-snug">Accommodates iPhone 16 Pro Max & Samsung Ultra devices with case.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1 shadow-2xs">
                    <span className="font-serif italic text-xs text-[#462F1D]">II. Cardholder Slot</span>
                    <p className="text-[11px] text-[#755944] font-light leading-snug">Smooth-glide calfskin divider for cards, transit pass, and folded currency.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1 shadow-2xs">
                    <span className="font-serif italic text-xs text-[#462F1D]">III. Cosmetics Cavity</span>
                    <p className="text-[11px] text-[#755944] font-light leading-snug">Deep central well for lipstick, compact mirror, and 10ml travel fragrance.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1 shadow-2xs">
                    <span className="font-serif italic text-xs text-[#462F1D]">IV. Key Fob Leash</span>
                    <p className="text-[11px] text-[#755944] font-light leading-snug">Internal leather anchor preventing keys from scratching sunglasses.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1 shadow-2xs">
                    <span className="font-serif italic text-xs text-[#462F1D]">V. Eyewear Section</span>
                    <p className="text-[11px] text-[#755944] font-light leading-snug">Gentle microfiber lining crafted to safeguard designer eyewear frames.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1 shadow-2xs">
                    <span className="font-serif italic text-xs text-[#462F1D]">VI. Concealed Zip</span>
                    <p className="text-[11px] text-[#755944] font-light leading-snug">Concealed security pocket for emergency cash and confidential items.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: 7-Day Refund Policy */}
          {activeTab === "refund" && (
            <div className="max-w-3xl space-y-6 text-sm text-[#5A4333] font-light">
              <div className="p-6 rounded-2xl bg-[#ECE2D8]/30 border border-[#E5DCD2] space-y-2">
                <h3 className="font-serif text-lg font-normal text-[#23170F]">
                  The 7-Day Doorstep Home Privilege
                </h3>
                <p className="text-xs text-[#5A4333] leading-relaxed">
                  We believe true luxury requires zero friction. You have 7 days from the moment the courier hands you the parcel to examine the leather grain, test it with your daily wardrobe, and ensure complete delight.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-base font-normal text-[#23170F]">How Doorstep Returns & Exchanges Work</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white border border-[#E5DCD2] space-y-1">
                    <span className="font-serif italic text-xs text-[#462F1D]">Step 01</span>
                    <p className="font-medium text-[#23170F]">Notify Concierge</p>
                    <p className="text-[11px] text-[#755944] font-light">Message our WhatsApp line or order portal with your order number.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E5DCD2] space-y-1">
                    <span className="font-serif italic text-xs text-[#462F1D]">Step 02</span>
                    <p className="font-medium text-[#23170F]">Doorstep Pickup</p>
                    <p className="text-[11px] text-[#755944] font-light">Our courier arrives at your address to collect the bag at zero return fee.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E5DCD2] space-y-1">
                    <span className="font-serif italic text-xs text-[#462F1D]">Step 03</span>
                    <p className="font-medium text-[#23170F]">Instant Settlement</p>
                    <p className="text-[11px] text-[#755944] font-light">Refund is wired within 24 hours via Bank Transfer, EasyPaisa, or JazzCash.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/refund-policy"
                  className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#462F1D] hover-editorial-line"
                >
                  <span>Review Complete Refund Guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Tab Content 4: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DCD2]">
                <div>
                  <h3 className="font-serif text-lg font-light text-[#23170F]">Patron Experiences</h3>
                  <p className="text-xs text-[#755944] font-light">Verified doorstep Cash On Delivery feedback across Pakistan</p>
                </div>
                <div className="text-[11px] font-sans tracking-widest uppercase text-[#462F1D] font-semibold">
                  5.0 ★ Exceptional
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-xl bg-white border border-[#E5DCD2] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-sans tracking-widest uppercase font-semibold text-[#462F1D] bg-[#ECE2D8]/60 px-2 py-0.5 rounded-full">
                        5.0 ★ Verified Patron
                      </span>
                      <span className="text-[11px] text-[#755944] font-light">{rev.location}</span>
                    </div>
                    <h5 className="font-serif font-normal text-base text-[#23170F]">"{rev.title}"</h5>
                    <p className="text-xs text-[#5A4333] font-light leading-relaxed">{rev.comment}</p>
                    <div className="pt-2 border-t border-[#E5DCD2]/60 flex items-center justify-between text-[11px] text-[#755944]">
                      <span className="font-medium text-[#23170F]">{rev.author}</span>
                      <span>Verified Cash On Delivery</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
