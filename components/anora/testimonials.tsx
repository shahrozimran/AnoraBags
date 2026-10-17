"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, MapPin, Quote, Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { getProductMedia } from "@/lib/product-media"
import { SAMPLE_REVIEWS } from "@/lib/sample-reviews"

type SampleReview = (typeof SAMPLE_REVIEWS)[number]

function Stars({ rating, light = false }: { rating: number; light?: boolean }) {
  return (
    <span className="inline-flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="relative block w-3.5 h-3.5" aria-hidden="true">
          <Star className={`w-3.5 h-3.5 ${light ? "text-white/30" : "text-[#D9CEC2]"}`} />
          <span className="absolute left-0 top-0 h-full overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%` }}>
            <Star className={`w-3.5 h-3.5 max-w-none ${light ? "fill-[#E3C8A0] text-[#E3C8A0]" : "fill-[#9B713E] text-[#9B713E]"}`} />
          </span>
        </span>
      ))}
    </span>
  )
}

function Reviewer({ review }: { review: SampleReview }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEE5DA] text-xs font-semibold text-[#6A4E35]">{review.author.split(" ").map((word) => word[0]).join("")}</span>
      <div>
        <p className="text-sm font-medium text-[#23170F]">{review.author}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#796858]"><MapPin aria-hidden="true" className="w-3 h-3" />{review.location}</p>
      </div>
    </div>
  )
}

function ProductReference({ product, review }: { product: Product; review: SampleReview }) {
  const media = getProductMedia(product, review.color)
  const href = `/product/${product.id}${product.availableColors.length > 1 ? `?color=${encodeURIComponent(media.color)}` : ""}`
  return (
    <Link href={href} className="group/product flex items-center gap-3 min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#462F1D]">
      <span className="relative h-14 w-12 shrink-0 rounded-lg overflow-hidden border border-[#E5DCD2] bg-white"><Image src={media.image} alt={product.name} fill sizes="48px" className="object-contain" /></span>
      <span className="flex-1 min-w-0">
        <span className="block text-xs font-medium text-[#462F1D] leading-relaxed group-hover/product:underline underline-offset-4">{product.name}</span>
        <span className="block mt-0.5 text-[11px] text-[#796858]">{media.color}</span>
      </span>
      <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-[#796858]" />
    </Link>
  )
}

export function Testimonials({ products }: { products: Product[] }) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const reviews = SAMPLE_REVIEWS.filter((review) => products.some((product) => product.id === review.productId))
  const filtered = reviews.filter((review) => ratingFilter === null || review.rating === ratingFilter)
  const [featured, ...others] = filtered
  const featuredProduct = products.find((product) => product.id === featured?.productId)
  const featuredMedia = featuredProduct && featured ? getProductMedia(featuredProduct, featured.color) : null
  const featuredHref = featuredProduct && featuredMedia
    ? `/product/${featuredProduct.id}${featuredProduct.availableColors.length > 1 ? `?color=${encodeURIComponent(featuredMedia.color)}` : ""}`
    : "/shop"
  const visibleOthers = showAll ? others : others.slice(0, 3)
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0.0"

  if (!reviews.length) return null

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-16 sm:py-20 lg:py-24 bg-[#F5F0E9] border-b border-[#E5DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-[#72553B]"><span className="h-px w-7 bg-[#9B7E61]" />Reviews & Impressions</p>
            <h2 id="reviews-heading" className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-[-0.025em] text-[#23170F]">Small details.<br /><span className="italic text-[#72553B]">Lasting impressions.</span></h2>
          </div>
          <div className="max-w-xs space-y-2">
            <span className="inline-flex rounded-full border border-[#D8C9B8] bg-white/65 px-3 py-1 text-[11px] font-medium text-[#72553B]">Sample reviews</span>
            <p className="text-xs sm:text-sm leading-relaxed text-[#796858]">Illustrative feedback for this preview. These are not verified customer testimonials.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <aside className="lg:col-span-4 rounded-2xl bg-[#35251B] text-[#FAF6F1] p-6 sm:p-8 flex flex-col">
            <p className="text-xs font-medium text-[#E3C8A0] uppercase tracking-[0.12em]">At a glance</p>
            <div className="mt-4 flex items-baseline gap-2"><span className="font-serif text-6xl sm:text-7xl leading-none">{average}</span><span className="text-lg text-[#CFBBA8]">/ 5</span></div>
            <div className="mt-3 flex flex-wrap items-center gap-3"><Stars rating={Number(average)} light /><span className="text-xs text-[#DCCEBF]">Sample average · {reviews.length} examples</span></div>
            <div className="mt-7 space-y-2.5" aria-label="Sample rating distribution">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((review) => review.rating === rating).length
                return <div key={rating} className="flex items-center gap-3 text-xs text-[#E0D2C4]" aria-label={`${rating} stars: ${count} sample reviews`}><span className="w-5 flex items-center gap-1">{rating}<Star aria-hidden="true" className="w-2.5 h-2.5" /></span><span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden"><span className="block h-full bg-[#CFAD80] rounded-full" style={{width: `${count / reviews.length * 100}%`}} /></span><span className="w-3 text-right tabular-nums">{count}</span></div>
              })}
            </div>
            <Link href="/shop" className="mt-6 pt-5 border-t border-white/15 inline-flex items-center justify-between gap-2 text-sm text-[#FAF6F1] hover:underline underline-offset-4">Find your favourite <ArrowUpRight aria-hidden="true" className="w-4 h-4" /></Link>
          </aside>

          {featured && featuredProduct && featuredMedia && (
            <figure className="lg:col-span-8 grid sm:grid-cols-[1fr_170px] xl:grid-cols-[1fr_210px] rounded-2xl overflow-hidden border border-[#E0D5C9] bg-white">
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="flex items-center justify-between gap-4"><Stars rating={featured.rating} /><span className="text-[11px] text-[#796858]">Featured sample</span></div>
                <Quote aria-hidden="true" className="w-7 h-7 text-[#CBB59C] mt-5" />
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-normal leading-tight text-[#23170F]">{featured.title}</h3>
                <blockquote className="mt-4 text-sm sm:text-base leading-relaxed text-[#6E5A49]">“{featured.comment}”</blockquote>
                <figcaption className="mt-auto pt-6"><Reviewer review={featured} /></figcaption>
              </div>
              <Link href={featuredHref} className="relative bg-[#F9F6F1] p-5 sm:p-4 flex flex-col items-center justify-center gap-4 border-t sm:border-t-0 sm:border-l border-[#E5DCD2]">
                <span className="relative w-36 sm:w-full aspect-[4/5]"><Image src={featuredMedia.image} alt={`${featuredProduct.name} — ${featuredMedia.color}`} fill sizes="(max-width: 640px) 144px, 210px" className="object-contain" /></span>
                <span className="text-center"><span className="block font-serif text-base leading-snug text-[#462F1D]">{featuredProduct.name}</span><span className="inline-flex items-center gap-1 mt-2 text-[11px] text-[#796858]">Explore the bag <ArrowUpRight aria-hidden="true" className="w-3 h-3" /></span></span>
              </Link>
            </figure>
          )}
        </div>

        <div className="mt-8 sm:mt-10 pb-5 border-b border-[#DED2C4] flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#462F1D]">More perspectives <span className="ml-2 text-xs font-normal text-[#796858]">{filtered.length} sample {filtered.length === 1 ? "review" : "reviews"}</span></p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sample reviews by rating">
            {[null, 5, 4].map((rating) => <button key={rating ?? "all"} type="button" aria-pressed={ratingFilter === rating} onClick={() => {setRatingFilter(rating); setShowAll(false)}} className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${ratingFilter === rating ? "bg-[#462F1D] text-white border-[#462F1D]" : "bg-transparent text-[#72553B] border-[#D8C9B8] hover:bg-white/70"}`}>{rating === null ? "All reviews" : `${rating}-star`}</button>)}
          </div>
        </div>

        <div id="sample-review-cards" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5" aria-live="polite">
          {visibleOthers.map((review) => {
            const product = products.find((item) => item.id === review.productId)!
            return (
              <article key={review.id} data-review-type="sample" className="rounded-2xl border border-[#E0D5C9] bg-white p-5 sm:p-6 flex flex-col">
                <div className="flex items-center justify-between gap-3"><Stars rating={review.rating} /><span className="text-[10px] text-[#796858]">Sample review</span></div>
                <h3 className="mt-4 font-serif text-xl font-normal text-[#23170F] leading-snug">{review.title}</h3>
                <p className="mt-3 text-sm text-[#6E5A49] leading-relaxed">“{review.comment}”</p>
                <div className="mt-auto pt-5"><Reviewer review={review} /></div>
                <div className="mt-5 pt-4 border-t border-[#EEE6DD]"><ProductReference product={product} review={review} /></div>
              </article>
            )
          })}
        </div>
        {others.length > 3 && <div className="mt-7 text-center"><button type="button" aria-expanded={showAll} aria-controls="sample-review-cards" onClick={() => setShowAll((expanded) => !expanded)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-[#CDBBA7] text-sm font-medium text-[#462F1D] hover:bg-white transition-colors">{showAll ? "Show fewer reviews" : `Read ${others.length - 3} more sample reviews`}<ChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} /></button></div>}
      </div>
    </section>
  )
}
