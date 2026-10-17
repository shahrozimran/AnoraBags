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
            <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
              Client Reviews
            </span>
            <span className="h-px w-6 bg-[#462F1D]/40" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
            Patron <span className="italic font-normal text-[#462F1D]">Reflections</span>
          </h2>

          <p className="text-base sm:text-lg text-[#462F1D] font-light leading-relaxed max-w-lg mx-auto">
            Authentic experiences from women who received our silhouettes via doorstep Cash on Delivery across Pakistan.
          </p>
        </div>

        {/* Featured Editorial Quote */}
        {featured && (
          <div className="mb-14 p-8 sm:p-12 rounded-2xl bg-white border border-[#E5DCD2] shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-5">
              <span className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
                Featured Review · {featured.location}
              </span>

              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#23170F] leading-[1.3] italic">
                "{featured.comment}"
              </p>

              <div className="pt-4 flex items-center justify-between text-sm border-t border-[#E5DCD2]/60">
                <div className="space-y-0.5">
                  <p className="text-base font-medium text-[#23170F]">{featured.author}</p>
                  <p className="text-xs sm:text-sm text-[#462F1D] font-normal">{featured.location} · Verified Cash On Delivery</p>
                </div>
                <div className="text-xs sm:text-sm font-sans font-medium text-[#462F1D]">
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
              className="bg-white/80 backdrop-blur-xs p-6 sm:p-7 rounded-xl border border-[#E5DCD2] shadow-2xs flex flex-col justify-between space-y-4 hover-luxury-lift hover:border-[#462F1D]/30 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-sans text-[#462F1D]">
                  <span className="font-medium">{rev.location}</span>
                  <span className="text-[#462F1D] font-semibold">5.0 ★</span>
                </div>

                <h4 className="font-serif font-normal text-[#23170F] text-lg leading-snug">
                  "{rev.title}"
                </h4>

                <p className="text-sm sm:text-base text-[#5A4333] font-light leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DCD2]/60 flex items-center justify-between text-xs sm:text-sm">
                <p className="font-medium text-[#23170F]">{rev.author}</p>
                <span className="text-xs font-sans font-medium text-[#462F1D] bg-[#ECE2D8]/60 px-2.5 py-1 rounded-full">
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

