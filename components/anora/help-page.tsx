import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react"
import { Header } from "./header"
import { Footer } from "./footer"
import { CartDrawer } from "./cart-drawer"
import { HELP_LINKS, STORE_CONTACT } from "@/lib/site-config"

export interface HelpSection {
  id: string
  title: string
  content: ReactNode
}

interface HelpPageProps {
  title: string
  description: string
  path: string
  children?: ReactNode
  sections?: HelpSection[]
}

export function HelpPage({ title, description, path, children, sections }: HelpPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      <Header />
      <CartDrawer />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-xs text-[#7A6656]">
          <Link href="/" className="hover:underline">Home</Link><span aria-hidden="true">/</span>
          <Link href="/faq" className="hover:underline">Customer care</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[#34251B]">{title}</span>
        </nav>
        <div className="mb-10 border-b border-[#E2D8CE] pb-10 sm:mb-12 sm:pb-12">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#806650]">Here to help</p>
          <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#74604F]">{description}</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <nav aria-label="Customer care pages" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {HELP_LINKS.map(({ label, href }) => (
                  <Link key={href} href={href} aria-current={path === href ? "page" : undefined}
                    className={`rounded-lg px-4 py-3 text-sm transition-colors ${path === href ? "bg-[#EDE2D7] font-medium text-[#34251B]" : "text-[#74604F] hover:bg-[#F0E8E0] hover:text-[#34251B]"}`}>{label}</Link>
                ))}
              </nav>
              <div className="mt-8 rounded-xl border border-[#DED1C4] p-5">
                <h2 className="font-serif text-2xl">A personal touch.</h2>
                <p className="mt-2 text-sm leading-6 text-[#74604F]">Need a hand with your order? We’re a message away.</p>
                <a href={STORE_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-sm font-medium hover:underline"><MessageCircle className="h-4 w-4" aria-hidden="true" />Chat on WhatsApp<ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" /></a>
                <a href={`mailto:${STORE_CONTACT.email}`} className="mt-4 flex items-center gap-2 break-all text-xs text-[#74604F] hover:underline"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{STORE_CONTACT.email}</a>
              </div>
            </div>
          </aside>
          <div className="min-w-0 max-w-3xl">
            {children}
            {sections && <div className="space-y-8">
              {sections.map(({ id, title: sectionTitle, content }, index) => (
                <section key={id} id={id} className="scroll-mt-28 border-b border-[#E2D8CE] pb-8 last:border-0">
                  <div className="mb-4 flex items-start gap-4">
                    <span className="mt-1 text-xs text-[#A08771]">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="font-serif text-3xl">{sectionTitle}</h2>
                  </div>
                  <div className="space-y-4 text-sm leading-7 text-[#6D5847] [&_a]:font-medium [&_a]:text-[#34251B] [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{content}</div>
                </section>
              ))}
            </div>}
            <div className="mt-10 flex flex-col gap-4 border-t border-[#E2D8CE] pt-6 text-sm text-[#74604F] sm:flex-row sm:items-center sm:justify-between">
              <p>Still have a question? <Link href="/contact" className="text-[#34251B] underline underline-offset-4">Get in touch</Link></p>
              <Link href="/shop" className="inline-flex items-center gap-2 text-[#34251B]">Explore the collection<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
