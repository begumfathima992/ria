import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons'

const money = (value) => `£${Number(value || 0).toFixed(2)}`

export default function CartDrawer({ open, onClose, cart, updateQuantity, totals, settings, busy }) {
  const subtotal = useMemo(
    () => totals?.subtotal ?? cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cart, totals]
  )
  const threshold = Number(totals?.freeDeliveryThreshold ?? settings?.free_delivery_threshold ?? 45)
  const remaining = Number(totals?.amountUntilFreeDelivery ?? Math.max(0, threshold - subtotal))
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0), [cart])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[60] transition ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
      <button type="button" onClick={onClose} className={`absolute inset-0 bg-[#18080d]/55 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} aria-label="Close shopping bag" />
      <aside className={`absolute right-0 top-0 flex h-dvh w-full max-w-[560px] flex-col overflow-hidden bg-cream shadow-2xl transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-label="Shopping bag">
        <div className="relative overflow-hidden border-b border-black/[.07] bg-white px-4 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-wine-100 blur-3xl" />
          <div className="relative flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">Your selection</p>
              <div className="mt-1 flex min-w-0 items-baseline gap-3">
                <h2 className="font-display text-3xl font-semibold leading-none sm:text-4xl">Shopping bag</h2>
                <span className="shrink-0 rounded-full bg-wine-50 px-2.5 py-1 text-[10px] font-extrabold text-wine-800">{itemCount} item{itemCount === 1 ? '' : 's'}</span>
              </div>
            </div>
            <button type="button" className="icon-button shrink-0 border border-black/10 bg-cream" onClick={onClose} aria-label="Close shopping bag"><Icon name="close" /></button>
          </div>
        </div>

        {!cart.length ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-wine-50 text-wine-800"><Icon name="bag" size={35} /></div>
            <p className="eyebrow mt-7">Nothing here yet</p>
            <h3 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Your bag is waiting.</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-black/55">Build your ritual from our premium hair, wig, styling and beauty edit.</p>
            <Link to="/shop" onClick={onClose} className="button-primary mt-7 sm:w-auto">Shop the collection <Icon name="arrow" size={17} /></Link>
          </div>
        ) : (
          <>
            <div className="border-b border-black/[.07] bg-[#f4e9e7] px-4 py-4 sm:px-7">
              <div className="flex min-w-0 items-center justify-between gap-3 text-xs font-extrabold">
                <span className="min-w-0 text-wine-900">{remaining > 0 ? `${money(remaining)} away from free UK delivery` : 'Complimentary UK delivery unlocked'}</span>
                <span className="shrink-0 text-wine-700">{money(threshold)}</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/80">
                <div className="h-full rounded-full bg-wine-800 transition-all duration-500" style={{ width: `${Math.min(100, threshold > 0 ? subtotal / threshold * 100 : 100)}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-7">
              <div className="space-y-3">
                {cart.map((item) => (
                  <article key={item.id} className="grid min-w-0 grid-cols-[86px_minmax(0,1fr)] gap-3 rounded-[22px] border border-black/[.07] bg-white p-3 shadow-[0_7px_24px_rgba(24,20,22,.04)] sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-4 sm:p-4">
                    <Link to={`/product/${item.slug}`} onClick={onClose} className="grid aspect-square place-items-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#faf3ef] to-[#eadbd8] p-2"><img src={item.image} alt={item.name} className="h-[82%] w-[82%] object-contain" /></Link>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-wine-700">{item.category}</p>
                          <Link to={`/product/${item.slug}`} onClick={onClose} className="mt-1 block font-display text-[21px] font-semibold leading-[1.02] hover:text-wine-700 sm:text-2xl">{item.name}</Link>
                          {item.variantName ? <p className="mt-1 text-[10px] font-bold text-black/40">{item.variantName}</p> : null}
                        </div>
                        <button type="button" disabled={busy} onClick={() => updateQuantity(item.id, 0)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-black/35 hover:bg-wine-50 hover:text-wine-700 disabled:opacity-40" aria-label={`Remove ${item.name}`}><Icon name="trash" size={15} /></button>
                      </div>
                      <div className="mt-auto flex min-w-0 flex-wrap items-end justify-between gap-3 pt-4">
                        <div className="flex items-center rounded-full border border-black/10 bg-cream p-1">
                          <button type="button" disabled={busy} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white"><Icon name="minus" size={13} /></button>
                          <span className="w-7 text-center text-xs font-extrabold">{item.quantity}</span>
                          <button type="button" disabled={busy || (item.availableStock && item.quantity >= item.availableStock)} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white disabled:opacity-30"><Icon name="plus" size={13} /></button>
                        </div>
                        <p className="shrink-0 text-sm font-extrabold">{money(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="border-t border-black/[.08] bg-white px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-20px_50px_rgba(24,20,22,.06)] sm:px-7 sm:pb-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-xs font-extrabold uppercase tracking-[.12em] text-black/45">Subtotal</p><p className="mt-1 text-xs text-black/45">Delivery calculated next</p></div>
                <span className="font-display text-3xl font-semibold">{money(subtotal)}</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2"><Link to="/cart" onClick={onClose} className="button-secondary">View bag</Link><Link to="/checkout" onClick={onClose} className="button-primary">Checkout <Icon name="lock" size={16} /></Link></div>
              <p className="mt-3 flex items-center justify-center gap-2 text-center text-[10px] font-bold text-black/45"><Icon name="package" size={13} /> Cash on Delivery only</p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
