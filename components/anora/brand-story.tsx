"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export function BrandStory() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden border-b border-[#E5DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Spread 1: The Atelier Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28">
          {/* Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8] shadow-sm relative group">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/images/products/bordeaux-crossbody-model.jpeg"
                    alt="Anora Bags Model Lookbook"
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#23170F]/75 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-5 left-5 text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    Pl. 01 · Campaign Lookbook
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-[#FAF6F1] space-y-1.5">
                    <p className="font-serif italic text-xl sm:text-2xl text-[#ECE2D8]">
                      "Quiet luxury is felt in the weight of the brass and the softness of the grain."
                    </p>
                    <p className="text-xs font-sans text-white/80 font-medium">
                      Anora Design Studio
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimalist Caption Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 p-6 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] shadow-xl max-w-xs hidden sm:block">
                <span className="text-xs font-sans font-medium text-[#462F1D] block mb-1.5">
                  Design Philosophy
                </span>
                <p className="text-sm text-[#3D291B] font-normal leading-relaxed">
                  Crafted for the woman who demands aesthetic restraint without sacrificing daily practical capacity.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Copy Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#462F1D]/40" />
                <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
                  Craft & Philosophy
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F] leading-[1.08]">
                Quiet Distinction, <br />
                <span className="italic font-normal text-[#462F1D]">Sculpted Balance.</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#3D291B] font-light leading-relaxed">
              At Anora, we believe true luxury exists in unpretentious tactility. We deliberately reject seasonal fads in favor of geometric silhouettes that look as commanding today as they will in a decade.
            </p>

            <div className="space-y-5 pt-4 border-t border-[#E5DCD2]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-sans font-semibold text-[#462F1D] bg-[#ECE2D8] px-2.5 py-0.5 rounded-full border border-[#462F1D]/20 shrink-0">
                    01
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[#23170F]">
                    Full-Grain Drum-Dyed Calfskin
                  </h4>
                </div>
                <p className="text-sm sm:text-base text-[#462F1D] font-normal leading-relaxed">
                  Selected for supple hand-feel, structural density, and natural patina that develops character over years of everyday carry.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-sans font-semibold text-[#462F1D] bg-[#ECE2D8] px-2.5 py-0.5 rounded-full border border-[#462F1D]/20 shrink-0">
                    02
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[#23170F]">
                    Custom 18k Brushed Gold Hardware
                  </h4>
                </div>
                <p className="text-sm sm:text-base text-[#462F1D] font-normal leading-relaxed">
                  Every clasp, link, and grommet is custom cast from solid brass alloy for weight and a satisfying mechanical click.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-sans font-semibold text-[#462F1D] bg-[#ECE2D8] px-2.5 py-0.5 rounded-full border border-[#462F1D]/20 shrink-0">
                    03
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[#23170F]">
                    7-Day Unconditional Home Privilege
                  </h4>
                </div>
                <p className="text-sm sm:text-base text-[#462F1D] font-normal leading-relaxed">
                  Pay cash to the courier only upon doorstep parcel inspection. Enjoy 7 full days to try it with your wardrobe.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/refund-policy"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-[#462F1D] hover-editorial-line"
              >
                <span>Read the 7-day guarantee</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Story Spread 2: Interior Functional Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-20 border-t border-[#E5DCD2]">
          <div className="lg:col-span-6 space-y-6 lg:order-1 order-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#462F1D]/40" />
                <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
                  Interior Architecture & Fit
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
                Thoughtful Capacity <br />
                <span className="italic font-normal text-[#462F1D]">Without Architectural Bulk</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#3D291B] font-light leading-relaxed">
              Minimalist geometry on the outside, spacious utility on the inside. Our accordion bellows expand gracefully to fit your smartphone, lip tint, keys, wallet, sunglasses, and pocket fragrance with dedicated dividers.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3">
              <div className="p-4 sm:p-6 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] flex flex-col justify-between">
                <div>
                  <div className="h-9 sm:h-11 flex items-baseline">
                    <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#462F1D]">3 Tiers</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-[#23170F] mt-1.5 sm:mt-2 min-h-[2.5rem] flex items-center">
                    Accordion Dividers
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#462F1D] font-normal mt-1 sm:mt-2 leading-relaxed">
                  Dedicated compartments for cosmetics, cards, and daily essentials.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] flex flex-col justify-between">
                <div>
                  <div className="h-9 sm:h-11 flex items-baseline">
                    <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#462F1D]">6.9&quot;</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-[#23170F] mt-1.5 sm:mt-2 min-h-[2.5rem] flex items-center">
                    Max Smartphone Fit
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#462F1D] font-normal mt-1 sm:mt-2 leading-relaxed">
                  Comfortably accommodates iPhone 16 Pro Max & Samsung Ultra devices.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-2 order-1">
            <div className="rounded-2xl overflow-hidden border border-[#E5DCD2] bg-[#F5EFE8] shadow-sm relative group">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/products/bordeaux-crossbody-interior.jpeg"
                  alt="Anora Bag Interior Capacity & Compartments"
                  fill
                  className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-4 left-4 text-xs font-medium text-white/95 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                  Fig. 02 · Accordion Gusset Cavity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

