import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icons'
import logo from '../assets/hh-logo.jpeg'

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Hair care', to: '/shop?category=hair-care' },
  { label: 'Wigs', to: '/shop?category=wigs-hairpieces' },
  { label: 'Extensions', to: '/shop?category=extensions' },
  { label: 'Our story', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

export default function Header({ products, cartCount, wishlistCount, onCart, customer, settings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setQuery('')
  }, [location.pathname, location.search])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, searchOpen])

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products.slice(0, 6)
    return products.filter((item) => `${item.name} ${item.category} ${item.short}`.toLowerCase().includes(term)).slice(0, 6)
  }, [products, query])

  const submitSearch = (event) => {
    event.preventDefault()
    if (!query.trim()) return
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <>
      <div className="overflow-hidden bg-wine-950 text-white/90">
        <div className="flex w-max min-w-full animate-marquee items-center py-2.5 text-[10px] font-extrabold uppercase tracking-[0.22em] sm:text-[11px]">
          {[0, 1].map((loop) => (
            <div key={loop} className="flex min-w-max items-center">
              <span className="px-8">Free UK delivery over £{Number(settings?.free_delivery_threshold || 45).toFixed(0)}</span><span className="text-champagne">✦</span>
              <span className="px-8">Easy 14-day returns</span><span className="text-champagne">✦</span>
              <span className="px-8">Curated for textured hair</span><span className="text-champagne">✦</span>
              <span className="px-8">Cash on Delivery</span><span className="text-champagne">✦</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-black/[.06] bg-cream/95 backdrop-blur-xl">
        <div className="page-container flex h-[76px] items-center justify-between gap-3 lg:h-[90px] lg:gap-5">
          <button type="button" onClick={() => setMenuOpen(true)} className="icon-button xl:hidden" aria-label="Open menu"><Icon name="menu" /></button>

          <Link to="/" className="min-w-0 shrink-0" aria-label="H&H Hair & Cosmetics home">
            <img src={logo} alt="H&H Hair & Cosmetics" className="h-11 w-auto max-w-[145px] rounded-sm object-contain sm:h-14 sm:max-w-[190px] xl:max-w-[220px]" />
          </Link>

          <nav className="hidden min-w-0 items-center gap-5 xl:flex 2xl:gap-8" aria-label="Main navigation">
            {nav.map((item) => (
              <NavLink key={item.label} to={item.to} className={() => {
                const current = `${location.pathname}${location.search}`
                const active = item.to === '/' ? location.pathname === '/' : item.to === '/shop' ? location.pathname === '/shop' && !location.search : item.to.startsWith('/shop?') ? current === item.to : location.pathname === item.to
                return `group relative py-8 text-[11px] font-extrabold uppercase tracking-[0.14em] transition-colors hover:text-wine-700 ${active ? 'text-wine-800' : 'text-ink/70'}`
              }}>
                {item.label}
                <span className="absolute inset-x-0 bottom-[22px] h-px origin-left scale-x-0 bg-wine-700 transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <button type="button" onClick={() => setSearchOpen(true)} className="icon-button" aria-label="Search products"><Icon name="search" /></button>
            <Link to="/wishlist" className="icon-button relative hidden sm:grid" aria-label="Wishlist"><Icon name="heart" />{wishlistCount > 0 && <span className="counter-badge">{wishlistCount}</span>}</Link>
            <Link to={customer ? '/account' : '/login'} className="icon-button hidden lg:grid" aria-label={customer ? 'My account' : 'Sign in'}><Icon name="user" /></Link>
            <button type="button" onClick={onCart} className="icon-button relative" aria-label={`Shopping bag with ${cartCount} items`}><Icon name="bag" />{cartCount > 0 && <span className="counter-badge">{cartCount}</span>}</button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 transition ${menuOpen ? 'visible' : 'invisible'}`} aria-hidden={!menuOpen}>
        <button type="button" className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} aria-label="Close menu" />
        <aside className={`absolute left-0 top-0 flex h-dvh w-[94%] max-w-md flex-col overflow-y-auto bg-cream p-5 shadow-2xl transition-transform duration-500 sm:p-6 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-black/10 pb-5"><img src={logo} alt="H&H Hair & Cosmetics" className="h-12 w-auto max-w-[190px]" /><button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icon name="close" /></button></div>
          <nav className="mt-5 flex flex-col" aria-label="Mobile navigation">
            {nav.map((item, index) => (
              <Link key={item.label} to={item.to} className="group flex min-w-0 items-center justify-between gap-3 border-b border-black/10 py-4 font-display text-[clamp(1.55rem,7vw,1.9rem)] font-semibold leading-none text-ink">
                <span className="min-w-0"><small className="mr-3 align-middle font-sans text-[9px] font-extrabold tracking-[.16em] text-wine-400">0{index + 1}</small>{item.label}</span><Icon name="chevronRight" size={18} className="shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link to={customer ? '/account' : '/login'} className="flex min-w-0 items-center gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs font-extrabold text-ink"><Icon name="user" size={17} className="shrink-0 text-wine-700" /><span className="truncate">{customer ? 'My account' : 'Sign in'}</span></Link>
            <Link to="/wishlist" className="flex min-w-0 items-center gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs font-extrabold text-ink"><Icon name="heart" size={17} className="shrink-0 text-wine-700" /><span className="truncate">Wishlist ({wishlistCount})</span></Link>
            <Link to="/track-order" className="col-span-2 flex min-w-0 items-center gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs font-extrabold text-ink"><Icon name="package" size={17} className="shrink-0 text-wine-700" /> Track an order</Link>
          </div>
          <div className="mt-6 rounded-[28px] bg-wine-glow p-6 text-white"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-champagne">Personal beauty advice</p><p className="mt-3 font-display text-3xl font-semibold leading-none">Find the right ritual for your hair.</p><Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Speak to our team <Icon name="arrow" /></Link></div>
        </aside>
      </div>

      <div className={`fixed inset-0 z-50 overflow-y-auto bg-cream/95 backdrop-blur-xl transition-all duration-300 ${searchOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} aria-hidden={!searchOpen}>
        <div className="page-container py-7 sm:py-10">
          <div className="flex min-w-0 items-start justify-between gap-4"><div className="min-w-0"><p className="eyebrow">Find your next favourite</p><p className="mt-1 font-display text-3xl font-semibold leading-none text-ink sm:text-4xl">Search the H&H edit</p></div><button type="button" className="icon-button shrink-0" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close" /></button></div>
          <form onSubmit={submitSearch} className="mt-10 flex min-w-0 items-center border-b-2 border-ink/20 pb-3 focus-within:border-wine-700"><Icon name="search" size={27} className="shrink-0 text-black/40" /><input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 w-full bg-transparent px-3 py-2 font-display text-[clamp(1.8rem,7vw,3rem)] font-semibold leading-none outline-none placeholder:text-black/20 sm:px-4 sm:text-5xl" placeholder="What are you looking for?" /><button type="submit" className="button-primary hidden sm:inline-flex sm:w-auto">Search</button></form>
          <div className="mt-10"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/50">{query ? 'Matching products' : 'Popular now'}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{matches.map((product) => <Link key={product.id} to={`/product/${product.slug}`} className="group flex min-w-0 items-center gap-3 rounded-[22px] border border-black/[.07] bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-card sm:gap-4"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#faf3ef] to-[#eadbd8] sm:h-24 sm:w-24"><img src={product.image} alt="" className="h-16 w-16 object-contain transition duration-500 group-hover:scale-105 sm:h-20 sm:w-20" /></div><div className="min-w-0"><p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-wine-700">{product.category}</p><p className="mt-1 font-display text-2xl font-semibold leading-none text-ink">{product.name}</p><p className="mt-2 text-sm font-bold text-black/60">£{product.price.toFixed(2)}</p></div></Link>)}</div></div>
        </div>
      </div>
    </>
  )
}
