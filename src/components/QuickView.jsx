import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons'

export default function QuickView({ product, onClose, addToCart }) {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!product) return undefined
    setQuantity(1)
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`}>
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close quick view" />
      <div className="relative z-10 grid max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-[26px] bg-cream shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-[32px] md:grid-cols-2">
        <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4 z-20 bg-white" aria-label="Close quick view"><Icon name="close" /></button>
        <div className="grid min-h-[270px] place-items-center bg-gradient-to-br from-[#f5ece8] to-[#e5d1d0] p-7 sm:min-h-[360px] sm:p-10">
          <img src={product.image} alt={product.name} className="h-56 w-56 object-contain sm:h-72 sm:w-72 drop-shadow-[0_30px_25px_rgba(55,25,30,.2)]" />
        </div>
        <div className="flex flex-col p-7 sm:p-10">
          <p className="eyebrow">{product.category}</p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,10vw,3rem)] leading-none text-ink">{product.name}</h2>
          <div className="mt-4 flex items-center gap-2 text-sm"><span className="flex items-center gap-1 text-champagne"><Icon name="star" size={15} filled /> <strong className="text-ink">{product.rating}</strong></span><span className="text-black/50">({product.reviews} reviews)</span></div>
          <p className="mt-5 text-sm leading-7 text-black/60">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-3"><span className="font-display text-3xl">£{product.price.toFixed(2)}</span>{product.oldPrice && <span className="text-black/40 line-through">£{product.oldPrice.toFixed(2)}</span>}</div>
          <div className="mt-7 grid gap-3 min-[430px]:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex items-center justify-center rounded-full border border-black/20 bg-white px-2">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-10 w-9 place-items-center" aria-label="Decrease quantity"><Icon name="minus" size={15} /></button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="grid h-10 w-9 place-items-center" aria-label="Increase quantity"><Icon name="plus" size={15} /></button>
            </div>
            <button type="button" onClick={() => { addToCart(product, quantity); onClose() }} className="button-primary flex-1">Add to bag</button>
          </div>
          <Link to={`/product/${product.slug}`} onClick={onClose} className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-wine-800">View full details <Icon name="arrow" size={17} /></Link>
        </div>
      </div>
    </div>
  )
}
