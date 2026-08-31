import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { catalogService, cartService, userService, apiMessage } from '../services'
import { products as fallbackProducts } from '../data/products'
import { adaptCartItem, adaptProduct } from '../utils/productAdapter'
import { useAuth } from './AuthContext'

const CommerceContext = createContext(null)
const GUEST_CART_KEY = 'hh_guest_cart_v8'
const GUEST_WISHLIST_KEY = 'hh_guest_wishlist_v8'

function read(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ } }

const adaptedFallback = fallbackProducts.map((product) => ({ ...product, productId: product.id, basePrice: product.price, variants: product.variants || [] }))

export function CommerceProvider({ children }) {
  const { user, authReady, isAuthenticated } = useAuth()
  const [products, setProducts] = useState(adaptedFallback)
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [settings, setSettings] = useState({
    currency: 'GBP', free_delivery_threshold: 45, standard_delivery_fee: 4.95,
    express_delivery_fee: 7.95, cod_fee: 0, cod_enabled: true
  })
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [cart, setCart] = useState(() => read(GUEST_CART_KEY, []))
  const [cartTotals, setCartTotals] = useState(null)
  const [coupon, setCoupon] = useState(null)
  const [wishlist, setWishlist] = useState(() => read(GUEST_WISHLIST_KEY, []))
  const [commerceBusy, setCommerceBusy] = useState(false)
  const previousUserId = useRef(null)

  const productLookup = useMemo(() => new Map(products.map((product) => [Number(product.id), product])), [products])

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true)
    setCatalogError('')
    const [productResult, categoryResult, bannerResult, settingResult] = await Promise.allSettled([
      catalogService.getProducts({ limit: 100, sort: 'newest' }),
      catalogService.getCategories(),
      catalogService.getBanners(),
      catalogService.getSettings()
    ])
    if (productResult.status === 'fulfilled' && productResult.value.items.length) {
      setProducts(productResult.value.items.map(adaptProduct))
    } else if (productResult.status === 'rejected') {
      setCatalogError(apiMessage(productResult.reason, 'The live catalogue could not be loaded. Demo products are shown.'))
    }
    if (categoryResult.status === 'fulfilled') setCategories(categoryResult.value)
    if (bannerResult.status === 'fulfilled') setBanners(bannerResult.value)
    if (settingResult.status === 'fulfilled') setSettings((current) => ({ ...current, ...settingResult.value }))
    setCatalogLoading(false)
  }, [])

  useEffect(() => { loadCatalog() }, [loadCatalog])

  const refreshCart = useCallback(async (options = {}) => {
    if (!isAuthenticated) return null
    const data = await cartService.getCart(options)
    const lookup = new Map(products.map((product) => [Number(product.id), product]))
    setCart((data.items || []).map((item) => adaptCartItem(item, lookup)))
    setCartTotals(data.totals || null)
    setCoupon(data.coupon || null)
    return data
  }, [isAuthenticated, products])

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return []
    const rows = await userService.getWishlist()
    const adapted = rows.map(adaptProduct)
    setWishlist(adapted.map((item) => item.id))
    return adapted
  }, [isAuthenticated])

  const syncGuestCart = useCallback(async () => {
    const guest = read(GUEST_CART_KEY, [])
    if (!guest.length) return
    for (const item of guest) {
      try {
        await cartService.addItem({ productId: Number(item.productId || item.id), variantId: item.variantId || null, quantity: Number(item.quantity || 1) })
      } catch { /* one invalid item should not block the rest */ }
    }
    write(GUEST_CART_KEY, [])
  }, [])

  const syncGuestWishlist = useCallback(async () => {
    const guest = read(GUEST_WISHLIST_KEY, [])
    for (const productId of guest) {
      try { await userService.addWishlist(Number(productId)) } catch { /* duplicate or unavailable item */ }
    }
    write(GUEST_WISHLIST_KEY, [])
  }, [])

  useEffect(() => {
    if (!authReady) return
    const currentId = user?.id || null
    if (currentId && previousUserId.current !== currentId) {
      setCommerceBusy(true)
      Promise.allSettled([syncGuestCart(), syncGuestWishlist()])
        .then(() => Promise.allSettled([refreshCart(), refreshWishlist()]))
        .finally(() => setCommerceBusy(false))
    } else if (!currentId && previousUserId.current) {
      setCart(read(GUEST_CART_KEY, []))
      setWishlist(read(GUEST_WISHLIST_KEY, []))
      setCartTotals(null)
      setCoupon(null)
    }
    previousUserId.current = currentId
  }, [authReady, user?.id, syncGuestCart, syncGuestWishlist, refreshCart, refreshWishlist])

  const addToCart = useCallback(async (product, quantity = 1, variantId = null) => {
    const qty = Math.max(1, Number(quantity) || 1)
    if (isAuthenticated) {
      setCommerceBusy(true)
      try {
        const data = await cartService.addItem({ productId: Number(product.id), variantId: variantId || product.defaultVariant?.id || null, quantity: qty })
        const lookup = new Map(products.map((item) => [Number(item.id), item]))
        setCart((data.items || []).map((item) => adaptCartItem(item, lookup)))
        setCartTotals(data.totals || null)
        setCoupon(null)
        return data
      } finally { setCommerceBusy(false) }
    }
    setCart((current) => {
      const selectedVariant = product.variants?.find((variant) => Number(variant.id) === Number(variantId)) || product.defaultVariant || null
      const key = `${product.id}:${selectedVariant?.id || 'base'}`
      const found = current.find((item) => item.guestKey === key)
      const price = selectedVariant?.price ?? product.price
      const next = found
        ? current.map((item) => item.guestKey === key ? { ...item, quantity: item.quantity + qty } : item)
        : [...current, { ...product, id: key, guestKey: key, productId: Number(product.id), variantId: selectedVariant?.id || null, variantName: selectedVariant?.name || null, price: Number(price), quantity: qty }]
      write(GUEST_CART_KEY, next)
      return next
    })
    return null
  }, [isAuthenticated, products])

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const qty = Number(quantity)
    if (isAuthenticated) {
      setCommerceBusy(true)
      try {
        const data = qty <= 0 ? await cartService.removeItem(itemId) : await cartService.updateItem(itemId, qty)
        const lookup = new Map(products.map((item) => [Number(item.id), item]))
        setCart((data.items || []).map((item) => adaptCartItem(item, lookup)))
        setCartTotals(data.totals || null)
        setCoupon(null)
        return data
      } finally { setCommerceBusy(false) }
    }
    setCart((current) => {
      const next = qty <= 0 ? current.filter((item) => item.id !== itemId) : current.map((item) => item.id === itemId ? { ...item, quantity: Math.max(1, qty) } : item)
      write(GUEST_CART_KEY, next)
      return next
    })
    return null
  }, [isAuthenticated, products])

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      const data = await cartService.clear()
      setCart([]); setCartTotals(data?.totals || null); setCoupon(null)
    } else {
      setCart([]); write(GUEST_CART_KEY, [])
    }
  }, [isAuthenticated])

  const quoteCart = useCallback(async ({ couponCode = '', shippingMethod = 'STANDARD' } = {}) => {
    if (!isAuthenticated) throw new Error('Please sign in to validate delivery and offers.')
    const data = await cartService.quote({ couponCode: couponCode || null, shippingMethod })
    const lookup = new Map(products.map((item) => [Number(item.id), item]))
    setCart((data.items || []).map((item) => adaptCartItem(item, lookup)))
    setCartTotals(data.totals || null)
    setCoupon(data.coupon || null)
    return data
  }, [isAuthenticated, products])

  const toggleWishlist = useCallback(async (productId) => {
    const id = Number(productId)
    const exists = wishlist.some((item) => Number(item) === id)
    if (isAuthenticated) {
      if (exists) await userService.removeWishlist(id)
      else await userService.addWishlist(id)
    }
    setWishlist((current) => {
      const next = exists ? current.filter((item) => Number(item) !== id) : [...current, id]
      if (!isAuthenticated) write(GUEST_WISHLIST_KEY, next)
      return next
    })
  }, [isAuthenticated, wishlist])

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0), [cart])
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [cart])

  const value = useMemo(() => ({
    products, categories, banners, settings, catalogLoading, catalogError, loadCatalog,
    cart, cartTotals, coupon, cartCount, subtotal, commerceBusy,
    wishlist, addToCart, updateQuantity, clearCart, quoteCart, refreshCart,
    toggleWishlist, refreshWishlist, productLookup
  }), [products, categories, banners, settings, catalogLoading, catalogError, loadCatalog, cart, cartTotals, coupon, cartCount, subtotal, commerceBusy, wishlist, addToCart, updateQuantity, clearCart, quoteCart, refreshCart, toggleWishlist, refreshWishlist, productLookup])

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}

export function useCommerce() {
  const value = useContext(CommerceContext)
  if (!value) throw new Error('useCommerce must be used inside CommerceProvider')
  return value
}
