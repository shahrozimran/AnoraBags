"use client"

import React, { useState } from "react"
import { subscribeAction } from "@/app/actions/newsletter"
import { ArrowRight, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")

    const formData = new FormData()
    formData.append("email", email)

    try {
      const res = await subscribeAction(formData)
      if (res.success) {
        setStatus("success")
        setMessage(res.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(res.message)
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="py-24 bg-[#23170F] text-[#ECE2D8] relative overflow-hidden border-b border-[#3D291B]">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[460px] h-[460px] rounded-full bg-[#462F1D]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[360px] h-[360px] rounded-full bg-[#ECE2D8]/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-6 bg-[#ECE2D8]/40" />
          <span className="text-xs sm:text-sm font-sans font-medium text-[#ECE2D8]">
            Private Invitations
          </span>
          <span className="h-px w-6 bg-[#ECE2D8]/40" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-white">
          Private Invitations <br />
          <span className="italic font-normal text-[#ECE2D8]">To Rare Silhouettes</span>
        </h2>

        <p className="text-base sm:text-lg text-[#ECE2D8]/90 font-light max-w-lg mx-auto leading-relaxed">
          Patrons receive discreet notifications for limited-batch leather drops, upcoming satchel releases, and private trunk showings.
        </p>

        {status === "success" ? (
          <div className="p-4 rounded-xl bg-[#2E1E14] border border-[#ECE2D8]/30 max-w-md mx-auto flex items-center justify-center gap-2 text-sm text-[#ECE2D8]">
            <Check className="w-5 h-5 text-[#ECE2D8]" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-hidden focus:border-[#ECE2D8] transition font-sans"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 rounded-full bg-[#ECE2D8] hover:bg-white text-[#23170F] font-sans font-medium text-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{status === "loading" ? "Subscribing..." : "Subscribe"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-sm text-rose-300 font-medium">{message}</p>
        )}

        <p className="text-xs font-sans text-[#ECE2D8]/70 font-normal">
          Strict confidentiality · Zero promotional spam
        </p>
      </div>
    </section>
  )
}

