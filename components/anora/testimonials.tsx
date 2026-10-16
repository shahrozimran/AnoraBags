"use client"

import React from "react"
import { SEED_REVIEWS } from "@/lib/seed-data"

export function Testimonials() {
  const featured = SEED_REVIEWS[0]
  const others = SEED_REVIEWS.slice(1)

  return (
    <section className="py-24 md:py-32 bg-[#FAF6F1] border-b border-[#E5DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-6 bg-[#462F1D]/40" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase font-semibold text-[#755944]">
              Témoignages Vérifiés
            </span>
            <span className="h-px w-6 bg-[#462F1D]/40" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
            Patron <span className="italic font-normal text-[#462F1D]">Reflections</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#755944] font-light leading-relaxed max-w-md mx-auto">
            Authentic experiences from women who received our silhouettes via doorstep Cash on Delivery across Pakistan.
          </p>
        </div>

        {/* Featured Editorial Quote */}
        {featured && (
          <div className="mb-14 p-8 sm:p-12 rounded-2xl bg-white border border-[#E5DCD2] shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-5">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#755944] font-semibold">
                Featured Experience • {featured.location}
              </span>

              <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-[#23170F] leading-[1.3] italic">
                "{featured.comment}"
              </p>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E5DCD2]/60">
                <div className="space-y-0.5">
                  <p className="font-medium text-[#23170F]">{featured.author}</p>
                  <p className="text-[11px] text-[#755944] font-light">{featured.location} • Verified Cash On Delivery</p>
                </div>
                <div className="text-[11px] tracking-widest font-sans uppercase text-[#462F1D] font-semibold">
                  5.0 ★ Rating
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {others.map((rev) => (
            <div
              key={rev.id}
              className="bg-white/80 backdrop-blur-xs p-6 rounded-xl border border-[#E5DCD2] shadow-2xs flex flex-col justify-between space-y-4 hover-luxury-lift hover:border-[#462F1D]/30 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] tracking-widest font-sans uppercase text-[#755944]">
                  <span>{rev.location}</span>
                  <span className="text-[#462F1D] font-semibold">5.0 ★</span>
                </div>

                <h4 className="font-serif font-normal text-[#23170F] text-base leading-snug">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-[#5A4333] font-light leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DCD2]/60 flex items-center justify-between text-xs">
                <p className="font-medium text-[#23170F] text-[11px]">{rev.author}</p>
                <span className="text-[10px] font-sans tracking-wider uppercase text-[#462F1D] bg-[#ECE2D8]/60 px-2 py-0.5 rounded-full">
                  Verified COD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

