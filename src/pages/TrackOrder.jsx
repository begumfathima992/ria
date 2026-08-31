import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import { apiMessage, orderService } from '../services'

export default function TrackOrder() {
  const formik = useFormik({
    initialValues: { orderNumber: '', email: '' },
    validationSchema: Yup.object({
      orderNumber: Yup.string().trim().max(40).required('Order number is required.'),
      email: Yup.string().email('Enter a valid email address.').required('Email is required.')
    }),
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try { helpers.setStatus({ success: true, order: await orderService.track({ orderNumber: values.orderNumber.trim(), email: values.email.trim().toLowerCase() }) }) }
      catch (error) { helpers.setStatus({ success: false, message: apiMessage(error, 'We could not find that order.') }) }
    }
  })
  const order = formik.status?.order
  return <section className="section-pad"><div className="page-container"><div className="grid min-w-0 gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><aside className="overflow-hidden rounded-[34px] bg-wine-glow p-8 text-white shadow-luxe sm:p-10 lg:sticky lg:top-[118px]"><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-champagne">Order tracking</p><h1 className="mt-4 font-display text-[clamp(3.2rem,11vw,5rem)] font-semibold leading-[.88]">See where your H&H order is.</h1><p className="mt-6 text-sm leading-7 text-white/65">Use the order number and checkout email. You do not need to sign in.</p><div className="mt-8 flex gap-3 rounded-2xl border border-white/15 bg-white/[.06] p-4"><Icon name="package" className="shrink-0 text-champagne" /><p className="text-xs leading-6 text-white/70">Example dummy order from the seed data: <strong className="text-white">HH-DEMO-1001</strong> with <strong className="text-white">customer@example.com</strong>.</p></div></aside><div className="rounded-[34px] border border-black/[.07] bg-white p-6 shadow-soft sm:p-10"><p className="eyebrow">Find an order</p><h2 className="mt-3 font-display text-[clamp(2.8rem,10vw,4rem)] font-semibold leading-none">Enter your details.</h2><form onSubmit={formik.handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2" noValidate><FormField label="Order number" name="orderNumber" formik={formik} placeholder="HH-260810-1234" /><FormField label="Email address" name="email" type="email" formik={formik} placeholder="you@example.co.uk" /><button type="submit" disabled={formik.isSubmitting} className="button-primary sm:col-span-2 disabled:opacity-60">{formik.isSubmitting ? 'Finding order…' : 'Track order'} <Icon name="search" size={16} /></button></form>{formik.status && !formik.status.success ? <div className="mt-5"><ApiNotice>{formik.status.message}</ApiNotice></div> : null}{order ? <div className="mt-8 border-t border-black/[.08] pt-7"><div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">{order.orderNumber}</p><h3 className="mt-2 font-display text-4xl font-semibold">{String(order.status).replaceAll('_',' ')}</h3></div><div className="rounded-2xl bg-cream px-4 py-3"><p className="text-[9px] font-extrabold uppercase tracking-[.13em] text-black/40">Order total</p><p className="font-display text-2xl font-semibold">£{Number(order.totalAmount).toFixed(2)}</p></div></div><div className="mt-7 space-y-0">{(order.history || []).map((item, index) => <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0"><div className="relative flex w-5 shrink-0 justify-center"><span className="z-10 mt-1 h-3 w-3 rounded-full bg-wine-700 ring-4 ring-wine-50" />{index < order.history.length - 1 ? <span className="absolute top-4 bottom-[-4px] w-px bg-wine-200" /> : null}</div><div><p className="text-xs font-extrabold">{String(item.status).replaceAll('_',' ')}</p><p className="mt-1 text-xs leading-5 text-black/45">{item.note || 'Order updated'} · {new Date(item.createdAt).toLocaleString('en-GB')}</p></div></div>)}</div></div> : null}</div></div></div></section>
}
