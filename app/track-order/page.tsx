"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import { CartDrawer } from "@/components/anora/cart-drawer"
import type { Order } from "@/lib/types"
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Banknote,
  MapPin,
  MessageCircle,
  AlertCircle
} from "lucide-react"

export default function TrackOrderPage() {
  const [query, setQuery] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError("")
    setSearched(true)

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (data.success && data.order) {
        setOrder(data.order)
      } else {
        setOrder(null)
        setError(data.message || "No order found matching this tracking ID.")
      }
    } catch {
      setError("Failed to fetch tracking details. Please try again.")
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
      <Header />
      <CartDrawer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full space-y-10">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[#462F1D]/40" />
            <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
              Order Support
            </span>
            <span className="h-px w-6 bg-[#462F1D]/40" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#23170F]">
            Track Your <span className="italic font-normal text-[#462F1D]">COD Parcel</span>
          </h1>
          <p className="text-base sm:text-lg text-[#462F1D] font-light max-w-lg mx-auto leading-relaxed">
            Enter your Order Number (e.g. <code>ANR-2026-1001</code>) or your phone number to check courier transit status and 7-day doorstep privilege.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#462F1D]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order Number (e.g. ANR-2026-1001)"
                required
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-full border border-[#E5DCD2] text-[#23170F] text-sm sm:text-base focus:outline-hidden focus:border-[#462F1D] bg-white shadow-2xs font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] text-sm font-sans font-medium transition shadow-sm disabled:opacity-50 text-center"
            >
              {isLoading ? "Locating..." : "Track"}
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searched && !isLoading && (
          <div>
            {order ? (
              <div className="bg-white rounded-2xl border border-[#E5DCD2] shadow-sm overflow-hidden space-y-6">
                {/* Header status bar */}
                <div className="p-4 sm:p-6 bg-[#23170F] text-[#ECE2D8] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <span className="text-xs sm:text-sm font-mono text-[#ECE2D8] block font-medium">
                      Order #{order.orderNumber}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal mt-0.5 text-white">
                      Status: <span className="text-[#ECE2D8] font-medium">{order.orderStatus}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs sm:text-sm text-[#ECE2D8]">
                    <Clock className="w-4 h-4 text-[#ECE2D8]" />
                    <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="p-4 xs:p-6 sm:p-8 border-b border-[#E5DCD2]">
                  <h4 className="text-sm font-sans font-medium text-[#462F1D] mb-4 sm:mb-6">
                    Courier Journey
                  </h4>

                  {/* Desktop Horizontal Stepper */}
                  <div className="hidden sm:grid sm:grid-cols-5 gap-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-normal text-sm sm:text-base text-[#23170F]">Confirmed</span>
                      <span className="text-xs sm:text-sm text-[#462F1D] font-normal">Order logged</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Processing" || order.orderStatus === "Dispatched" || order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered"
                          ? "bg-[#462F1D] text-[#FAF6F1]"
                          : "bg-[#ECE2D8]/50 text-[#462F1D]/70"
                      }`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-normal text-sm sm:text-base text-[#23170F]">Preparing Order</span>
                      <span className="text-xs sm:text-sm text-[#462F1D] font-normal">Quality inspected</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Dispatched" || order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered"
                          ? "bg-[#462F1D] text-[#FAF6F1]"
                          : "bg-[#ECE2D8]/50 text-[#462F1D]/70"
                      }`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-normal text-sm sm:text-base text-[#23170F]">Dispatched</span>
                      <span className="text-xs sm:text-sm text-[#462F1D] font-normal">Transit hub</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered"
                          ? "bg-[#462F1D] text-[#FAF6F1]"
                          : "bg-[#ECE2D8]/50 text-[#462F1D]/70"
                      }`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-normal text-sm sm:text-base text-[#23170F]">Out for Delivery</span>
                      <span className="text-xs sm:text-sm text-[#462F1D] font-normal">Rider en route</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Delivered" ? "bg-[#462F1D] text-[#FAF6F1]" : "bg-[#ECE2D8]/50 text-[#462F1D]/70"
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-normal text-sm sm:text-base text-[#23170F]">Delivered</span>
                      <span className="text-xs sm:text-sm text-[#462F1D] font-normal">Doorstep COD</span>
                    </div>
                  </div>

                  {/* Mobile Vertical Stepper */}
                  <div className="sm:hidden space-y-4 relative pl-8 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5DCD2]">
                    {[
                      {
                        title: "Confirmed",
                        desc: "Order logged",
                        icon: CheckCircle2,
                        active: true
                      },
                      {
                        title: "Preparing Order",
                        desc: "Quality inspected & packaged",
                        icon: Package,
                        active: ["Processing", "Dispatched", "Out for Delivery", "Delivered"].includes(order.orderStatus)
                      },
                      {
                        title: "Dispatched",
                        desc: "Courier transit hub departure",
                        icon: Truck,
                        active: ["Dispatched", "Out for Delivery", "Delivered"].includes(order.orderStatus)
                      },
                      {
                        title: "Out for Delivery",
                        desc: "Rider coordinating doorstep arrival",
                        icon: Truck,
                        active: ["Out for Delivery", "Delivered"].includes(order.orderStatus)
                      },
                      {
                        title: "Delivered",
                        desc: "Doorstep inspection & COD settlement",
                        icon: CheckCircle2,
                        active: order.orderStatus === "Delivered"
                      }
                    ].map((step, idx) => {
                      const Icon = step.icon
                      return (
                        <div key={idx} className="relative flex items-start gap-3">
                          <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                            step.active ? "bg-[#462F1D] text-[#FAF6F1]" : "bg-[#ECE2D8] text-[#462F1D]/70"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="pt-0.5">
                            <p className="font-serif text-base text-[#23170F] font-normal">{step.title}</p>
                            <p className="text-xs sm:text-sm text-[#462F1D] font-normal">{step.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3 bg-[#FAF6F1] p-6 rounded-xl border border-[#E5DCD2]">
                    <h5 className="font-serif text-base sm:text-lg font-normal text-[#23170F] flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-[#462F1D]" />
                      <span>Payment Due at Doorstep</span>
                    </h5>
                    <div className="space-y-1.5 text-[#462F1D]">
                      <p>Settlement: <strong className="text-[#23170F]">100% Cash On Delivery</strong></p>
                      <p>Amount Due Rider: <strong className="font-sans font-semibold tabular-nums text-lg text-[#462F1D]">Rs. {order.totalAmount.toLocaleString()}</strong></p>
                      <p>Status: <span className="font-semibold text-[#462F1D]">{order.paymentStatus}</span></p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-[#ECE2D8]/30 p-6 rounded-xl border border-[#E5DCD2]">
                    <h5 className="font-serif text-base sm:text-lg font-normal text-[#23170F] flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#462F1D]" />
                      <span>7-Day Doorstep Privilege</span>
                    </h5>
                    <p className="text-[#462F1D] leading-relaxed font-light text-sm">
                      Protected by our unconditional 7-day doorstep return guarantee. For an exchange or full cash refund, tap below to notify our concierge.
                    </p>
                    <a
                      href={`https://wa.me/923001234567?text=Hi%20Anora%20Bags,%20I%20want%20to%20request%20a%207-day%20return%20or%20exchange%20for%20order%20${order.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#462F1D] hover-editorial-line"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Request 7-Day Return via WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 sm:p-8 border-t border-[#E5DCD2]">
                  <h5 className="text-sm font-sans font-medium text-[#462F1D] mb-4">
                    Items in This Parcel ({order.items.length})
                  </h5>
                  <div className="divide-y divide-[#E5DCD2]/70">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#FAF6F1] border border-[#E5DCD2]">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="text-sm">
                            <p className="font-serif font-normal text-sm sm:text-base text-[#23170F]">{item.name}</p>
                            <p className="text-[#462F1D]">Color: {item.color} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm sm:text-base font-sans font-semibold tabular-nums text-[#23170F]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 sm:p-10 bg-white rounded-2xl border border-[#E5DCD2] text-center space-y-3 max-w-md mx-auto shadow-2xs">
                <AlertCircle className="w-8 h-8 text-[#462F1D] mx-auto" />
                <h3 className="font-serif text-xl font-normal text-[#23170F]">Order Not Located</h3>
                <p className="text-sm text-[#462F1D] font-normal">{error}</p>
                <p className="text-xs sm:text-sm text-[#462F1D]/90">
                  Please verify your Order Number (e.g. <code>ANR-2026-1001</code>) or contact our concierge via WhatsApp.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
