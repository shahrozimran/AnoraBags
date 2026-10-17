import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { HelpPage } from "@/components/anora/help-page"
import { FAQ_GROUPS } from "@/lib/faq"

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Help with Anora Bags orders, COD payments, colours, delivery, tracking, and 7-day returns.",
  alternates: { canonical: "/faq" },
}

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap(group => group.questions.map(item => ({
      "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))),
  }
  return (
    <HelpPage title="Frequently asked questions" description="The little details, made simple. Find answers about your order, your bag, and everything in between." path="/faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mb-8 flex flex-wrap gap-3 text-xs">
        <Link href="/track-order" className="rounded-full border border-[#D8C9BA] px-4 py-2.5 hover:bg-[#EDE2D7]">Track your order ↗</Link>
        <Link href="/return-policy" className="rounded-full border border-[#D8C9BA] px-4 py-2.5 hover:bg-[#EDE2D7]">Start a return ↗</Link>
      </div>
      <div className="space-y-10">
        {FAQ_GROUPS.map(group => (
          <section key={group.title}>
            <h2 className="mb-4 font-serif text-3xl">{group.title}</h2>
            <div className="overflow-hidden rounded-xl border border-[#E0D5C9] bg-white/60">
              {group.questions.map(item => (
                <details key={item.question} className="group border-b border-[#E0D5C9] last:border-0">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-sm font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#462F1D] [&::-webkit-details-marker]:hidden">
                    {item.question}<Plus className="h-4 w-4 shrink-0 text-[#806650] transition-transform group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="px-5 pb-6 text-sm leading-7 text-[#74604F]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </HelpPage>
  )
}
