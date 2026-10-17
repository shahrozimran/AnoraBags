"use client"

import React, { useState } from "react"
import Link from "next/link"
import { subscribeAction } from "@/app/actions/newsletter"
import { ArrowRight, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "loading") return
    setStatus("loading")
    setMessage("")
    const formData = new FormData()
    formData.append("email", email)
    try {
      const res = await subscribeAction(formData)
      setStatus(res.success ? "success" : "error")
      setMessage(res.message)
      if (res.success) setEmail("")
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="border-t border-[#E0D5C9] bg-[#EEE5DC]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#76614F]">The Anora edit</p>
          <h2 id="newsletter-title" className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Good things. In your inbox.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#6C5848]">New arrivals, fresh favourites, and a little style inspiration. Stay in the loop with Anora.</p>
        </div>
        <div>
          {status === "success" ? (
            <div role="status" className="flex min-h-14 items-center gap-3 rounded-xl border border-[#CABBAC] bg-white/50 p-4 text-sm">
              <Check className="h-5 w-5 shrink-0" aria-hidden="true" /><p>{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-label="Newsletter signup">
              <label htmlFor="newsletter-email" className="mb-2.5 block text-xs font-medium text-[#594333]">Your email address</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input id="newsletter-email" name="email" type="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={254}
                  aria-invalid={status === "error"} aria-describedby={status === "error" ? "newsletter-error" : "newsletter-privacy"}
                  className="min-w-0 flex-1 rounded-lg border border-[#CBBAAA] bg-white/60 px-4 py-3.5 text-sm placeholder:text-[#897566] focus:border-[#462F1D] focus:outline-2 focus:outline-offset-2 focus:outline-[#462F1D]" />
                <button type="submit" disabled={status === "loading"} className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg bg-[#34251B] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#503926] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#462F1D] disabled:opacity-60">
                  {status === "loading" ? "Joining…" : "Join the list"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {status === "error" && <p id="newsletter-error" role="alert" className="mt-3 text-sm text-[#991B1B]">{message}</p>}
            </form>
          )}
          <p id="newsletter-privacy" className="mt-3 text-xs leading-5 text-[#715D4D]">By subscribing, you agree to our <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#23170F]">privacy policy</Link>. Contact us anytime to unsubscribe.</p>
        </div>
      </div>
    </section>
  )
}

