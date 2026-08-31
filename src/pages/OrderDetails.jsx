import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import AccountNav from '../components/AccountNav'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import { orderService, apiMessage } from '../services'

export default function OrderDetails({ onLogout }) {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [action, setAction] = useState('')
  const load = async () => { setLoading(true); setError(''); try { setOrder(await orderService.get(orderId)) } catch (err) { setError(apiMessage(err)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [orderId])

  const actionForm = useFormik({
    enableReinitialize: true,
    initialValues: { reason: '' },
    validationSchema: Yup.object({ reason: action === 'return' ? Yup.string().trim().min(3, 'Please add a short reason.').max(1000).required('Reason is required.') : Yup.string().trim().max(500) }),
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        const updated = action === 'return' ? await orderService.requestReturn(order.id, values.reason.trim()) : await orderService.cancel(order.id, values.reason.trim())
        setOrder(updated); setAction(''); helpers.resetForm()
      } catch (err) { helpers.setStatus(apiMessage(err)) }
    }
  })

  return <section className="section-pad"><div className="page-container"><div className="mb-8"><Link to="/account/orders" className="inline-flex items-center gap-2 text-xs font-extrabold text-wine-700"><Icon name="arrowLeft" size={15} /> Back to orders</Link><p className="eyebrow mt-5">Order details</p><h1 className="mt-3 font-display text-[clamp(3rem,11vw,4.8rem)] font-semibold leading-[.9]">{order?.orderNumber || 'Your order'}</h1></div><div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]"><AccountNav onLogout={onLogout} /><div className="min-w-0">{loading ? <LoadingState label="Loading order…" /> : error ? <ApiNotice onRetry={load}>{error}</ApiNotice> : !order ? null : <div className="space-y-6">
    <section className="overflow-hidden rounded-[30px] border border-black/[.07] bg-white shadow-soft"><div className="bg-wine-glow p-6 text-white sm:p-8"><div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-champagne">Current status</p><h2 className="mt-2 font-display text-4xl font-semibold">{String(order.status).replaceAll('_',' ')}</h2><p className="mt-2 text-xs text-white/60">Placed {new Date(order.createdAt).toLocaleString('en-GB')}</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-[9px] font-extrabold uppercase tracking-[.13em] text-white/50">Order total</p><p className="mt-1 font-display text-3xl font-semibold">£{Number(order.totalAmount).toFixed(2)}</p></div></div></div><div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">{[['Payment',order.paymentMethod === 'COD' ? 'Cash on delivery' : order.paymentMethod],['Payment status',String(order.paymentStatus).replaceAll('_',' ')],['Delivery',String(order.shippingMethod).replaceAll('_',' ')]].map(([label,value]) => <div key={label} className="rounded-[20px] bg-cream p-4"><p className="text-[9px] font-extrabold uppercase tracking-[.13em] text-black/40">{label}</p><p className="mt-2 text-sm font-bold">{value}</p></div>)}</div></section>
    <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7"><p className="eyebrow">Products</p><div className="mt-5 space-y-3">{(order.items || []).map((item) => <div key={item.id} className="grid min-w-0 grid-cols-[76px_minmax(0,1fr)] gap-4 rounded-[20px] bg-cream p-3 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center"><img src={item.imageUrl} alt="" className="h-20 w-20 rounded-2xl bg-white object-cover sm:h-24 sm:w-24" /><div className="min-w-0"><p className="font-display text-2xl font-semibold leading-none">{item.productName}</p><p className="mt-2 text-xs text-black/45">{item.variantName || item.sku} · Qty {item.quantity}</p>{item.productId ? <Link to={`/product/${item.productId}`} className="mt-2 inline-flex text-[11px] font-extrabold text-wine-700">View product / review</Link> : null}</div><strong className="col-start-2 text-sm sm:col-start-auto">£{Number(item.lineTotal).toFixed(2)}</strong></div>)}</div></section>
    <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7"><p className="eyebrow">Delivery address</p><Address address={order.shippingAddress} /></section><section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7"><p className="eyebrow">Order totals</p><div className="mt-5 space-y-3 text-sm">{[['Subtotal',order.subtotal],['Discount',-Number(order.discountAmount || 0)],['Delivery',order.shippingAmount],['COD fee',order.codFee]].map(([label,value]) => <div key={label} className="flex justify-between gap-4"><span className="text-black/50">{label}</span><strong>{Number(value) < 0 ? '-' : ''}£{Math.abs(Number(value || 0)).toFixed(2)}</strong></div>)}<div className="border-t border-black/10 pt-3 flex justify-between"><strong>Total</strong><strong className="font-display text-2xl">£{Number(order.totalAmount).toFixed(2)}</strong></div></div></section></div>
    <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7"><p className="eyebrow">Tracking timeline</p><div className="mt-6 space-y-0">{(order.history || []).map((item, index) => <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0"><div className="relative flex w-5 shrink-0 justify-center"><span className="z-10 mt-1 h-3 w-3 rounded-full bg-wine-700 ring-4 ring-wine-50" />{index < order.history.length - 1 ? <span className="absolute top-4 bottom-[-4px] w-px bg-wine-200" /> : null}</div><div><p className="text-xs font-extrabold text-ink">{String(item.status).replaceAll('_',' ')}</p><p className="mt-1 text-xs leading-5 text-black/45">{item.note || 'Order updated'} · {new Date(item.createdAt).toLocaleString('en-GB')}</p></div></div>)}</div></section>
    {['PENDING','CONFIRMED'].includes(order.status) ? <button type="button" onClick={() => setAction('cancel')} className="button-secondary border-wine-200 text-wine-700 sm:w-auto">Cancel this order</button> : null}
    {order.status === 'DELIVERED' ? <button type="button" onClick={() => setAction('return')} className="button-secondary sm:w-auto">Request a return</button> : null}
    {action ? <section className="rounded-[30px] border border-wine-100 bg-wine-50 p-5 sm:p-7"><p className="eyebrow">{action === 'return' ? 'Return request' : 'Order cancellation'}</p><h3 className="mt-2 font-display text-3xl font-semibold">{action === 'return' ? 'Tell us why you would like to return it.' : 'Cancel this order?'}</h3><form onSubmit={actionForm.handleSubmit} className="mt-5"><FormField label="Reason" name="reason" as="textarea" rows="4" formik={actionForm} placeholder="Add a short reason…" />{actionForm.status ? <div className="mt-4"><ApiNotice>{actionForm.status}</ApiNotice></div> : null}<div className="mt-4 flex flex-col gap-2 sm:flex-row"><button disabled={actionForm.isSubmitting} className="button-primary sm:w-auto">{actionForm.isSubmitting ? 'Submitting…' : 'Confirm request'}</button><button type="button" onClick={() => { setAction(''); actionForm.resetForm() }} className="button-secondary sm:w-auto">Keep order</button></div></form></section> : null}
  </div>}</div></div></div></section>
}

function Address({ address = {} }) { return <div className="mt-5 text-sm leading-7 text-black/60"><strong className="text-ink">{address.firstName} {address.lastName}</strong><br />{address.addressLine1}{address.addressLine2 ? <><br />{address.addressLine2}</> : null}<br />{address.city}{address.county ? `, ${address.county}` : ''}<br />{address.postcode}<br />{address.country}<br /><span className="text-black/45">{address.phone}</span></div> }
