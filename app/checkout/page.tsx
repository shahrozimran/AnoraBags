"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/anora/cart-context"
import { placeOrderAction } from "@/app/actions/order"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import { ArrowRight, ShoppingBag, Check } from "lucide-react"

const POPULAR_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Sialkot",
  "Quetta"
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, total, clearCart } = useCart()

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    apartment: "",
    city: "Lahore",
    postalCode: "",
    deliveryNotes: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      setErrorMessage("Your shopping bag is empty.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    const fData = new FormData()
    fData.append("customerName", formData.customerName)
    fData.append("phone", formData.phone)
    fData.append("email", formData.email)
    fData.append("address", formData.address)
    fData.append("apartment", formData.apartment)
    fData.append("city", formData.city)
    fData.append("postalCode", formData.postalCode)
    fData.append("deliveryNotes", formData.deliveryNotes)

    try {
      const res = await placeOrderAction(fData, items)
      if (res.success && res.orderNumber) {
        clearCart()
        router.push(`/order-confirmation/${res.orderNumber}`)
      } else {
        setErrorMessage(res.message || "Failed to place order.")
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        {/* Title */}
        <div className="mb-12 text-center sm:text-left space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#462F1D]/40" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase font-semibold text-[#755944]">
              Service De Conciergerie
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#23170F]">
            Doorstep Concierge <span className="italic font-normal text-[#462F1D]">Order</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#755944] font-light max-w-xl leading-relaxed">
            100% Cash On Delivery. Zero advance payment or credit card required. Inspect parcel condition in person before settling with the courier.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-[#E5DCD2] text-center max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#ECE2D8]/40 border border-[#E5DCD2] flex items-center justify-center mx-auto text-[#755944]">
              <ShoppingBag className="w-6 h-6 stroke-1" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-light text-[#23170F]">Your atelier bag is empty</h2>
              <p className="text-xs text-[#755944] max-w-sm mx-auto font-light leading-relaxed">
                Please select a handcrafted leather silhouette from our permanent collection to continue.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/#collection"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#462F1D] text-[#FAF6F1] text-xs font-sans tracking-[0.2em] uppercase font-medium hover:bg-[#23170F] transition"
              >
                <span>Browse The Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Mobile Quick Order Summary (Streamlined single-column mobile view) */}
            <div className="lg:hidden col-span-12 p-4 rounded-2xl bg-white border border-[#E5DCD2] shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ECE2D8] flex items-center justify-center text-[#462F1D]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#755944]">Atelier Selection</span>
                  <p className="font-serif text-sm font-normal text-[#23170F]">
                    {items.length} silhouette{items.length > 1 ? "s" : ""} • Rs. {total.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="text-[9.5px] font-sans font-medium text-[#462F1D] bg-[#ECE2D8]/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Complimentary COD
              </span>
            </div>

            {/* Left 7 Columns: Client Details & Delivery Info */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Step I: Client Details */}
              <div className="bg-white p-4 xs:p-6 sm:p-8 rounded-2xl border border-[#E5DCD2] shadow-2xs space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-[#E5DCD2]/70 pb-3 sm:pb-4">
                  <div className="flex items-baseline gap-2.5 sm:gap-3">
                    <span className="font-serif italic text-sm text-[#462F1D]">I.</span>
                    <h2 className="font-serif text-base sm:text-lg font-light text-[#23170F] tracking-wide">
                      Client Particulars
                    </h2>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-wider uppercase text-[#755944]">
                    * Required for Dispatch
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                      Mobile Number (For Courier Call) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0300 1234567"
                      className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition font-mono"
                    />
                    <p className="text-[10px] text-[#9E8B7C] font-light">Courier rider will coordinate doorstep delivery</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                      Email Address (Discreet Updates)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ayesha@example.com"
                      className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Step II: Delivery Address */}
              <div className="bg-white p-4 xs:p-6 sm:p-8 rounded-2xl border border-[#E5DCD2] shadow-2xs space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-[#E5DCD2]/70 pb-3 sm:pb-4">
                  <div className="flex items-baseline gap-2.5 sm:gap-3">
                    <span className="font-serif italic text-sm text-[#462F1D]">II.</span>
                    <h2 className="font-serif text-base sm:text-lg font-light text-[#23170F] tracking-wide">
                      Doorstep Shipping Address
                    </h2>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-wider uppercase text-[#462F1D] font-medium bg-[#ECE2D8]/60 px-2.5 py-0.5 rounded-full">
                    Express Nationwide
                  </span>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                      Street Address & Residence / Office *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House / Flat #, Street name, Sector / Area"
                      className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                        Apartment, Floor, Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        placeholder="Suite 4B, Floor 2"
                        className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lahore, Karachi, Islamabad"
                        className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition"
                      />
                    </div>
                  </div>

                  {/* City Quick-Select */}
                  <div className="pt-1">
                    <span className="text-[10px] font-sans tracking-wider uppercase text-[#755944] block mb-1.5">
                      Quick Select City:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, city: c }))}
                          className={`text-[11px] sm:text-[10px] px-2.5 sm:px-3 py-1.5 rounded-full border transition font-sans ${
                            formData.city.toLowerCase() === c.toLowerCase()
                              ? "bg-[#462F1D] text-[#FAF6F1] border-[#462F1D]"
                              : "bg-white text-[#5A4333] border-[#E5DCD2] hover:bg-[#FAF6F1]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-medium text-[#755944] uppercase tracking-wider">
                      Concierge Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="deliveryNotes"
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      placeholder="e.g. Please deliver after 2 PM or contact security reception if unavailable"
                      className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-[#E5DCD2] text-[#23170F] text-base sm:text-xs focus:outline-hidden focus:border-[#462F1D] bg-[#FAF6F1]/40 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Step III: Payment Method (Cash On Delivery Only) */}
              <div className="bg-white p-4 xs:p-6 sm:p-8 rounded-2xl border border-[#E5DCD2] shadow-2xs space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5DCD2]/70 pb-3 sm:pb-4">
                  <div className="flex items-baseline gap-2.5 sm:gap-3">
                    <span className="font-serif italic text-sm text-[#462F1D]">III.</span>
                    <h2 className="font-serif text-base sm:text-lg font-light text-[#23170F] tracking-wide">
                      Payment Privilege
                    </h2>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-wider uppercase text-[#462F1D] font-medium">
                    100% Cash on Delivery
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl border border-[#462F1D]/40 bg-[#ECE2D8]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-serif font-normal text-[#23170F]">
                        Cash On Delivery (COD)
                      </h4>
                      <p className="text-xs text-[#755944] font-light mt-0.5">
                        Pay exact cash to courier upon doorstep parcel inspection.
                      </p>
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-sans uppercase tracking-wider text-[#462F1D] bg-[#ECE2D8] px-2.5 py-1 rounded-full font-semibold">
                      Zero Advance Fee
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#E5DCD2] text-xs text-[#5A4333] space-y-1.5 font-light">
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#462F1D] shrink-0" />
                      <span>No bank card or advance online payment required.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#462F1D] shrink-0" />
                      <span>Inspect package condition at your doorstep before handing cash to the courier.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#462F1D] shrink-0" />
                      <span>7-Day Unconditional Home Return Privilege commences upon delivery.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Atelier Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DCD2] shadow-sm space-y-6 sticky top-24">
                <div className="flex items-center justify-between border-b border-[#E5DCD2] pb-4">
                  <h3 className="font-serif text-lg font-light text-[#23170F]">Atelier Receipt</h3>
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#755944]">
                    {items.length} item(s)
                  </span>
                </div>

                {/* Items preview */}
                <div className="divide-y divide-[#E5DCD2]/60 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.color}`} className="py-3.5 flex items-center gap-3 first:pt-0">
                      <div className="relative w-14 h-16 rounded-md overflow-hidden bg-[#FAF6F1] shrink-0 border border-[#E5DCD2]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-serif font-normal text-[#23170F] line-clamp-1">{item.name}</p>
                        <p className="text-[#755944] text-[11px] mt-0.5">Shade: {item.color}</p>
                        <p className="text-[#9E8B7C] text-[10px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-serif text-[#23170F]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Math */}
                <div className="pt-4 border-t border-[#E5DCD2] space-y-2 text-xs">
                  <div className="flex justify-between text-[#755944]">
                    <span>Pieces Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#755944]">
                    <span>Nationwide Express Courier</span>
                    <span className="text-[#462F1D] font-medium tracking-wide uppercase text-[10px]">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between text-[#755944]">
                    <span>Settlement Method</span>
                    <span className="text-[#23170F] font-medium">Cash On Delivery</span>
                  </div>
                  <div className="flex justify-between text-[#23170F] font-normal text-sm pt-4 border-t border-[#E5DCD2]">
                    <span className="font-sans text-xs uppercase tracking-wider">Total Due at Doorstep</span>
                    <span className="font-serif text-xl text-[#462F1D]">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Confirm Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#462F1D] hover:bg-[#23170F] text-[#FAF6F1] font-sans font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Generating Concierge Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Confirm Cash On Delivery Order</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Assurance details */}
                <div className="p-4 rounded-xl bg-[#FAF6F1] border border-[#E5DCD2] space-y-1.5 text-[11px] text-[#755944]">
                  <p className="font-serif text-xs text-[#23170F]">
                    The 7-Day Unconditional Privilege
                  </p>
                  <p className="font-light leading-relaxed">
                    Inspect your parcel with the courier rider. If anything falls short of expectations, our concierge arranges doorstep collection for a prompt refund.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}

