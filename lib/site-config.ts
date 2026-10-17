export const STORE_CONTACT = {
  phone: "+923194186103",
  phoneLabel: "+92 319 4186103",
  email: "anorabags10@gmail.com",
  whatsapp: "https://wa.me/923194186103",
} as const

// Safe to share with the client-rendered checkout and tracking pages.
export const COLLECTIONS = [
  { label: "Crossbody Bags", id: "crossbody", href: "/shop?category=crossbody" },
  { label: "Top-Handle Bags", id: "top-handle", href: "/shop?category=top-handle" },
] as const

export const HELP_LINKS = [
  { label: "FAQs", href: "/faq" },
  { label: "Delivery policy", href: "/delivery-policy" },
  { label: "Return policy", href: "/return-policy" },
  { label: "Terms & conditions", href: "/terms-and-conditions" },
  { label: "Privacy policy", href: "/privacy-policy" },
] as const
