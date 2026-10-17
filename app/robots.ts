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
        // Explicitly welcome AI Answer Engines (AEO + GEO)
        // Covers: ChatGPT, Perplexity, Claude, Bing Copilot, Meta AI,
        // Apple Intelligence, Google AI Overviews, Cohere, Diffbot, Amazon
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Applebot",
          "Applebot-Extended",
          "Google-Extended",
          "BingBot",
          "msnbot",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "Diffbot",
          "cohere-ai",
          "Amazonbot",
          "Bytespider",
          "YouBot",
          "Timpibot"
        ],
        allow: ["/", "/shop", "/product/*", "/return-policy", "/delivery-policy", "/faq", "/terms-and-conditions", "/privacy-policy", "/about", "/contact", "/track-order", "/sitemap.xml"],
        disallow: ["/admin", "/admin/*", "/checkout", "/order-confirmation/*", "/api/*"]
      }
    ],
    sitemap: "https://anorabags.com/sitemap.xml",
    host: "https://anorabags.com"
  }
}
