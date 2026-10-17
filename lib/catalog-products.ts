import type { Product } from './types'

export const NOIR_GEOMETRIC_BAG: Product = {
  id: 'the-anora-noir-geometric-crossbody',
  name: 'The Anora Noir Geometric Crossbody',
  tagline: 'Sculpted texture. Silver accents. Everyday elegance.',
  price: 2799,
  originalPrice: null,
  currency: 'Rs.',
  category: 'crossbody',
  colorName: 'Classic Black',
  colorHex: '#171719',
  availableColors: [{ name: 'Classic Black', hex: '#171719', inStock: true }],
  badge: 'New Arrival',
  image: '/images/products/noir-geometric/front.webp',
  images: [
    '/images/products/noir-geometric/front.webp',
    '/images/products/noir-geometric/angle.webp',
    '/images/products/noir-geometric/detail.webp'
  ],
  description: 'Meet your new everyday black bag. A structured silhouette with geometric triangle texture, a softly rounded flap and a polished silver-tone double-ring clasp. Carry it by the curved top handle or style it with the chain strap or adjustable crossbody strap.',
  story: 'A classic black palette meets sculpted geometric texture. Silver-tone accents and versatile carrying options make this compact silhouette an effortless finishing touch for everyday outfits and evenings out.',
  features: [
    'Black geometric triangle-textured exterior',
    'Rounded flap with double-stitched edging',
    'Polished silver-tone double-ring clasp',
    'Curved top handle with silver-tone attachments',
    'Black-and-silver chain strap and adjustable long strap',
    'Cash on Delivery nationwide with 7-day returns'
  ],
  specs: {
    dimensions: 'Contact us for exact measurements',
    weight: 'Contact us for exact weight',
    material: 'Geometric textured finish',
    hardware: 'Polished silver-tone hardware',
    strapDrop: 'Adjustable crossbody strap; chain strap included',
    capacity: 'Compact silhouette. Contact us to confirm interior layout and device fit before ordering.',
    closure: 'Flap with double-ring clasp',
    origin: 'Anora Bags collection'
  },
  rating: 0,
  reviewCount: 0,
  inStock: true,
  featured: true,
  isNew: true,
  supports3D: false
}

const cityChainImages = (color: 'black' | 'terracotta') => ['front', 'angle', 'side'].map(
  (view) => `/images/products/city-chain/${color}-${view}.webp`
)

export const CITY_CHAIN_BAG: Product = {
  id: 'the-anora-city-chain-crossbody',
  name: 'The Anora City Chain Crossbody',
  tagline: 'Clean lines. Golden details. Effortless everyday style.',
  price: 2499,
  originalPrice: null,
  currency: 'Rs.',
  category: 'crossbody',
  colorName: 'Classic Black',
  colorHex: '#18181A',
  availableColors: [
    { name: 'Classic Black', hex: '#18181A', inStock: true, image: cityChainImages('black')[0], images: cityChainImages('black') },
    { name: 'Dusty Terracotta', hex: '#B47767', inStock: true, image: cityChainImages('terracotta')[0], images: cityChainImages('terracotta') }
  ],
  badge: 'New Arrival',
  image: cityChainImages('black')[0],
  images: [...cityChainImages('black'), ...cityChainImages('terracotta')],
  description: 'A streamlined rectangular crossbody with a softly rounded flap, an angular gold-tone clasp and a chain-accented strap. Choose classic black or muted dusty terracotta for a simple finishing touch from day to evening.',
  story: 'A compact silhouette with an understated finish and a statement clasp. Two considered colors bring the same clean design to everyday outfits and evenings out.',
  features: [
    'Structured horizontal silhouette with a softly rounded flap',
    'Smooth, lightly textured exterior with matching edge stitching',
    'Angular gold-tone clasp and matching strap attachments',
    'Chain-accented shoulder strap and adjustable long strap',
    'Available in Classic Black and Dusty Terracotta',
    'Cash on Delivery nationwide with 7-day returns'
  ],
  specs: {
    dimensions: 'Contact us for exact measurements',
    weight: 'Contact us for exact weight',
    material: 'Smooth textured finish',
    hardware: 'Gold-tone angular clasp and chain',
    strapDrop: 'Chain-accented strap; adjustable long strap included',
    capacity: 'Compact silhouette. Contact us to confirm the interior layout and device fit before ordering.',
    closure: 'Flap with angular clasp',
    origin: 'Anora Bags collection'
  },
  rating: 0,
  reviewCount: 0,
  inStock: true,
  featured: true,
  isNew: true,
  supports3D: false
}

const curveBagImages = (style: 'navy-signature' | 'espresso-curve') => ['front', 'angle', 'side'].map(
  (view) => `/images/products/${style}/${view}.webp`
)

export const NAVY_SIGNATURE_BAG: Product = {
  id: 'the-anora-navy-signature-crossbody',
  name: 'The Anora Navy Signature Crossbody',
  tagline: 'Tonal pattern. Curved lines. A golden finishing touch.',
  price: 2499,
  originalPrice: null,
  currency: 'Rs.',
  category: 'crossbody',
  colorName: 'Navy & Black',
  colorHex: '#26344D',
  availableColors: [{ name: 'Navy & Black', hex: '#26344D', inStock: true }],
  badge: 'New Arrival',
  image: curveBagImages('navy-signature')[0],
  images: curveBagImages('navy-signature'),
  description: 'A compact crossbody with a dark navy patterned flap, a solid black body and softly rounded edges. A polished gold-tone clasp and a simple dark strap complete its understated silhouette.',
  story: 'Tonal navy pattern brings subtle texture to a classic black base. A curved flap and clean profile make it an easy companion for everyday outfits.',
  features: [
    'Dark navy patterned flap with a tonal woven finish',
    'Solid black lower panel and side gussets',
    'Curved flap edge and rounded lower corners',
    'Polished gold-tone rounded clasp and strap rings',
    'Simple dark shoulder strap',
    'Cash on Delivery nationwide with 7-day returns'
  ],
  specs: {
    dimensions: 'Contact us for exact measurements',
    weight: 'Contact us for exact weight',
    material: 'Patterned woven finish',
    hardware: 'Polished gold-tone clasp and strap rings',
    strapDrop: 'Long shoulder strap; contact us for strap measurements',
    capacity: 'Compact silhouette. Contact us to confirm the interior layout and device fit before ordering.',
    closure: 'Curved flap with rounded clasp',
    origin: 'Anora Bags collection'
  },
  rating: 0,
  reviewCount: 0,
  inStock: true,
  featured: true,
  isNew: true,
  supports3D: false
}

export const ESPRESSO_CURVE_BAG: Product = {
  id: 'the-anora-espresso-curve-crossbody',
  name: 'The Anora Espresso Curve Crossbody',
  tagline: 'Rich texture. Subtle contrast. Everyday polish.',
  price: 2499,
  originalPrice: null,
  currency: 'Rs.',
  category: 'crossbody',
  colorName: 'Black & Espresso',
  colorHex: '#322824',
  availableColors: [{ name: 'Black & Espresso', hex: '#322824', inStock: true }],
  badge: 'New Arrival',
  image: curveBagImages('espresso-curve')[0],
  images: curveBagImages('espresso-curve'),
  description: 'A curved crossbody with a black pebbled flap over a deep espresso-brown body. Rounded corners, matching edge stitching and a polished gold-tone clasp bring a refined finish to the slim silhouette.',
  story: 'Black and deep espresso meet in a quiet contrast of tone and texture. The sweeping flap and simple dark strap keep the design versatile from day to evening.',
  features: [
    'Black flap with a pebbled textured finish',
    'Deep espresso-brown lower panel',
    'Sweeping curved flap seam and rounded base',
    'Polished gold-tone rounded clasp and strap rings',
    'Simple dark shoulder strap',
    'Cash on Delivery nationwide with 7-day returns'
  ],
  specs: {
    dimensions: 'Contact us for exact measurements',
    weight: 'Contact us for exact weight',
    material: 'Pebbled textured finish',
    hardware: 'Polished gold-tone clasp and strap rings',
    strapDrop: 'Long shoulder strap; contact us for strap measurements',
    capacity: 'Compact silhouette. Contact us to confirm the interior layout and device fit before ordering.',
    closure: 'Curved flap with rounded clasp',
    origin: 'Anora Bags collection'
  },
  rating: 0,
  reviewCount: 0,
  inStock: true,
  featured: true,
  isNew: true,
  supports3D: false
}
