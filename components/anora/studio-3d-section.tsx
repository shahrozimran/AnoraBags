"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { ChevronDown } from "lucide-react"

const Bag3DCanvas = dynamic(
  () => import("./bag-3d-canvas").then((m) => m.Bag3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-[#23170F] rounded-2xl border border-[#3D291B] gap-3">
        <div className="w-6 h-6 border-2 border-[#ECE2D8] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-[#ECE2D8] font-sans">
          Loading 3D Studio...
        </span>
      </div>
    )
  }
)

export function Studio3DSection() {
  const [selectedFeature, setSelectedFeature] = useState<number>(0)

  const CRAFT_HIGHLIGHTS = [
    {
      numeral: "01",
      title: "18k Brushed Gold Clasp",
      tag: "Signature Hardware",
      angle: "front" as const,
      description:
        "Custom forged from solid brass alloy with 18-karat champagne brushed finish. Features an authentic mechanical click and tamper-proof twist closure designed for lifelong use.",
      specs: "Solid brass core • Ceramic anti-tarnish micro-seal"
    },
    {
      numeral: "02",
      title: "Full-Grain Pebbled Calfskin",
      tag: "Artisanal Material",
      angle: "threeQuarter" as const,
      description:
        "Selected from ethically accredited tanneries. The full-grain pebbled texture is naturally scratch and scuff resistant, contouring gracefully with everyday wear.",
      specs: "1.4mm thickness • Hand-burnished edge dye"
    },
    {
      numeral: "03",
      title: "Triple Accordion Gussets",
      tag: "Functional Geometry",
      angle: "side" as const,
      description:
        "Engineered with expandable internal bellows to accommodate an iPhone 16 Pro Max, keys, wallet, cosmetics, and sunglasses without distorting the clean outer silhouette.",
      specs: "Microfiber suede lining • Concealed security zip divider"
    },
    {
      numeral: "04",
      title: "Woven Chain & Ergonomic Rest",
      tag: "Balanced Carrying",
      angle: "top" as const,
      description:
        "Dual-link gold-tone chain balanced with a contour-stitched calfskin leather rest to distribute weight evenly and prevent shoulder strain during all-day carry.",
      specs: "52cm adjustable drop • Hand-burnished leather rest"
    }
  ]

  return (
    <section id="studio3d" className="py-20 md:py-28 bg-[#23170F] text-[#ECE2D8] relative overflow-hidden">
      {/* Ambient atelier lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-[#462F1D]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[420px] h-[420px] rounded-full bg-[#ECE2D8]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-6 bg-[#ECE2D8]/40" />
            <span className="text-xs sm:text-sm font-sans font-medium text-[#ECE2D8]">
              3D Interactive Atelier
            </span>
            <span className="h-px w-6 bg-[#ECE2D8]/40" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-white">
            Architectural Anatomy <br />
            <span className="italic font-normal text-[#ECE2D8]">In 360° Motion</span>
          </h2>

          <p className="text-base sm:text-lg text-[#ECE2D8]/85 font-light leading-relaxed max-w-lg mx-auto">
            Rotate the model, test leather swatches, and inspect the structural engineering that defines our luxury leather goods.
          </p>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: 3D Interactive WebGL Bag Canvas */}
          <div className="lg:col-span-7 h-[420px] xs:h-[480px] sm:h-[580px] rounded-2xl overflow-hidden border border-[#3D291B] bg-[#1A110B] shadow-2xl relative">
            <Bag3DCanvas
              initialColor="#462F1D"
              interactive={true}
              className="w-full h-full"
              showControls={true}
              cameraAngle={CRAFT_HIGHLIGHTS[selectedFeature].angle}
            />
          </div>

          {/* Right: Craftsmanship Breakdown & Architectural Hotspots */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#3D291B] pb-3">
              <span className="font-sans text-white font-medium text-xs sm:text-sm">
                Artisanal Components
              </span>
              <span className="text-xs text-[#ECE2D8]/75 font-sans">
                Tap component to inspect
              </span>
            </div>

            <div className="space-y-3">
              {CRAFT_HIGHLIGHTS.map((item, idx) => {
                const isActive = selectedFeature === idx
                return (
                  <button
                    key={item.title}
                    onClick={() => setSelectedFeature(idx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? "bg-[#2E1E14] border-[#ECE2D8]/60 shadow-lg translate-x-1"
                        : "bg-[#1F140D]/60 border-[#3D291B]/80 hover:bg-[#2A1B12]/80 hover:border-[#462F1D]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-sans font-semibold tracking-wider text-[#C5A880] bg-[#3D291B] px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 shrink-0">
                          {item.numeral}
                        </span>
                        <span className="text-xs font-sans font-medium text-[#ECE2D8]">
                          {item.tag}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C5A880] transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <h4 className="font-serif text-base sm:text-lg font-normal text-white mb-1.5">
                      {item.title}
                    </h4>

                    {isActive && (
                      <div className="mt-3 space-y-2 text-sm text-[#ECE2D8]/90 font-light animate-in fade-in duration-300">
                        <p className="leading-relaxed">{item.description}</p>
                        <div className="pt-2 border-t border-white/10 text-xs font-sans text-[#ECE2D8]/80 font-normal">
                          {item.specs}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Bottom Quiet Assurance */}
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-2 text-xs sm:text-sm font-sans text-[#ECE2D8]/85 font-normal border-t border-[#3D291B]">
              <span className="whitespace-nowrap">Complimentary Delivery</span>
              <span className="hidden sm:inline text-[#ECE2D8]/40">·</span>
              <span className="whitespace-nowrap">100% Cash On Delivery</span>
              <span className="hidden sm:inline text-[#ECE2D8]/40">·</span>
              <span className="whitespace-nowrap">7-Day Privilege</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

