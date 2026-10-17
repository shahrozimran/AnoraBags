import type { Product, Review } from './types'
import { CITY_CHAIN_BAG, ESPRESSO_CURVE_BAG, NAVY_SIGNATURE_BAG, NOIR_GEOMETRIC_BAG } from './catalog-products'

export const SEED_PRODUCTS: Product[] = [
  NOIR_GEOMETRIC_BAG,
  CITY_CHAIN_BAG,
  NAVY_SIGNATURE_BAG,
  ESPRESSO_CURVE_BAG,
  {
    id: 'the-anora-bordeaux-flap-crossbody',
    name: 'The Anora Bordeaux Flap Crossbody',
    tagline: 'Timeless Style, Modern You — Bags For Every You',
    price: 2799,
    originalPrice: null,
    currency: 'Rs.',
    category: 'crossbody',
    colorName: 'Rich Bordeaux Wine',
    colorHex: '#4A1525',
    availableColors: [
      { name: 'Rich Bordeaux Wine', hex: '#4A1525', inStock: true }
    ],
    badge: 'Signature Bestseller',
    image: '/images/products/bordeaux-white/front.webp',
    images: [
      '/images/products/bordeaux-white/front.webp',
      '/images/products/bordeaux-crossbody-hero.jpeg',
      '/images/products/bordeaux-crossbody-lifestyle.jpeg',
      '/images/products/bordeaux-crossbody-model.jpeg',
      '/images/products/bordeaux-crossbody-interior.jpeg'
    ],
    description: 'The defining silhouette of the Anora collection. Meticulously handcrafted from rich wine pebbled calfskin leather, crowned with our custom 18k brushed gold circular locking mechanism. Designed to transition effortlessly from morning boardroom meetings to intimate evening candlelight dinners.',
    story: 'Conceived in our bespoke atelier with the guiding ethos: "Carry Confidence Everyday". We created an architectural flap design that maintains its pristine geometric silhouette regardless of how much you carry inside.',
    features: [
      'Genuine full-grain pebbled calfskin leather with hand-painted burnished edges',
      'Architectural 18k brushed gold circular twist-lock clasp mechanism',
      'Triple accordion interior compartments with dedicated zippered security pocket',
      'Dual carrying options: woven gold chain link or adjustable leather shoulder strap',
      'Accommodates iPhone 16 Pro Max, perfume atomiser, lip tint, sunglasses, and cardholder',
      '7-Day Hassle-Free Returns & 100% Cash on Delivery'
    ],
    specs: {
      dimensions: '22 cm (W) × 17 cm (H) × 9 cm (D)',
      weight: '480 grams (ultra-lightweight comfort)',
      material: 'Full-Grain Pebbled Calfskin Leather',
      hardware: '18k Brushed Champagne Gold Brass',
      strapDrop: '52 cm (Adjustable for shoulder or crossbody carry)',
      capacity: 'Multi-compartment accordion with center zip divider',
      closure: 'Mechanical Circular Twist-Lock',
      origin: 'Bespoke Handcrafted Leather Atelier'
    },
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    featured: true,
    isNew: false,
    supports3D: false
  },
  {
    id: 'the-anora-petit-ivory-handbag',
    name: 'The Anora Petit Ivory Top-Handle Handbag',
    tagline: 'Minimalist Sculptural Elegance for Day & Evening',
    price: 2799,
    originalPrice: null,
    currency: 'Rs.',
    category: 'top-handle',
    colorName: 'Alabaster Ivory Cream',
    colorHex: '#F5F0E6',
    availableColors: [
      { name: 'Alabaster Ivory Cream', hex: '#F5F0E6', inStock: true }
    ],
    badge: 'New Arrival',
    image: '/images/products/ivory-white/front.webp',
    images: [
      '/images/products/ivory-white/front.webp',
      '/images/products/ivory-top-handle.jpeg'
    ],
    description: 'A pure embodiment of minimalist quiet luxury. Clean sculptural curves, pristine ivory smooth calfskin, and architectural palladium silver lock detailing. A statement in refined simplicity.',
    story: 'Designed for the modern woman who embraces clean lines and effortless sophistication. Perfect for gallery openings, chic brunches, and evening soirées.',
    features: [
      'Silky smooth calfskin leather with water-repellent protective finish',
      'Curved sculptural silhouette with structured base',
      'High-polish palladium silver rectangular monogram clasp',
      'Tubular structured top handle with ergonomic palm contour',
      'Interior card organizer and magnetic security closure',
      '7-Day Hassle-Free Returns & 100% Cash on Delivery'
    ],
    specs: {
      dimensions: '20 cm (W) × 16 cm (H) × 8 cm (D)',
      weight: '410 grams (Feather-light)',
      material: 'Smooth Aniline Calfskin Leather',
      hardware: 'High-Polish Palladium Silver Alloy',
      strapDrop: '50 cm (Detachable fine leather shoulder strap)',
      capacity: 'Optimized for smartphones, card sleeve, keys, lip gloss',
      closure: 'Magnetic Lock Mechanism',
      origin: 'Curated Artisan Workshop'
    },
    rating: 4.88,
    reviewCount: 64,
    inStock: true,
    featured: true,
    isNew: true,
    supports3D: false
  },
]

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'the-anora-bordeaux-flap-crossbody',
    author: 'Ayesha M.',
    rating: 5,
    title: 'Far exceeded my expectations!',
    comment: 'The burgundy leather is even more stunning in person than in the photos. The gold hardware feels heavy, solid, and luxurious. Cash on delivery was seamless—arrived in 2 days in beautiful dust packaging. The 7-day return policy gave me total peace of mind.',
    verified: true,
    location: 'Lahore',
    createdAt: '2026-10-12T10:30:00Z'
  },
  {
    id: 'rev-2',
    productId: 'the-anora-bordeaux-flap-crossbody',
    author: 'Fatima Z.',
    rating: 5,
    title: 'The perfect size for everyday elegance',
    comment: 'Fits my iPhone 15 Pro Max, keys, lipstick, and sunglasses easily with the accordion compartments. Got so many compliments at work and at dinner. Love the brand philosophy!',
    verified: true,
    location: 'Karachi',
    createdAt: '2026-10-08T14:15:00Z'
  },
  {
    id: 'rev-4',
    productId: 'the-anora-petit-ivory-handbag',
    author: 'Mahnoor R.',
    rating: 5,
    title: 'Minimalist dream bag ♡',
    comment: 'So clean, chic, and sculptural! The ivory shade is not too yellow and not too cold, just an exquisite warm cream. Absolutely love it.',
    verified: true,
    location: 'Rawalpindi',
    createdAt: '2026-09-29T16:20:00Z'
  }
]
