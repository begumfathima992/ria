import radianceOil from '../assets/products/radiance-oil.svg'
import silkShampoo from '../assets/products/silk-shampoo.svg'
import repairMask from '../assets/products/repair-mask.svg'
import curlCream from '../assets/products/curl-cream.svg'
import laceSpray from '../assets/products/lace-spray.svg'
import edgeControl from '../assets/products/edge-control.svg'
import scalpSerum from '../assets/products/scalp-serum.svg'
import heatProtect from '../assets/products/heat-protect.svg'
import bodyButter from '../assets/products/body-butter.svg'
import glowCleanser from '../assets/products/glow-cleanser.svg'
import wigCare from '../assets/products/wig-care.svg'
import braidMousse from '../assets/products/braid-mousse.svg'
import detanglingBrush from '../assets/products/detangling-brush.svg'
import satinBonnet from '../assets/products/satin-bonnet.svg'

import hairCare from '../assets/categories/hair-care.svg'
import wigs from '../assets/categories/wigs.svg'
import extensions from '../assets/categories/extensions.svg'
import styling from '../assets/categories/styling.svg'
import skinCare from '../assets/categories/skin-care.svg'
import accessories from '../assets/categories/accessories.svg'

export const products = [
  {
    id: 1,
    slug: 'signature-radiance-hair-oil',
    name: 'Signature Radiance Hair Oil',
    category: 'Hair Care',
    image: radianceOil,
    price: 14.95,
    oldPrice: 18,
    rating: 4.9,
    reviews: 124,
    badge: 'Best seller',
    short: 'Weightless shine for dry lengths and textured hair.',
    description: 'A lightweight finishing oil created to soften dry lengths, tame flyaways and add a polished, non-greasy shine.',
    details: ['Suitable for textured, curly and straight hair', 'Lightweight glossy finish', 'Vegan-friendly formula concept'],
    ingredients: 'Argan-inspired oil blend, vitamin E and lightweight emollients. Demo product copy only.'
  },
  {
    id: 2,
    slug: 'silk-moisture-shampoo',
    name: 'Silk Moisture Shampoo',
    category: 'Hair Care',
    image: silkShampoo,
    price: 9.5,
    rating: 4.7,
    reviews: 86,
    badge: 'New',
    short: 'A gentle cleanse with a soft, conditioned finish.',
    description: 'A gentle everyday cleanser designed to refresh the scalp while helping hair feel soft, smooth and manageable.',
    details: ['Creamy low-foam cleanse', 'For dry and normal hair', 'Fresh botanical fragrance'],
    ingredients: 'Moisture-supporting cleansing base and botanical fragrance. Demo product copy only.'
  },
  {
    id: 3,
    slug: 'intensive-repair-mask',
    name: 'Intensive Repair Mask',
    category: 'Hair Care',
    image: repairMask,
    price: 12.75,
    oldPrice: 15,
    rating: 4.8,
    reviews: 72,
    badge: 'Save 15%',
    short: 'Rich weekly care for brittle-feeling, thirsty hair.',
    description: 'A rich conditioning mask for brittle-feeling hair, bringing slip, moisture and softness to wash day.',
    details: ['Deep-conditioning texture', 'Ideal for weekly routines', 'Helps detangling feel easier'],
    ingredients: 'Conditioning cream base with shea-inspired emollients. Demo product copy only.'
  },
  {
    id: 4,
    slug: 'defined-curl-cream',
    name: 'Defined Curl Cream',
    category: 'Styling & Finish',
    image: curlCream,
    price: 8.95,
    rating: 4.6,
    reviews: 98,
    badge: 'Curl favourite',
    short: 'Flexible definition without a stiff or crunchy feel.',
    description: 'A soft-hold curl cream that enhances shape and definition without leaving a stiff or crunchy finish.',
    details: ['Soft flexible hold', 'Humidity-friendly finish', 'Works for twist-outs and wash-and-go styles'],
    ingredients: 'Styling cream base with moisture-locking conditioners. Demo product copy only.'
  },
  {
    id: 5,
    slug: 'invisible-lace-melt-spray',
    name: 'Invisible Lace Melt Spray',
    category: 'Wigs & Hairpieces',
    image: laceSpray,
    price: 10.5,
    rating: 4.9,
    reviews: 141,
    badge: 'Trending',
    short: 'A precise mist for seamless-looking lace styling.',
    description: 'A precise styling mist created for a seamless-looking lace finish and confident all-day styling.',
    details: ['Quick-drying styling mist', 'Fine directional spray', 'For wigs and frontals'],
    ingredients: 'Fast-drying styling polymers and conditioning agents. Demo product copy only.'
  },
  {
    id: 6,
    slug: 'precision-edge-control',
    name: 'Precision Edge Control',
    category: 'Styling & Finish',
    image: edgeControl,
    price: 6.95,
    rating: 4.5,
    reviews: 64,
    badge: 'Salon edit',
    short: 'Clean satin hold for detailed, polished edges.',
    description: 'A smooth edge styler with a clean satin finish, designed for detail work and polished everyday looks.',
    details: ['Firm yet workable hold', 'No-flake finish concept', 'Compact travel-friendly jar'],
    ingredients: 'Firm-hold styling gel base with shine enhancers. Demo product copy only.'
  },
  {
    id: 7,
    slug: 'root-revival-scalp-serum',
    name: 'Root Revival Scalp Serum',
    category: 'Hair Care',
    image: scalpSerum,
    price: 16.5,
    rating: 4.8,
    reviews: 53,
    badge: 'Editor’s pick',
    short: 'A lightweight ritual for scalp massage and moisture.',
    description: 'A concentrated scalp serum with a light, clean feel for regular massage and moisture-focused routines.',
    details: ['Precision dropper format', 'Lightweight and non-sticky', 'Ideal for protective styles'],
    ingredients: 'Light serum base with botanical-inspired conditioning oils. Demo product copy only.'
  },
  {
    id: 8,
    slug: 'thermal-shield-protectant',
    name: 'Thermal Shield Protectant',
    category: 'Styling & Finish',
    image: heatProtect,
    price: 9.95,
    oldPrice: 11.5,
    rating: 4.7,
    reviews: 77,
    badge: 'Save 13%',
    short: 'Fine pre-styling mist for heat-led routines.',
    description: 'A lightweight pre-styling mist for blow-drying, straightening and curling routines.',
    details: ['Fine even mist', 'Helps reduce dry feel', 'Suitable for frequent styling'],
    ingredients: 'Heat-styling polymer blend with conditioning agents. Demo product copy only.'
  },
  {
    id: 9,
    slug: 'velvet-body-butter',
    name: 'Velvet Body Butter',
    category: 'Skin & Body',
    image: bodyButter,
    price: 11.95,
    rating: 4.6,
    reviews: 43,
    badge: 'Soft skin edit',
    short: 'A whipped body moisturiser with a satin finish.',
    description: 'A rich body moisturiser with a soft whipped texture and refined warm floral fragrance.',
    details: ['Whipped cream texture', 'Soft satin skin feel', 'Ideal for evening routines'],
    ingredients: 'Rich body cream base with shea-inspired emollients. Demo product copy only.'
  },
  {
    id: 10,
    slug: 'rose-glow-cleanser',
    name: 'Rose Glow Cleanser',
    category: 'Skin & Body',
    image: glowCleanser,
    price: 8.5,
    rating: 4.4,
    reviews: 39,
    badge: 'New',
    short: 'A creamy everyday cleanser for a comfortable finish.',
    description: 'A creamy daily face cleanser designed to remove surface impurities without a tight after-feel.',
    details: ['Gentle cream-gel texture', 'Fresh rose-inspired fragrance', 'For normal and dry skin'],
    ingredients: 'Gentle cleansing base and rose-inspired fragrance. Demo product copy only.'
  },
  {
    id: 11,
    slug: 'wig-care-conditioning-mist',
    name: 'Wig Care Conditioning Mist',
    category: 'Wigs & Hairpieces',
    image: wigCare,
    price: 7.95,
    rating: 4.7,
    reviews: 89,
    badge: 'Daily care',
    short: 'Refresh, soften and detangle between wash days.',
    description: 'A refreshing conditioning mist for synthetic and human-hair wig care between washes.',
    details: ['Light detangling slip', 'Freshens between washes', 'Fine non-aerosol spray'],
    ingredients: 'Water-based conditioning mist and light fragrance. Demo product copy only.'
  },
  {
    id: 12,
    slug: 'braid-and-loc-finishing-mousse',
    name: 'Braid & Loc Finishing Mousse',
    category: 'Extensions',
    image: braidMousse,
    price: 8.95,
    rating: 4.8,
    reviews: 118,
    badge: 'Protective style',
    short: 'Light foam for smooth braids, twists and locs.',
    description: 'A light finishing mousse to refine braids, twists and loc styles with a smooth salon-inspired finish.',
    details: ['Light foam texture', 'Smooth finishing hold', 'Made for protective styles'],
    ingredients: 'Lightweight foam base with flexible styling polymers. Demo product copy only.'
  },
  {
    id: 13,
    slug: 'flex-glide-detangling-brush',
    name: 'Flex Glide Detangling Brush',
    category: 'Accessories',
    image: detanglingBrush,
    price: 7.95,
    rating: 4.8,
    reviews: 67,
    badge: 'Routine essential',
    short: 'Flexible rows for gentle detangling on wet or dry hair.',
    description: 'A flexible detangling brush designed to move with the hair and make everyday routines feel smoother and more comfortable.',
    details: ['Flexible brush rows', 'Comfort-grip handle', 'Suitable for wet and dry detangling'],
    ingredients: 'Durable cosmetic-grade plastic and flexible bristles. Demo product copy only.'
  },
  {
    id: 14,
    slug: 'signature-satin-sleep-bonnet',
    name: 'Signature Satin Sleep Bonnet',
    category: 'Accessories',
    image: satinBonnet,
    price: 9.95,
    rating: 4.9,
    reviews: 102,
    badge: 'Night-time care',
    short: 'Soft satin protection for curls, braids and styled hair.',
    description: 'A roomy satin bonnet with a comfortable band, created to help preserve styled hair and reduce overnight friction.',
    details: ['Soft satin-touch finish', 'Comfortable wide band', 'Roomy fit for protective styles'],
    ingredients: 'Polyester satin fabric and elasticated comfort band. Demo product copy only.'
  }
]

export const categories = [
  { name: 'Hair Care', slug: 'hair-care', image: hairCare, copy: 'Cleansers, masks, oils and scalp essentials.', tone: 'from-[#f8e5e4] to-[#fffaf7]' },
  { name: 'Wigs & Hairpieces', slug: 'wigs-hairpieces', image: wigs, copy: 'Confident, seamless styles and care essentials.', tone: 'from-[#eadbe0] to-[#fff8f8]' },
  { name: 'Extensions', slug: 'extensions', image: extensions, copy: 'Texture, length and volume for every finish.', tone: 'from-[#efe4d1] to-[#fffaf1]' },
  { name: 'Styling & Finish', slug: 'styling-finish', image: styling, copy: 'Hold, definition and protection without compromise.', tone: 'from-[#e6e2ea] to-[#fbf9ff]' },
  { name: 'Skin & Body', slug: 'skin-body', image: skinCare, copy: 'Daily beauty rituals with an elevated feel.', tone: 'from-[#f5dfd7] to-[#fff9f5]' },
  { name: 'Accessories', slug: 'accessories', image: accessories, copy: 'Tools and finishing touches for your routine.', tone: 'from-[#e5ece8] to-[#f8fffb]' }
]

export const testimonials = [
  { quote: 'The site feels premium and easy to shop. I found my wash-day favourites in minutes.', name: 'Amelia, London' },
  { quote: 'Beautiful presentation, clear product details and a genuinely smooth mobile experience.', name: 'Nia, Birmingham' },
  { quote: 'The protective-style collection is curated brilliantly. Everything feels considered.', name: 'Sophie, Manchester' }
]
