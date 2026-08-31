import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Icon from '../components/Icons'
import PageHero from '../components/PageHero'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import { publicService, apiMessage } from '../services'

const schema = Yup.object({
  name: Yup.string().trim().min(2).max(160).required('Your name is required.'),
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  phone: Yup.string().trim().max(30),
  subject: Yup.string().trim().min(2).max(191).required('Subject is required.'),
  message: Yup.string().trim().min(5, 'Please add a little more detail.').max(5000).required('Message is required.')
})

export default function Contact() {
  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', subject: '', message: '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        await publicService.contact({ ...values, phone: values.phone.trim() || null })
        helpers.resetForm()
        helpers.setStatus({ success: true, message: 'Thanks. Your message has been received by H&H.' })
      } catch (error) { helpers.setStatus({ success: false, message: apiMessage(error) }) }
    }
  })
  return <><PageHero eyebrow="Here to help" title="Talk to H&H." copy="Product questions, order support or beauty guidance — send us a note and our team will help." /><section className="section-pad"><div className="page-container grid min-w-0 gap-7 lg:grid-cols-[.72fr_1.28fr]"><aside className="rounded-[30px] bg-wine-glow p-7 text-white shadow-luxe sm:p-9"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-champagne">Customer care</p><h2 className="mt-4 font-display text-4xl font-semibold leading-none">A thoughtful response, without the fuss.</h2><div className="mt-8 space-y-4">{[['mail','hello@hhcosmetics.co.uk'],['phone','+44 20 7946 0123'],['clock','Monday–Friday · 9am–5pm']].map(([icon,text]) => <div key={text} className="flex min-w-0 gap-3 rounded-2xl border border-white/15 bg-white/[.06] p-4"><Icon name={icon} className="shrink-0 text-champagne" /><span className="min-w-0 break-words text-sm text-white/75">{text}</span></div>)}</div></aside><div className="rounded-[30px] border border-black/[.07] bg-white p-6 shadow-soft sm:p-9"><p className="eyebrow">Send a message</p><h2 className="mt-2 font-display text-4xl font-semibold">How can we help?</h2><form onSubmit={formik.handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2" noValidate><FormField label="Your name" name="name" formik={formik} /><FormField label="Email address" name="email" type="email" formik={formik} /><FormField label="Phone (optional)" name="phone" formik={formik} /><FormField label="Subject" name="subject" formik={formik} /><FormField label="Message" name="message" as="textarea" rows="6" formik={formik} className="sm:col-span-2" />{formik.status ? <div className="sm:col-span-2"><ApiNotice type={formik.status.success ? 'success' : 'error'}>{formik.status.message}</ApiNotice></div> : null}<button disabled={formik.isSubmitting} className="button-primary sm:col-span-2 sm:w-auto sm:justify-self-start disabled:opacity-60">{formik.isSubmitting ? 'Sending…' : 'Send message'} <Icon name="arrow" size={16} /></button></form></div></div></section></>
}
