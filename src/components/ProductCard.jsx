import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons'

export default function ProductCard({ product, addToCart, wishlist, toggleWishlist, openQuickView }) {
  const wished = wishlist.includes(product.id)
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(23,20,22,.05)] transition duration-500 hover:-translate-y-1.5 hover:shadow-luxe">
      <div className="relative isolate aspect-[4/4.35] overflow-hidden bg-gradient-to-b from-[#faf5f2] to-[#eee2df] p-6 sm:p-8">
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 50% 70%, rgba(213,176,108,.34), transparent 45%)' }} />
        {product.badge && <span className="absolute left-4 top-4 z-10 rounded-full bg-wine-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white">{product.badge}</span>}
        <button type="button" onClick={() => toggleWishlist(product.id)} className={`absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border bg-white/90 transition hover:scale-105 ${wished ? 'border-wine-700 text-wine-700' : 'border-black/10 text-black/60'}`} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Icon name="heart" size={18} filled={wished} />
        </button>
        <Link to={`/product/${product.slug}`} className="relative z-[1] grid h-full place-items-center">
          <img src={product.image} alt={product.name} className="h-[84%] w-[84%] object-contain drop-shadow-[0_22px_20px_rgba(35,20,23,.16)] transition duration-700 group-hover:scale-[1.06] group-hover:-rotate-1" />
        </Link>
        <button type="button" onClick={() => openQuickView(product)} className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 translate-y-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-ink opacity-100 shadow-card transition duration-300 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100" aria-label={`Quick view ${product.name}`}>
          <Icon name="eye" size={16} /> Quick view
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-wine-700">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="mt-2 min-w-0 font-display text-[25px] leading-[1.08] text-ink transition hover:text-wine-700">{product.name}</Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/60">{product.short}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-black/60">
          <span className="flex items-center gap-1 text-champagne"><Icon name="star" size={14} filled /> <strong className="text-ink">{product.rating}</strong></span>
          <span>({product.reviews} reviews)</span>
        </div>
        <div className="mt-auto flex min-w-0 items-end justify-between gap-3 pt-5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-2"><span className="text-lg font-bold text-ink">£{product.price.toFixed(2)}</span>{product.oldPrice && <span className="text-sm text-black/40 line-through">£{product.oldPrice.toFixed(2)}</span>}</div>
          <button type="button" onClick={() => addToCart(product)} className="grid h-11 w-11 place-items-center rounded-full bg-wine-800 text-white transition hover:scale-105 hover:bg-wine-950" aria-label={`Add ${product.name} to bag`}><Icon name="bag" size={18} /></button>
        </div>
      </div>
    </article>
  )
}
