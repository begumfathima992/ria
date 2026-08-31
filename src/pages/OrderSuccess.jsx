import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Icon from '../components/Icons'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import { apiMessage, orderService } from '../services'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState('')
  useEffect(() => {
    if (order) return
    orderService.get(orderId).then(setOrder).catch((err) => setError(apiMessage(err))).finally(() => setLoading(false))
  }, [orderId, order])
  if (loading) return <LoadingState label="Loading your order confirmation…" />
  if (error) return <section className="section-pad"><div className="page-container"><ApiNotice>{error}</ApiNotice></div></section>
  if (!order) return null
  return <section className="section-pad"><div className="page-container"><div className="mx-auto max-w-4xl overflow-hidden rounded-[38px] border border-black/[.07] bg-white text-center shadow-luxe"><div className="relative overflow-hidden bg-wine-glow p-9 text-white sm:p-14"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" /><span className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-champagne text-wine-950"><Icon name="check" size={34} /></span><p className="relative mt-7 text-[10px] font-extrabold uppercase tracking-[.22em] text-champagne">Order received</p><h1 className="relative mt-3 font-display text-[clamp(3.2rem,12vw,5.3rem)] font-semibold leading-[.86]">Thank you. Your ritual is on its way.</h1><p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65">Your Cash on Delivery order has been created and stock reserved.</p></div><div className="p-6 text-left sm:p-9"><div className="grid gap-4 sm:grid-cols-3">{[['Order number',order.orderNumber],['Status',String(order.status).replaceAll('_',' ')],['Total',`£${Number(order.totalAmount).toFixed(2)}`]].map(([label,value]) => <div key={label} className="rounded-[20px] bg-cream p-4"><p className="text-[9px] font-extrabold uppercase tracking-[.13em] text-black/40">{label}</p><p className="mt-2 break-words font-display text-2xl font-semibold">{value}</p></div>)}</div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link to={`/account/orders/${order.id}`} className="button-primary">View order details <Icon name="arrow" size={16} /></Link><Link to="/shop" className="button-secondary">Continue shopping</Link></div><p className="mt-5 text-center text-xs leading-6 text-black/45">Payment status: {String(order.paymentStatus).replaceAll('_',' ')} · Pay the courier / delivery method according to H&H instructions.</p></div></div></div></section>
}
