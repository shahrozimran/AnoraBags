import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/checkout",
          "/order-confirmation/*",
          "/api/*"
        ]
      },
      {
        // Explicitly welcome AI Answer Engines (AEO)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Applebot",
          "Google-Extended"
        ],
        allow: ["/", "/shop", "/product/*", "/refund-policy", "/about", "/contact", "/track-order"],
        disallow: ["/admin", "/admin/*", "/checkout", "/order-confirmation/*", "/api/*"]
      }
    ],
    sitemap: "https://anorabags.com/sitemap.xml",
    host: "https://anorabags.com"
  }
}
