# Anora Bags — Luxury 3D E-Commerce Maison

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-brown)]()

> *"Timeless Style, Modern You — Bags For Every You"*  
> An ultra-premium, minimalist quiet-luxury e-commerce platform for handcrafted leather bags. Featuring interactive real-time 3D motion customization, exclusive Cash On Delivery (COD) checkout, 7-day hassle-free doorstep refund guarantee, and a full-featured admin management portal.

---

## ✨ Features & Architecture

### 1. Interactive 3D Motion Atelier (`Three.js`)
- **Procedural 3D Bag Model**: Real-time rendering of full-grain pebbled calfskin leather, accordion gussets, 18k brushed gold/palladium hardware, and twist-lock mechanisms.
- **Dynamic Customization**: Live leather color switching (*Rich Chocolate Brown*, *Warm Nude*, *Obsidian Noir*, *Saddle Cognac*, *Bordeaux Wine*) and hardware finish toggling (*18k Brushed Gold* vs. *High-Polish Palladium Silver*).
- **Studio Camera Orbit Controls**: 4 preset view angles (*Front Silhouette*, *3/4 Perspective*, *Gusset Depth*, *Top Opening*) with rotational inertia and asymptotic cruise damping.
- **Fail-Safe Fallback**: Automatic WebGL capability detection with high-resolution 2D studio lookbook fallback for legacy or low-power devices.

### 2. Tailored Cash On Delivery (COD) Checkout
- **100% Cash On Delivery**: Engineered specifically for friction-free doorstep payment with zero online card requirements.
- **Nationwide Coverage**: Instant city selection for Pakistani urban hubs (*Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Sialkot, Quetta*) with doorstep parcel inspection guarantee.
- **Server-Side Validation**: Product prices recomputed from canonical database records to prevent client-side price manipulation.
- **Sequential Order Numbers**: Automated human-readable tracking identifiers (e.g. `ANR-2026-1001`).

### 3. 7-Day Hassle-Free Refund & Exchange Policy
- Dedicated policy page at `/refund-policy` with 3 core pillars:
  1. **7 Full Days**: Trial window begins from the moment of doorstep courier delivery.
  2. **At-Home Pickup**: Courier rider retrieves the item directly from the customer's address.
  3. **100% Refund**: Reimbursed within 24 hours via Bank Transfer, EasyPaisa, or JazzCash.

### 4. Full-Featured Admin Portal (`/admin`)
- **Passcode Protected Gate**: Server-verified, revocable 8-hour sessions. Set a unique ADMIN_KEY of at least 24 characters; no default credential is accepted.
- **Product Catalog Management**: Add new bags, edit pricing, specs, tags, stock availability, and featured status.
- **Order Lifecycle Management**: Live tracking of orders with status progression (*Confirmed → Dispatched → Out for Delivery → Delivered → Cancelled*).
- **Customer & Subscriber Directory**: Export newsletter subscribers and view patron purchase histories.
- **COD Financial Metrics**: Real-time gross order value, collected cash volume, and pending dispatches.

### 5. Zero-Cost Free Edge DB & Hosting Ready
- **Universal Storage Adapter**: Dual-mode data persistence running out-of-the-box via atomic local JSON store with Windows file-lock handling, and seamlessly switchable to free serverless PostgreSQL (*Neon*, *Supabase*) or *Turso* SQLite simply by setting `DATABASE_URL`.
- **Edge Deployment**: 100% compatible with Vercel and Cloudflare Pages free tier edge serverless functions.

### 6. Comprehensive SEO, AEO & GEO Suite
- **Domain**: Configured for `https://anorabags.com`.
- **AEO (Answer Engine Optimization)**: Rich Schema.org JSON-LD graphs (`OnlineStore`, `Organization`, `Product`, `FAQPage`, `BreadcrumbList`, `WebSite`).
- **GEO (Generative Engine Optimization)**: Explicit regional signals for Pakistan nationwide delivery, local currency (`Rs. / PKR`), and customer support.
- **Dynamic Assets**: Automated `/sitemap.xml` and `/robots.txt`.

---

## 🎨 Brand Design System

| Token | Hex Code | Description |
|---|---|---|
| **Primary Leather Brown** | `#462F1D` | Authentic logo mark chocolate brown |
| **Light Skin / Nude Tone** | `#ECE2D8` | Warm champagne nude accent |
| **Deep Text Dark** | `#23170F` | High-contrast roasted espresso |
| **Canvas Background** | `#FAF6F1` | Warm atelier porcelain foundation |
| **Border Tone** | `#E5DCD2` | Soft neutral divider |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+ (tested on Node.js v24.14.0)
- npm, pnpm, or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/zamadshakil/AnoraBags.git
cd AnoraBags

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production Build & Run
```bash
npm run build
npm run start
```

### Verification & Automated Audits
```bash
npx tsx scripts/test-audits.mjs
```

---

## 🔒 Security
- HTTP Security Headers enabled: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- Server-side price canonicalization and phone number validation.
- PII masking on public tracking endpoints (`/api/orders/track`).
- IDOR sequential enumeration prevention on order lookup routes.

---

© 2026 Anora Bags. All rights reserved. Handcrafted with devotion.

## Security configuration

- Install with npm ci. npm is the supported package manager and package-lock.json is authoritative.
- Set ADMIN_KEY to a unique random password of at least 24 characters in .env.local (local only) or your hosting secret manager. Admin access fails closed when it is missing. Never use NEXT_PUBLIC_ for secrets.
- Authentication uses HttpOnly, SameSite=Strict cookies, a server-side 8-hour expiry, and server-side logout revocation. Existing legacy admin cookies and browser-stored keys no longer authorize access.
- Runtime order, customer, newsletter, and admin-session data lives in ignored .anora-data/ by default. Existing data/anora-store.json is copied once on first use for compatibility. Use a private durable ANORA_DATA_DIR on a single writable host. Do not commit live data or expose this directory as static files.
- Production must use HTTPS. Serve next start behind a reverse proxy; never expose next dev publicly.
- Only enable TRUST_PROXY behind an ingress that overwrites x-forwarded-for. The built-in bounded limiter is process-local; without a trusted client IP it deliberately uses a shared bucket, so configure the ingress before public traffic. Multi-instance/serverless deployments also require a shared ingress/WAF rate limit and a transactional database. Set APP_ORIGIN to the canonical public origin if your reverse proxy rewrites Host.
- Customer confirmations require an HttpOnly order capability issued at checkout (30 days) or an authenticated staff session. Tracking requires the exact order number and full checkout mobile number, never a numeric ID or phone suffix. Phone matching is privacy protection, not an authenticated customer account or OTP verification.
- Run npm run test:security and npm run build. The security tests create disposable stores and never reset the live database. The legacy scripts/test-audits.mjs now delegates to this isolated suite.
- The optional remote Postgres adapter requires its supported HTTPS /sql endpoint; a raw generic PostgreSQL URL is not a complete tested hosting integration. Validate your actual provider before using it with customer data. Remote auth/session operations and order creation fail closed on backend failure.
