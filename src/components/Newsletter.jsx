import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Icon from './Icons'
import { publicService, apiMessage } from '../services'

export default function Newsletter() {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({ email: Yup.string().email('Enter a valid email.').required('Email is required.') }),
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try { await publicService.subscribeNewsletter(values.email.trim().toLowerCase()); helpers.setStatus({ success: true, message: 'You’re on the H&H list.' }); helpers.resetForm() }
      catch (error) { helpers.setStatus({ success: false, message: apiMessage(error) }) }
    }
  })
  return <section className="section-pad pt-0"><div className="page-container"><div className="relative overflow-hidden rounded-[38px] bg-wine-glow px-6 py-12 text-white shadow-luxe sm:px-10 lg:px-16 lg:py-16"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-champagne/10 blur-3xl" /><div className="relative grid items-center gap-9 lg:grid-cols-[1fr_.9fr]"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.23em] text-champagne">The H&H edit</p><h2 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,11vw,3.75rem)] font-semibold leading-[.95]">Beauty notes, new arrivals and private offers.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/70">Join our list for curated hair-care advice, launch news and seasonal offers.</p></div>{formik.status?.success ? <div className="flex min-w-0 flex-col items-start gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 min-[430px]:flex-row min-[430px]:items-center"><span className="grid h-11 w-11 place-items-center rounded-full bg-champagne text-wine-950"><Icon name="check" /></span><div><p className="font-extrabold">You’re on the list.</p><p className="mt-1 text-sm text-white/60">Your subscription is saved in the backend.</p></div></div> : <form onSubmit={formik.handleSubmit} className="min-w-0" noValidate><div className="rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm sm:flex"><label className="sr-only" htmlFor="newsletter-email">Email address</label><div className="flex flex-1 items-center gap-3 px-4"><Icon name="mail" className="text-white/50" /><input id="newsletter-email" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Your email address" className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/50" /></div><button type="submit" disabled={formik.isSubmitting} className="w-full rounded-xl bg-champagne px-6 py-4 text-sm font-extrabold text-wine-950 transition hover:bg-white disabled:opacity-60 sm:w-auto">{formik.isSubmitting ? 'Joining…' : 'Join the list'}</button></div>{formik.touched.email && formik.errors.email ? <p className="mt-2 text-xs font-bold text-rose-200">{formik.errors.email}</p> : null}{formik.status?.message ? <p className="mt-2 text-xs font-bold text-rose-200">{formik.status.message}</p> : null}</form>}</div></div></div></section>
}
