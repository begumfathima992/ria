import fallbackImage from '../assets/products/radiance-oil.svg'

function number(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function absoluteAssetUrl(url) {
  if (!url) return fallbackImage
  if (/^(https?:|data:|blob:)/i.test(url)) return url
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1')
  const origin = apiBase.replace(/\/api\/v1\/?$/i, '')
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`
}

export function adaptProduct(product = {}) {
  if (!product) return null
  const images = Array.isArray(product.images) ? [...product.images] : []
  images.sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)) || number(a.sortOrder) - number(b.sortOrder))
  const image = absoluteAssetUrl(images[0]?.imageUrl || product.image || product.imageUrl)
  const variants = Array.isArray(product.variants) ? product.variants.map((variant) => ({
    ...variant,
    id: Number(variant.id),
    price: number(variant.price, number(product.basePrice)),
    compareAtPrice: variant.compareAtPrice == null ? null : number(variant.compareAtPrice),
    stock: number(variant.stock),
    attributes: variant.attributes || {}
  })) : []
  const defaultVariant = variants.find((variant) => variant.isDefault) || variants[0] || null
  const price = defaultVariant ? defaultVariant.price : number(product.basePrice ?? product.price)
  const oldPrice = defaultVariant?.compareAtPrice ?? (product.compareAtPrice == null ? null : number(product.compareAtPrice))
  return {
    ...product,
    id: Number(product.id),
    name: product.name || 'H&H product',
    slug: product.slug || String(product.id || ''),
    price,
    oldPrice,
    basePrice: number(product.basePrice ?? price),
    rating: number(product.ratingAverage ?? product.rating, 0),
    reviews: number(product.reviewCount ?? product.reviews, 0),
    category: product.category?.name || product.category || 'H&H Edit',
    categorySlug: product.category?.slug || product.categorySlug || '',
    subcategory: product.subcategory?.name || product.subcategory || '',
    subcategorySlug: product.subcategory?.slug || product.subcategorySlug || '',
    short: product.shortDescription || product.short || product.description || '',
    description: product.description || product.shortDescription || '',
    image,
    images: images.length ? images.map((item) => ({ ...item, src: absoluteAssetUrl(item.imageUrl) })) : [{ src: image, isPrimary: true }],
    variants,
    defaultVariant,
    stock: number(product.stock),
    badge: product.badge || null,
    ingredients: product.ingredients || '',
    usageNotes: product.usageNotes || ''
  }
}

export function adaptCartItem(item = {}, productLookup = new Map()) {
  const product = productLookup.get(Number(item.productId))
  return {
    id: Number(item.id),
    productId: Number(item.productId),
    variantId: item.variantId == null ? null : Number(item.variantId),
    slug: item.slug || product?.slug || '',
    name: item.name || product?.name || 'H&H product',
    category: product?.category || 'H&H Edit',
    image: absoluteAssetUrl(item.imageUrl || product?.image),
    price: number(item.unitPrice ?? product?.price),
    quantity: number(item.quantity, 1),
    lineTotal: number(item.lineTotal),
    availableStock: number(item.availableStock, 99),
    inStock: item.inStock !== false,
    productActive: item.productActive !== false,
    variantName: item.variantName || null,
    sku: item.sku || product?.sku || ''
  }
}
