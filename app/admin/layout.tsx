import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Command Center — Anora Bags Staff Portal",
  description: "Anora Bags staff management console.",
  robots: {
    index: false,
    follow: false
  }
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
