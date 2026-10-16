"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, ArrowUpRight } from "lucide-react"

const Bag3DCanvas = dynamic(
  () => import("./bag-3d-canvas").then((m) => m.Bag3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center bg-[#FAF6F1] rounded-2xl border border-[#E5DCD2] gap-3">
        <div className="w-6 h-6 border-2 border-[#462F1D] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-[#462F1D] font-sans tracking-[0.16em] uppercase">
          Initializing 3D Atelier...
        </span>
      </div>
    )
  }
)

export function Hero() {
  const [viewMode, setViewMode] = useState<"photo" | "3d">("photo")

  return (
    <section className="relative overflow-hidden bg-[#FAF6F1] pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24 border-b border-[#E5DCD2]">
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] rounded-full bg-[#ECE2D8]/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[420px] h-[420px] rounded-full bg-[#462F1D]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">
          {/* Left Column: High-Fashion Editorial Typography */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#462F1D]/40" />
                <span className="text-xs sm:text-sm font-sans tracking-[0.18em] sm:tracking-[0.24em] font-semibold uppercase text-[#462F1D]">
                  Maison Anora • Atelier Édition
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-[-0.03em] text-[#23170F] leading-[1.08] sm:leading-[1.04]">
                Sculpted Form, <br />
                <span className="italic font-normal text-[#462F1D]">Quiet Presence.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#3D291B] font-normal max-w-xl leading-relaxed pt-1">
                Conceived in our atelier from genuine full-grain calfskin and solid 18k brushed gold brass. Distinctive minimalist silhouettes designed to accompany every facet of your life—available with 100% Cash on Delivery and an unconditional 7-Day Home Privilege.
              </p>
            </div>

            {/* Editorial Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="#collection"
                className="w-full sm:w-auto px-7 sm:px-9 py-4 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] text-xs sm:text-sm font-medium tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 group btn-magnetic text-center"
              >
                <span>Explore Silhouettes</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => setViewMode(viewMode === "3d" ? "photo" : "3d")}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-full bg-transparent hover:bg-white/60 text-[#23170F] border border-[#462F1D]/30 hover:border-[#462F1D] text-xs sm:text-sm font-medium tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 btn-magnetic text-center"
              >
                <span>{viewMode === "3d" ? "Lookbook View" : "3D Interactive Atelier"}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECE2D8] text-[#462F1D] font-sans font-semibold">
                  360°
                </span>
              </button>
            </div>

            {/* Editorial Trust Ledger */}
            <div className="pt-8 border-t border-[#E5DCD2] grid grid-cols-1 sm:grid-cols-3 gap-6 text-[#23170F]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sm text-[#462F1D]">01.</span>
                  <h4 className="text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase text-[#23170F]">
                    Doorstep Inspection
                  </h4>
                </div>
                <p className="text-sm text-[#462F1D] font-normal leading-relaxed">
                  100% Cash On Delivery. Verify your piece before payment.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sm text-[#462F1D]">02.</span>
                  <h4 className="text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase text-[#23170F]">
                    7-Day Privilege
                  </h4>
                </div>
                <p className="text-sm text-[#462F1D] font-normal leading-relaxed">
                  Experience at home. Hassle-free doorstep returns.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sm text-[#462F1D]">03.</span>
                  <h4 className="text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase text-[#23170F]">
                    Full-Grain Leather
                  </h4>
                </div>
                <p className="text-sm text-[#462F1D] font-normal leading-relaxed">
                  Hand-burnished edges & 18k brushed gold hardware.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Visual Stage */}
          <div className="lg:col-span-6 relative">
            {/* View Mode Switch */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-xs font-sans tracking-[0.14em] uppercase text-[#462F1D] font-semibold">
                {viewMode === "photo" ? "Editorial Lookbook" : "3D Spatial Orbit"}
              </span>

              <div className="inline-flex rounded-full bg-[#ECE2D8]/80 p-1 text-xs font-medium text-[#462F1D]">
                <button
                  onClick={() => setViewMode("photo")}
                  className={`px-3.5 py-1 rounded-full transition-all duration-200 text-xs font-medium ${
                    viewMode === "photo" ? "bg-white text-[#23170F] shadow-xs" : "hover:text-[#23170F]"
                  }`}
                >
                  Photography
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`px-3.5 py-1 rounded-full transition-all duration-200 text-xs font-medium ${
                    viewMode === "3d" ? "bg-[#462F1D] text-white shadow-xs" : "hover:text-[#23170F]"
                  }`}
                >
                  Interactive 3D
                </button>
              </div>
            </div>

            {/* Showcase Canvas Frame */}
            <div className="relative h-[420px] xs:h-[480px] sm:h-[540px] lg:h-[600px] rounded-2xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8] shadow-sm">
              {viewMode === "photo" ? (
                <div className="relative w-full h-full group overflow-hidden">
                  <Image
                    src="/images/products/bordeaux-crossbody-hero.jpeg"
                    alt="The Anora Bags Signature Silhouette"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#23170F]/85 via-[#23170F]/20 to-transparent pointer-events-none" />

                  {/* Top Editorial Index Stamp */}
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5 text-xs font-medium tracking-[0.16em] uppercase text-white/95 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    Fig. 01 / Signature Silhouette
                  </div>

                  {/* Bottom Minimalist Editorial Card */}
                  <div className="absolute bottom-5 inset-x-5 sm:bottom-6 sm:inset-x-6 text-[#FAF6F1] space-y-2">
                    <div className="flex flex-col xs:flex-row xs:items-baseline justify-between border-b border-white/20 pb-2 gap-1 xs:gap-3">
                      <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-white line-clamp-1">
                        The Anora Bordeaux Flap Crossbody
                      </h3>
                      <span className="font-serif text-lg sm:text-xl font-normal text-[#ECE2D8] shrink-0">
                        Rs. 6,990
                      </span>
                    </div>

                    <p className="text-sm text-[#FAF6F1]/90 font-light line-clamp-2 leading-relaxed">
                      Hand-stitched pebbled calfskin with custom circular locking clasp and dual woven chain strap.
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href="/product/the-anora-bordeaux-flap-crossbody"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-[0.14em] font-medium text-[#ECE2D8] hover:text-white transition group"
                      >
                        <span>Discover Silhouette</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      <button
                        onClick={() => setViewMode("3d")}
                        className="text-xs sm:text-sm font-sans tracking-[0.12em] uppercase text-white/80 hover:text-white transition font-medium"
                      >
                        Orbit in 3D →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <Bag3DCanvas
                    initialColor="#462F1D"
                    interactive={true}
                    className="w-full h-full"
                    showControls={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

