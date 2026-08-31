import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import QuickView from './components/QuickView'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import About from './pages/About'
import Contact from './pages/Contact'
import DeliveryReturns from './pages/DeliveryReturns'
import Faq from './pages/Faq'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Account from './pages/Account'
import AccountOrders from './pages/AccountOrders'
import OrderDetails from './pages/OrderDetails'
import AccountAddresses from './pages/AccountAddresses'
import TrackOrder from './pages/TrackOrder'
import OrderSuccess from './pages/OrderSuccess'
import PolicyPage from './pages/PolicyPage'
import NotFound from './pages/NotFound'
import Icon from './components/Icons'
import { useAuth } from './context/AuthContext'
import { useCommerce } from './context/CommerceContext'
import { apiMessage } from './services'

function RouteChangeManager() {
  const location = useLocation()
  useLayoutEffect(() => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    document.body.style.overflow = ''
    const frame = requestAnimationFrame(() => { html.style.scrollBehavior = previous })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.search])
  return null
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const commerce = useCommerce()
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setCartOpen(false)
    setQuickView(null)
    document.body.style.overflow = ''
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(timer)
  }, [toast])

  const safeAddToCart = useCallback(async (product, quantity = 1, variantId = null) => {
    try {
      await commerce.addToCart(product, quantity, variantId)
      setCartOpen(true)
      setToast({ type: 'success', text: `${product.name} added to your bag.` })
    } catch (error) {
      setToast({ type: 'error', text: apiMessage(error, 'Could not update your bag.') })
    }
  }, [commerce])

  const safeToggleWishlist = useCallback(async (productId) => {
    try { await commerce.toggleWishlist(productId) }
    catch (error) { setToast({ type: 'error', text: apiMessage(error, 'Could not update your wishlist.') }) }
  }, [commerce])

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/')
  }, [logout, navigate])

  const shared = {
    products: commerce.products,
    categories: commerce.categories,
    banners: commerce.banners,
    settings: commerce.settings,
    catalogLoading: commerce.catalogLoading,
    catalogError: commerce.catalogError,
    addToCart: safeAddToCart,
    wishlist: commerce.wishlist,
    toggleWishlist: safeToggleWishlist,
    openQuickView: setQuickView
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-cream text-ink">
      <RouteChangeManager />
      <Header products={commerce.products} cartCount={commerce.cartCount} wishlistCount={commerce.wishlist.length} onCart={() => setCartOpen(true)} customer={user} settings={commerce.settings} />
      <main className="min-h-[55vh] min-w-0 overflow-x-clip" aria-live="polite">
        <Routes>
          <Route path="/" element={<Home {...shared} />} />
          <Route path="/shop" element={<Shop {...shared} />} />
          <Route path="/category/:slug" element={<CategoryPage {...shared} />} />
          <Route path="/product/:slug" element={<ProductPage {...shared} currentUser={user} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist {...shared} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<ProtectedRoute><Account onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><AccountOrders onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/account/orders/:orderId" element={<ProtectedRoute><OrderDetails onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/account/addresses" element={<ProtectedRoute><AccountAddresses onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/delivery-returns" element={<DeliveryReturns />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<PolicyPage type="privacy" />} />
          <Route path="/terms" element={<PolicyPage type="terms" />} />
          <Route path="/cookies" element={<PolicyPage type="cookies" />} />
          <Route path="/accessibility" element={<PolicyPage type="accessibility" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={commerce.cart} updateQuantity={commerce.updateQuantity} totals={commerce.cartTotals} settings={commerce.settings} busy={commerce.commerceBusy} />
      <QuickView product={quickView} onClose={() => setQuickView(null)} addToCart={safeAddToCart} />
      {toast ? <div className={`fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900' : 'border-wine-200 bg-white/95 text-wine-800'}`}><Icon name={toast.type === 'success' ? 'checkCircle' : 'info'} className="mt-0.5 shrink-0" /><span className="min-w-0 flex-1">{toast.text}</span><button type="button" onClick={() => setToast(null)} className="shrink-0"><Icon name="close" size={16} /></button></div> : null}
    </div>
  )
}
