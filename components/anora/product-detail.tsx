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
  Share2,
  ChevronDown
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
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<"specs" | "capacity" | "refund" | "reviews" | null>("specs")
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
    <div className="pt-6 pb-28 md:pt-10 md:pb-16 bg-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-[#5A4333] mb-8 font-medium">
          <Link href="/" className="hover:text-[#23170F] hover-editorial-line transition">Home</Link>
          <span>/</span>
          <Link href="/#collection" className="hover:text-[#23170F] hover-editorial-line transition">Collection</Link>
          <span>/</span>
          <span className="text-[#23170F] font-semibold">{product.name}</span>
        </nav>

        {/* Top Product View: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Visual Media (Gallery or 3D Canvas) */}
          <div className="lg:col-span-7 space-y-4">
            {/* View Mode Toggle Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#462F1D] font-semibold font-sans">
                {viewMode === "gallery" ? "Editorial Lookbook" : "3D Spatial Studio"}
              </span>
              <div className="inline-flex rounded-full bg-[#ECE2D8]/80 p-0.5 sm:p-1 text-xs font-medium text-[#462F1D]">
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`px-2.5 sm:px-3.5 py-1 rounded-full transition-all duration-200 text-xs font-medium ${
                    viewMode === "gallery" ? "bg-white text-[#23170F] shadow-xs" : "hover:text-[#23170F]"
                  }`}
                >
                  Lookbook
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`px-2.5 sm:px-3.5 py-1 rounded-full flex items-center gap-1 sm:gap-1.5 transition-all duration-200 text-xs font-medium ${
                    viewMode === "3d" ? "bg-[#462F1D] text-white shadow-xs" : "hover:text-[#23170F]"
                  }`}
                >
                  <span>Interactive 3D</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] font-sans font-semibold">
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover object-center transition-all duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#23170F]/90 backdrop-blur-md text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF6F1]">
                      {product.badge}
                    </div>
                  )}

                  {/* Mobile image counter */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 sm:hidden px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-mono text-white/95">
                      {product.images.indexOf(activeImage) + 1} / {product.images.length}
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
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 shrink-0 ${
                      activeImage === img ? "border-[#462F1D] ring-2 ring-[#462F1D]/30 shadow-xs scale-102" : "border-[#E5DCD2] hover:border-[#462F1D]/50 opacity-80 hover:opacity-100"
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
                <span className="text-xs sm:text-sm font-sans tracking-[0.18em] uppercase font-semibold text-[#462F1D]">
                  {product.category} • Handcrafted Atelier
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
                {product.name}
              </h1>

              <p className="text-base sm:text-lg text-[#462F1D] font-normal italic leading-relaxed">
                "{product.tagline}"
              </p>

              {/* Minimalist Patron Rating */}
              <div className="flex items-center gap-2.5 pt-1 text-sm text-[#462F1D]">
                <span className="font-semibold tracking-wider">★ {product.rating}</span>
                <span className="opacity-40">•</span>
                <span className="text-sm font-normal">({product.reviewCount} verified patron reviews)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6F1] border border-[#E5DCD2] flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-light text-[#23170F]">
                    {product.currency} {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-base text-[#462F1D]/60 line-through font-normal">
                      {product.currency} {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-sans text-[#462F1D] font-medium mt-1">
                  Complimentary Express Courier • 100% Cash On Delivery
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-[#ECE2D8] text-[#462F1D] text-xs font-sans font-semibold tracking-wider uppercase">
                In Stock
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs sm:text-sm font-sans">
                <span className="font-semibold text-[#462F1D] uppercase tracking-wider text-xs">Leather Shade:</span>
                <span className="text-[#23170F] font-semibold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {product.availableColors.map((col) => {
                  const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase()
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-sans transition-all duration-200 ${
                        isSelected
                          ? "border-[#23170F] bg-[#23170F] text-[#FAF6F1] shadow-xs"
                          : "border-[#E5DCD2] bg-white text-[#5A4333] hover:bg-[#FAF6F1]"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/60" style={{ backgroundColor: col.hex }} />
                      <span className="tracking-wide font-medium">{col.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs sm:text-sm font-sans font-semibold text-[#462F1D] uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-[#E5DCD2] rounded-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-[#462F1D] hover:text-[#23170F] transition font-medium"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3.5 text-sm font-semibold text-[#23170F]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-[#462F1D] hover:text-[#23170F] transition font-medium"
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
                className="w-full py-4 px-8 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] font-sans font-medium text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 group"
              >
                <span>Order with Cash on Delivery (COD)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-8 rounded-full bg-transparent hover:bg-[#FAF6F1] text-[#23170F] border border-[#462F1D]/40 hover:border-[#462F1D] font-sans font-medium text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <ShoppingBag className="w-4 h-4 text-[#462F1D]" />
                <span>Add to Atelier Bag</span>
              </button>
            </div>

            {/* Luxury Assurance Ledger */}
            <div className="p-5 rounded-2xl bg-[#FAF6F1] border border-[#E5DCD2] space-y-3 text-xs sm:text-sm text-[#5A4333]">
              <div className="space-y-1">
                <h4 className="font-serif text-base font-normal text-[#23170F]">
                  The 7-Day Unconditional Home Privilege
                </h4>
                <p className="font-light leading-relaxed text-[#462F1D]">
                  Experience the piece in your own home. If you are not completely enchanted, our concierge coordinates doorstep collection and full refund.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5DCD2] flex flex-wrap items-center justify-between gap-1 text-xs font-sans tracking-wider uppercase text-[#462F1D] font-medium">
                <span>100% Cash On Delivery</span>
                <span>•</span>
                <span>Zero Advance Payment</span>
                <span>•</span>
                <span>Doorstep Inspection</span>
              </div>
            </div>

            {/* Quick Share */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#462F1D] pt-2 border-t border-[#E5DCD2]">
              <button onClick={handleShare} className="flex items-center gap-2 hover:text-[#23170F] transition font-medium">
                <Share2 className="w-4 h-4" />
                <span className="font-sans text-xs tracking-wider uppercase">{isCopied ? "Link Copied!" : "Share Silhouette"}</span>
              </button>
              <span className="font-serif italic text-[#462F1D] text-xs sm:text-sm">Bespoke Artisan Creation</span>
            </div>
          </div>
        </div>

        {/* Detailed Tabs (Desktop) & Specs Accordion (Mobile) */}
        <div className="border-t border-[#E5DCD2] pt-12 sm:pt-16">
          {/* Desktop Tabs Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 border-b border-[#E5DCD2] pb-px mb-10 text-xs font-sans tracking-[0.14em] uppercase overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#462F1D]/75 hover:text-[#23170F]"
              }`}
            >
              Craft & Material
            </button>
            <button
              onClick={() => setActiveTab("capacity")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "capacity"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#462F1D]/75 hover:text-[#23170F]"
              }`}
            >
              Interior Storage & Fit
            </button>
            <button
              onClick={() => setActiveTab("refund")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "refund"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#462F1D]/75 hover:text-[#23170F]"
              }`}
            >
              7-Day Home Privilege
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-[#462F1D] text-[#462F1D] font-semibold"
                  : "border-transparent text-[#462F1D]/75 hover:text-[#23170F]"
              }`}
            >
              Patron Reviews ({reviews.length})
            </button>
          </div>

          {/* Desktop Tab Contents */}
          <div className="hidden md:block">
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base">
                <div className="space-y-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#23170F]">Craftsmanship Details</h3>
                  <p className="text-[#5A4333] font-light leading-relaxed">{product.description}</p>
                  <ul className="space-y-2.5 pt-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[#23170F] text-sm font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0 mt-2" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#F5EFE8] p-6 rounded-2xl border border-[#E5DCD2] space-y-4">
                  <h4 className="font-serif text-lg font-normal text-[#23170F] mb-4">Technical Dimensions</h4>
                  <div className="divide-y divide-[#E5DCD2] text-sm">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Dimensions</span>
                      <span className="font-medium text-[#23170F]">{product.specs.dimensions}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Weight</span>
                      <span className="font-medium text-[#23170F]">{product.specs.weight}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Material</span>
                      <span className="font-medium text-[#23170F]">{product.specs.material}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Hardware Finish</span>
                      <span className="font-medium text-[#23170F]">{product.specs.hardware}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Strap Drop</span>
                      <span className="font-medium text-[#23170F]">{product.specs.strapDrop}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Lock Closure</span>
                      <span className="font-medium text-[#23170F]">{product.specs.closure}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#23170F]">
                    Architectural Interior Engineering
                  </h3>
                  <p className="text-sm sm:text-base text-[#5A4333] font-light leading-relaxed">
                    Every Anora silhouette features structured triple-accordion bellows that maximize utility and preserve the clean exterior form.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1.5 shadow-2xs">
                      <span className="font-serif italic text-sm text-[#462F1D] block">I. Smartphone Fit</span>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Accommodates iPhone 16 Pro Max & Samsung Ultra devices with case.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1.5 shadow-2xs">
                      <span className="font-serif italic text-sm text-[#462F1D] block">II. Cardholder Slot</span>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Smooth-glide calfskin divider for cards, transit pass, and folded currency.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1.5 shadow-2xs">
                      <span className="font-serif italic text-sm text-[#462F1D] block">III. Cosmetics Cavity</span>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Deep central well for lipstick, compact mirror, and 10ml travel fragrance.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1.5 shadow-2xs">
                      <span className="font-serif italic text-sm text-[#462F1D] block">IV. Key Fob Leash</span>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Internal leather anchor preventing keys from scratching sunglasses.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1.5 shadow-2xs">
                      <span className="font-serif italic text-sm text-[#462F1D] block">V. Eyewear Section</span>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Gentle microfiber lining crafted to safeguard designer eyewear frames.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E5DCD2] space-y-1.5 shadow-2xs">
                      <span className="font-serif italic text-sm text-[#462F1D] block">VI. Concealed Zip</span>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Concealed security pocket for emergency cash and confidential items.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "refund" && (
              <div className="max-w-3xl space-y-6 text-sm sm:text-base text-[#5A4333] font-light">
                <div className="p-6 sm:p-8 rounded-2xl bg-[#ECE2D8]/30 border border-[#E5DCD2] space-y-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#23170F]">
                    The 7-Day Doorstep Home Privilege
                  </h3>
                  <p className="text-sm sm:text-base text-[#462F1D] font-normal leading-relaxed">
                    We believe true luxury requires zero friction. You have 7 days from the moment the courier hands you the parcel to examine the leather grain, test it with your daily wardrobe, and ensure complete delight.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-normal text-[#23170F]">How Doorstep Returns & Exchanges Work</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-[#E5DCD2] space-y-1.5">
                      <span className="font-serif italic text-sm text-[#462F1D] block">Step 01</span>
                      <p className="font-medium text-sm sm:text-base text-[#23170F]">Notify Concierge</p>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Message our WhatsApp line or order portal with your order number.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#E5DCD2] space-y-1.5">
                      <span className="font-serif italic text-sm text-[#462F1D] block">Step 02</span>
                      <p className="font-medium text-sm sm:text-base text-[#23170F]">Doorstep Pickup</p>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Our courier arrives at your address to collect the bag at zero return fee.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#E5DCD2] space-y-1.5">
                      <span className="font-serif italic text-sm text-[#462F1D] block">Step 03</span>
                      <p className="font-medium text-sm sm:text-base text-[#23170F]">Instant Settlement</p>
                      <p className="text-xs sm:text-sm text-[#462F1D] font-normal leading-relaxed">Refund is wired within 24 hours via Bank Transfer, EasyPaisa, or JazzCash.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/refund-policy"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans tracking-[0.14em] uppercase font-semibold text-[#462F1D] hover-editorial-line"
                  >
                    <span>Review Complete Refund Guidelines</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5DCD2]">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-[#23170F]">Patron Experiences</h3>
                    <p className="text-sm text-[#462F1D] font-normal mt-1">Verified doorstep Cash On Delivery feedback across Pakistan</p>
                  </div>
                  <div className="text-xs sm:text-sm font-sans tracking-wider uppercase text-[#462F1D] font-semibold">
                    5.0 ★ Exceptional
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5DCD2] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans tracking-wider uppercase font-semibold text-[#462F1D] bg-[#ECE2D8]/60 px-3 py-1 rounded-full">
                          5.0 ★ Verified Patron
                        </span>
                        <span className="text-xs sm:text-sm text-[#462F1D] font-normal">{rev.location}</span>
                      </div>
                      <h5 className="font-serif font-normal text-lg sm:text-xl text-[#23170F]">"{rev.title}"</h5>
                      <p className="text-sm sm:text-base text-[#5A4333] font-light leading-relaxed">{rev.comment}</p>
                      <div className="pt-3 border-t border-[#E5DCD2]/60 flex items-center justify-between text-xs sm:text-sm text-[#462F1D]">
                        <span className="font-medium text-[#23170F]">{rev.author}</span>
                        <span>Verified Cash On Delivery</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Specs & Details Accordion */}
          <div className="block md:hidden space-y-3">
            {/* Accordion Item 1: Craft & Specs */}
            <div className="rounded-2xl border border-[#E5DCD2] bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                aria-expanded={mobileAccordionOpen === "specs"}
                data-testid="mobile-accordion-specs"
                onClick={() => setMobileAccordionOpen(mobileAccordionOpen === "specs" ? null : "specs")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-sm sm:text-base font-normal text-[#23170F] bg-white transition hover:bg-[#FAF6F1]/50"
              >
                <span className="flex items-center gap-2">
                  <span className="font-serif italic text-xs sm:text-sm text-[#462F1D]">I.</span>
                  <span>Craft & Technical Specs</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#462F1D] transition-transform duration-200 ${mobileAccordionOpen === "specs" ? "rotate-180" : ""}`} />
              </button>
              {mobileAccordionOpen === "specs" && (
                <div className="p-4 pt-0 border-t border-[#E5DCD2]/60 space-y-4 text-sm animate-in fade-in duration-200">
                  <p className="text-[#5A4333] font-light leading-relaxed pt-3">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#23170F] text-sm font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#462F1D] shrink-0 mt-1.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#F5EFE8] p-4 rounded-xl space-y-2 text-sm divide-y divide-[#E5DCD2]">
                    <div className="pt-1 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Dimensions:</span>
                      <span className="font-medium text-[#23170F]">{product.specs.dimensions}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Weight:</span>
                      <span className="font-medium text-[#23170F]">{product.specs.weight}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Material:</span>
                      <span className="font-medium text-[#23170F]">{product.specs.material}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Hardware:</span>
                      <span className="font-medium text-[#23170F]">{product.specs.hardware}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-[#462F1D] font-medium">Lock:</span>
                      <span className="font-medium text-[#23170F]">{product.specs.closure}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 2: Interior Storage */}
            <div className="rounded-2xl border border-[#E5DCD2] bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                aria-expanded={mobileAccordionOpen === "capacity"}
                data-testid="mobile-accordion-capacity"
                onClick={() => setMobileAccordionOpen(mobileAccordionOpen === "capacity" ? null : "capacity")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-sm sm:text-base font-normal text-[#23170F] bg-white transition hover:bg-[#FAF6F1]/50"
              >
                <span className="flex items-center gap-2">
                  <span className="font-serif italic text-xs sm:text-sm text-[#462F1D]">II.</span>
                  <span>Interior Storage & Fit</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#462F1D] transition-transform duration-200 ${mobileAccordionOpen === "capacity" ? "rotate-180" : ""}`} />
              </button>
              {mobileAccordionOpen === "capacity" && (
                <div className="p-4 pt-0 border-t border-[#E5DCD2]/60 space-y-3 text-sm animate-in fade-in duration-200">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mt-3 border border-[#E5DCD2]">
                    <Image
                      src="/images/products/bordeaux-crossbody-interior.jpeg"
                      alt="Bag interior capacity breakdown"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[#5A4333] font-light leading-relaxed">
                    Structured triple-accordion bellows expand smoothly to fit your iPhone 16 Pro Max, keys, wallet, cosmetics, and eyewear.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs sm:text-sm">
                    <div className="p-3 bg-[#FAF6F1] rounded-lg border border-[#E5DCD2]">
                      <span className="font-medium text-[#23170F] block">Smartphone Fit</span>
                      <span className="text-[#462F1D] font-normal">Up to 6.9" screens</span>
                    </div>
                    <div className="p-3 bg-[#FAF6F1] rounded-lg border border-[#E5DCD2]">
                      <span className="font-medium text-[#23170F] block">Card Slots</span>
                      <span className="text-[#462F1D] font-normal">Smooth calfskin divider</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 3: 7-Day Refund Privilege */}
            <div className="rounded-2xl border border-[#E5DCD2] bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                aria-expanded={mobileAccordionOpen === "refund"}
                data-testid="mobile-accordion-refund"
                onClick={() => setMobileAccordionOpen(mobileAccordionOpen === "refund" ? null : "refund")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-sm sm:text-base font-normal text-[#23170F] bg-white transition hover:bg-[#FAF6F1]/50"
              >
                <span className="flex items-center gap-2">
                  <span className="font-serif italic text-xs sm:text-sm text-[#462F1D]">III.</span>
                  <span>7-Day Doorstep Privilege</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#462F1D] transition-transform duration-200 ${mobileAccordionOpen === "refund" ? "rotate-180" : ""}`} />
              </button>
              {mobileAccordionOpen === "refund" && (
                <div className="p-4 pt-0 border-t border-[#E5DCD2]/60 space-y-3 text-sm animate-in fade-in duration-200">
                  <p className="text-[#5A4333] font-light leading-relaxed pt-3">
                    Try the bag in the comfort of your home for 7 full days. If you are not delighted, our courier collects the parcel at zero charge for an immediate bank or mobile cash refund.
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#ECE2D8]/40 border border-[#E5DCD2] space-y-1 text-xs sm:text-sm">
                    <p className="font-medium text-[#23170F]">100% Cash On Delivery nationwide</p>
                    <p className="text-[#462F1D] font-normal">Inspect your package at your doorstep before paying the courier.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 4: Patron Reviews */}
            <div className="rounded-2xl border border-[#E5DCD2] bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                aria-expanded={mobileAccordionOpen === "reviews"}
                data-testid="mobile-accordion-reviews"
                onClick={() => setMobileAccordionOpen(mobileAccordionOpen === "reviews" ? null : "reviews")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-sm sm:text-base font-normal text-[#23170F] bg-white transition hover:bg-[#FAF6F1]/50"
              >
                <span className="flex items-center gap-2">
                  <span className="font-serif italic text-xs sm:text-sm text-[#462F1D]">IV.</span>
                  <span>Patron Reviews ({reviews.length})</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#462F1D] transition-transform duration-200 ${mobileAccordionOpen === "reviews" ? "rotate-180" : ""}`} />
              </button>
              {mobileAccordionOpen === "reviews" && (
                <div className="p-4 pt-0 border-t border-[#E5DCD2]/60 space-y-3 text-sm animate-in fade-in duration-200">
                  <div className="pt-2 space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-[#462F1D] font-semibold uppercase tracking-wider">5.0 ★ Verified Patron</span>
                          <span className="text-[#462F1D] font-normal">{rev.location}</span>
                        </div>
                        <p className="font-serif font-normal text-base text-[#23170F]">"{rev.title}"</p>
                        <p className="text-xs sm:text-sm text-[#5A4333] font-light leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div data-testid="mobile-sticky-bar" className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#FAF6F1]/95 backdrop-blur-md border-t border-[#E5DCD2] px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-12 rounded-md overflow-hidden bg-[#F5EFE8] shrink-0 border border-[#E5DCD2]">
              <Image src={activeImage} alt={product.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-sm font-normal text-[#23170F] truncate">{product.name}</p>
              <p className="font-serif text-sm text-[#462F1D] font-medium">Rs. {product.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2.5 rounded-full border border-[#462F1D]/30 text-[#462F1D] bg-white hover:bg-[#FAF6F1] transition shadow-2xs"
              aria-label="Add to bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBuyNowCOD}
              className="px-4 py-2.5 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] text-xs font-sans font-medium tracking-wider uppercase transition shadow-xs whitespace-nowrap"
            >
              Order COD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
