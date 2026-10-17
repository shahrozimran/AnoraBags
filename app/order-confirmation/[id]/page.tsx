import React from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getOrderByIdOrNumber } from "@/lib/db"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import {
  CheckCircle2,
  Banknote,
  ShieldCheck,
  Truck,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  MessageCircle,
  Package
} from "lucide-react"

import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Order #${id} Confirmed — Anora Bags`,
    robots: {
      index: false,
      follow: false
    }
  }
}


export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params
  const order = await getOrderByIdOrNumber(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="bg-white rounded-2xl border border-[#E5DCD2] shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#23170F] text-[#ECE2D8] p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#ECE2D8]/20 text-[#ECE2D8] flex items-center justify-center mx-auto mb-4 border border-[#ECE2D8]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs sm:text-sm font-sans text-[#ECE2D8] font-medium block mb-1.5">
              Order Confirmed • Cash On Delivery
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white">
              Thank You, {order.customerName.split(" ")[0]}
            </h1>
            <p className="text-sm sm:text-base text-[#ECE2D8]/90 font-light max-w-lg mx-auto mt-2 leading-relaxed">
              Your handcrafted Anora order has been registered. We are carefully preparing your bag for dispatch.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sm font-mono">
              <span className="text-[#ECE2D8]/80">Tracking ID:</span>
              <span className="font-bold text-[#ECE2D8]">{order.orderNumber}</span>
            </div>
          </div>

          {/* COD Notice Box */}
          <div className="p-6 bg-[#ECE2D8]/40 border-b border-[#E5DCD2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#462F1D] text-[#FAF6F1] flex items-center justify-center shrink-0">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-sans font-medium text-[#462F1D]">
                  Cash Payable at Doorstep:
                </h4>
                <p className="text-2xl sm:text-3xl font-sans font-semibold tabular-nums text-[#23170F]">
                  Rs. {order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs sm:text-sm text-[#462F1D] font-normal space-y-0.5">
              <p>Please inspect your parcel before handing cash to the courier.</p>
              <p className="font-semibold text-[#462F1D]">Complimentary Express Delivery Included</p>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Delivery Details & 7-Day Guarantee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping info */}
              <div className="p-6 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] space-y-3.5 text-sm">
                <h3 className="font-serif text-lg font-normal text-[#23170F] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#462F1D]" />
                  <span>Delivery Address</span>
                </h3>
                <div className="space-y-1 text-[#462F1D] font-normal">
                  <p className="font-medium text-[#23170F]">{order.customerName}</p>
                  <p>{order.address}</p>
                  {order.apartment && <p>{order.apartment}</p>}
                  <p>{order.city} {order.postalCode}</p>
                  <p className="pt-1 flex items-center gap-1.5 font-medium text-[#23170F]">
                    <Phone className="w-4 h-4 text-[#462F1D]" />
                    <span>{order.phone}</span>
                  </p>
                </div>
              </div>

              {/* 7-Day Refund Policy Box */}
              <div className="p-6 rounded-xl bg-[#ECE2D8]/30 border border-[#E5DCD2] space-y-3.5 text-sm">
                <h3 className="font-serif text-lg font-normal text-[#23170F] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#462F1D]" />
                  <span>7-Day Home Privilege</span>
                </h3>
                <p className="text-[#462F1D] font-light leading-relaxed">
                  Your 7-day privilege begins upon parcel handover. If anything falls short of expectations, our courier collects the parcel for an immediate refund.
                </p>
                <Link
                  href="/refund-policy"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#462F1D] hover-editorial-line"
                >
                  <span>Review Privilege Terms</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-normal text-[#23170F] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#462F1D]" />
                <span>Reserved Handbags ({order.items.length})</span>
              </h3>

              <div className="divide-y divide-[#E5DCD2]/70 border border-[#E5DCD2] rounded-xl overflow-hidden bg-[#FAF6F1]/30">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-center gap-4 bg-white">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#FAF6F1] shrink-0 border border-[#E5DCD2]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm space-y-1">
                      <h4 className="font-serif font-normal text-base text-[#23170F]">{item.name}</h4>
                      <p className="text-[#462F1D]">Shade: {item.color}</p>
                      <p className="text-[#462F1D]">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-sans font-semibold tabular-nums text-[#23170F]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-[#462F1D] font-normal">Cash on Delivery</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5DCD2]">
              <Link
                href="/track-order"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] text-sm font-sans font-medium transition text-center shadow-xs"
              >
                Track This Order
              </Link>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/923001234567?text=Hi%20Anora%20Bags,%20I%20have%20an%20order%20inquiry%20for%20order%20${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#ECE2D8] hover:bg-white text-[#23170F] text-sm font-sans font-medium transition border border-[#E5DCD2]"
                >
                  <MessageCircle className="w-4 h-4 text-[#462F1D]" />
                  <span>WhatsApp Concierge</span>
                </a>

                <Link
                  href="/"
                  className="flex-1 sm:flex-initial px-6 py-4 rounded-full border border-[#E5DCD2] text-[#462F1D] hover:text-[#23170F] hover:bg-[#FAF6F1] text-sm font-sans font-medium transition text-center"
                >
                  Continue Browsing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
