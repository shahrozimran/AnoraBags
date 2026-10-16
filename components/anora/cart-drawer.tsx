"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "./cart-context"
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, itemCount, subtotal, total } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-[#23170F]/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8 sm:pl-12">
        <div className="w-screen max-w-md bg-[#FAF6F1] border-l border-[#E5DCD2] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#E5DCD2] flex items-center justify-between bg-white/60">
            <div>
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#755944] font-medium block">
                Maison Anora
              </span>
              <h2 className="text-base font-serif font-light text-[#23170F] tracking-wide">
                Your Atelier Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-[#755944] hover:text-[#23170F] hover:bg-[#ECE2D8]/50 transition"
              aria-label="Close bag drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* COD Notice Strip */}
          <div className="bg-[#ECE2D8]/50 border-b border-[#E5DCD2] px-6 py-2.5 flex items-center justify-between text-[11px] font-sans tracking-wide text-[#462F1D]">
            <span>100% Cash On Delivery</span>
            <span className="opacity-40">•</span>
            <span>7-Day Doorstep Privilege</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E5DCD2]/70">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#ECE2D8]/40 border border-[#E5DCD2] flex items-center justify-center text-[#755944]">
                  <ShoppingBag className="w-6 h-6 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-light text-[#23170F]">Your bag is empty</h3>
                  <p className="text-xs text-[#755944] max-w-xs font-light leading-relaxed">
                    Discover handcrafted leather silhouettes sculpted for everyday elegance.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-7 py-3 rounded-full bg-[#462F1D] text-[#FAF6F1] text-xs font-sans tracking-[0.2em] uppercase font-medium hover:bg-[#23170F] transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.id}-${item.color}`} className="py-5 flex gap-4 first:pt-0">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#F5EFE8] shrink-0 border border-[#E5DCD2]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-serif font-light text-[#23170F] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id, item.color)}
                          className="text-[#9E8B7C] hover:text-[#462F1D] transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#755944] font-light mt-0.5">
                        Color: {item.color}
                      </p>
                      <p className="text-xs font-serif font-normal text-[#23170F] mt-1">
                        {item.currency} {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#E5DCD2] rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                          className="px-2 py-1 text-[#755944] hover:text-[#23170F] transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-[#23170F]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                          className="px-2 py-1 text-[#755944] hover:text-[#23170F] transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-serif text-[#23170F]">
                        {item.currency} {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E5DCD2] bg-white/70 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#755944]">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#755944]">
                  <span>Nationwide Express Delivery</span>
                  <span className="text-[#462F1D] font-medium uppercase tracking-wider text-[11px]">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between text-[#23170F] font-normal text-sm pt-3 border-t border-[#E5DCD2]">
                  <span className="font-sans text-xs tracking-wider uppercase">Cash Payable at Doorstep</span>
                  <span className="font-serif text-lg text-[#462F1D]">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] font-sans font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <span>Proceed to Concierge Order</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-[#755944] font-light leading-snug">
                Doorstep inspection prior to settlement • 7-day unconditional returns
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

