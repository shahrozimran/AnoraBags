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
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase font-semibold text-[#755944]">
              Maison Concierge
            </span>
            <span className="h-px w-6 bg-[#462F1D]/40" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#23170F]">
            Track Your <span className="italic font-normal text-[#462F1D]">COD Parcel</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#755944] font-light max-w-md mx-auto leading-relaxed">
            Enter your Order Number (e.g. <code>ANR-2026-1001</code>) or your phone number to check courier transit status and 7-day doorstep privilege.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#755944]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order Number (e.g. ANR-2026-1001)"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#E5DCD2] text-[#23170F] text-xs focus:outline-hidden focus:border-[#462F1D] bg-white shadow-2xs font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-3.5 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] text-xs font-sans tracking-[0.2em] uppercase font-semibold transition shadow-sm disabled:opacity-50"
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
                <div className="p-6 bg-[#23170F] text-[#ECE2D8] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#ECE2D8]/80 block">
                      Order #{order.orderNumber}
                    </span>
                    <h3 className="font-serif text-xl font-light mt-0.5 text-white">
                      Status: <span className="text-[#ECE2D8] font-normal">{order.orderStatus}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs text-[#ECE2D8]">
                    <Clock className="w-3.5 h-3.5 text-[#ECE2D8]" />
                    <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="p-6 sm:p-8 border-b border-[#E5DCD2]">
                  <h4 className="text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-[#755944] mb-6">
                    Courier Journey
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-normal text-[#23170F]">Confirmed</span>
                      <span className="text-[10px] text-[#755944]">Order logged</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Processing" || order.orderStatus === "Dispatched" || order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered"
                          ? "bg-[#462F1D] text-[#FAF6F1]"
                          : "bg-[#ECE2D8]/50 text-[#755944]"
                      }`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-normal text-[#23170F]">Atelier Prep</span>
                      <span className="text-[10px] text-[#755944]">Quality boxed</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Dispatched" || order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered"
                          ? "bg-[#462F1D] text-[#FAF6F1]"
                          : "bg-[#ECE2D8]/50 text-[#755944]"
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-normal text-[#23170F]">Dispatched</span>
                      <span className="text-[10px] text-[#755944]">Transit hub</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered"
                          ? "bg-[#462F1D] text-[#FAF6F1]"
                          : "bg-[#ECE2D8]/50 text-[#755944]"
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-normal text-[#23170F]">Out for Delivery</span>
                      <span className="text-[10px] text-[#755944]">Rider en route</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 col-span-2 sm:col-span-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.orderStatus === "Delivered" ? "bg-[#462F1D] text-[#FAF6F1]" : "bg-[#ECE2D8]/50 text-[#755944]"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-normal text-[#23170F]">Delivered</span>
                      <span className="text-[10px] text-[#755944]">Doorstep COD</span>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 bg-[#FAF6F1] p-5 rounded-xl border border-[#E5DCD2]">
                    <h5 className="font-serif text-sm font-normal text-[#23170F] flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#462F1D]" />
                      <span>Payment Due at Doorstep</span>
                    </h5>
                    <div className="space-y-1 text-[#5A4333]">
                      <p>Settlement: <strong className="text-[#23170F]">100% Cash On Delivery</strong></p>
                      <p>Amount Due Rider: <strong className="font-serif text-base text-[#462F1D]">Rs. {order.totalAmount.toLocaleString()}</strong></p>
                      <p>Status: <span className="text-[#755944] font-medium">{order.paymentStatus}</span></p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-[#ECE2D8]/30 p-5 rounded-xl border border-[#E5DCD2]">
                    <h5 className="font-serif text-sm font-normal text-[#23170F] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#462F1D]" />
                      <span>7-Day Doorstep Privilege</span>
                    </h5>
                    <p className="text-[#5A4333] leading-relaxed font-light">
                      Protected by our unconditional 7-day doorstep return guarantee. For an exchange or full cash refund, tap below to notify our concierge.
                    </p>
                    <a
                      href={`https://wa.me/923001234567?text=Hi%20Anora%20Bags,%20I%20want%20to%20request%20a%207-day%20return%20or%20exchange%20for%20order%20${order.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans tracking-wide uppercase font-semibold text-[#462F1D] hover-editorial-line"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Request 7-Day Privilege via WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 sm:p-8 border-t border-[#E5DCD2]">
                  <h5 className="text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-[#755944] mb-4">
                    Items in This Parcel ({order.items.length})
                  </h5>
                  <div className="divide-y divide-[#E5DCD2]/70">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#FAF6F1] border border-[#E5DCD2]">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="text-xs">
                            <p className="font-serif font-normal text-[#23170F]">{item.name}</p>
                            <p className="text-[#755944]">Color: {item.color} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-serif text-[#23170F]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-[#E5DCD2] text-center space-y-3 max-w-md mx-auto shadow-2xs">
                <AlertCircle className="w-6 h-6 text-[#462F1D] mx-auto" />
                <h3 className="font-serif text-lg font-light text-[#23170F]">Order Not Located</h3>
                <p className="text-xs text-[#755944] font-light">{error}</p>
                <p className="text-[11px] text-[#755944]/80">
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
