import Link from "next/link"
import { ArrowUpRight, Banknote, Mail, MessageCircle, Phone, RotateCcw, Truck } from "lucide-react"
import { BrandLogo } from "./brand-logo"
import { COLLECTIONS, HELP_LINKS, STORE_CONTACT } from "@/lib/site-config"

const linkStyle = "py-1 text-[#CFC2B7] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8D9C9]"

export function Footer() {
  return (
    <footer id="footer" className="bg-[#211A16] text-[#F6F0EA]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-3 sm:gap-8">
          {[
            { icon: Truck, title: "Delivered across Pakistan", text: "Free nationwide delivery", href: "/delivery-policy" },
            { icon: Banknote, title: "Pay when it arrives", text: "Cash on delivery only", href: "/delivery-policy#payment" },
            { icon: RotateCcw, title: "A little peace of mind", text: "7-day returns & exchanges", href: "/return-policy" },
          ].map(({ icon: Icon, title, text, href }) => (
            <Link key={title} href={href} className="group flex items-center gap-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <Icon className="h-5 w-5 shrink-0 text-[#C8AF96]" strokeWidth={1.4} aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-[#CFC2B7]">{text}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#C8AF96] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="grid gap-x-10 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.25fr_0.85fr_1fr] lg:py-14">
          <div>
            <Link href="/" aria-label="Anora Bags home" className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <BrandLogo size="lg" variant="light" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#CFC2B7]">Bags for every you. Thoughtful shapes and everyday favourites, delivered to your door.</p>
            <Link href="/shop" className="mt-5 inline-flex items-center gap-2 border-b border-[#C8AF96]/50 pb-1 text-sm transition-colors hover:text-[#C8AF96]">
              Find your everyday bag <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <nav aria-label="Footer collection">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#AFA094]">Collections</h2>
            <ul className="space-y-1 text-sm">
              {COLLECTIONS.map(({ label, href }) => <li key={href}><Link className={linkStyle} href={href}>{label}</Link></li>)}
              <li><Link className={`${linkStyle} mt-1 text-[#F6F0EA]`} href="/shop">Shop all bags ↗</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer customer care">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#AFA094]">Customer care</h2>
            <ul className="space-y-1 text-sm">
              {HELP_LINKS.slice(0, 3).map(({ label, href }) => <li key={href}><Link className={linkStyle} href={href}>{label}</Link></li>)}
              <li><Link href="/about" className={linkStyle}>Our story</Link></li>
              <li><Link href="/contact" className={linkStyle}>Contact us</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#AFA094]">Let’s talk</h2>
            <div className="space-y-3 text-sm">
              <a href={`tel:${STORE_CONTACT.phone}`} className={`${linkStyle} flex items-center gap-2.5`}><Phone className="h-4 w-4 shrink-0" aria-hidden="true" />{STORE_CONTACT.phoneLabel}</a>
              <a href={`mailto:${STORE_CONTACT.email}`} className={`${linkStyle} flex items-center gap-2.5 break-all`}><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{STORE_CONTACT.email}</a>
              <a href={STORE_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-[#B7A99E] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Anora Bags. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/terms-and-conditions" className="hover:text-white">Terms & conditions</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link>
            <a href="#top" className="inline-flex items-center gap-1 hover:text-white">Back to top <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

