import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import { useAuth } from '../context/AuthContext'
import { apiMessage, publicService } from '../services'

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/
const schema = Yup.object({
  firstName: Yup.string().trim().min(2, 'Use at least 2 characters.').max(80).required('First name is required.'),
  lastName: Yup.string().trim().min(2, 'Use at least 2 characters.').max(80).required('Last name is required.'),
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  phone: Yup.string().trim().max(30, 'Phone number is too long.'),
  password: Yup.string().matches(passwordRule, 'Use 8+ characters with uppercase, lowercase and a number.').required('Password is required.'),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match.').required('Confirm your password.'),
  marketing: Yup.boolean()
})

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '', marketing: true },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        await register({ firstName: values.firstName.trim(), lastName: values.lastName.trim(), email: values.email.trim().toLowerCase(), phone: values.phone.trim() || null, password: values.password })
        if (values.marketing) publicService.subscribeNewsletter(values.email).catch(() => {})
        navigate('/account', { replace: true })
      } catch (error) { helpers.setStatus(apiMessage(error, 'Could not create your account.')) }
    }
  })

  return (
    <section className="section-pad">
      <div className="page-container grid min-w-0 gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
        <aside className="overflow-hidden rounded-[34px] bg-wine-glow p-7 text-white shadow-luxe sm:p-10 lg:sticky lg:top-[118px] lg:p-12"><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-champagne">Join the H&H circle</p><h1 className="mt-4 font-display text-[clamp(3.2rem,11vw,5rem)] font-semibold leading-[.88]">Beauty feels better when it is personal.</h1><p className="mt-6 max-w-lg text-sm leading-7 text-white/65">Create your account for a synced bag, wishlist, saved addresses and COD order history.</p><div className="mt-8 space-y-3">{['Save favourites across your visits','Keep delivery details ready','Review and track every order'].map((item) => <p key={item} className="flex gap-3 text-sm text-white/80"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-champagne"><Icon name="check" size={12} /></span>{item}</p>)}</div></aside>
        <div className="rounded-[34px] border border-black/[.07] bg-white p-6 shadow-soft sm:p-10 lg:p-12"><p className="eyebrow">Create your account</p><h2 className="mt-3 font-display text-[clamp(2.8rem,10vw,4rem)] font-semibold leading-none">A few details, then you’re in.</h2>
          <form onSubmit={formik.handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2" noValidate>
            <FormField label="First name" name="firstName" formik={formik} autoComplete="given-name" />
            <FormField label="Last name" name="lastName" formik={formik} autoComplete="family-name" />
            <FormField label="Email address" name="email" type="email" formik={formik} className="sm:col-span-2" autoComplete="email" />
            <FormField label="Mobile number (optional)" name="phone" formik={formik} className="sm:col-span-2" autoComplete="tel" />
            <FormField label="Password" name="password" type="password" formik={formik} autoComplete="new-password" />
            <FormField label="Confirm password" name="confirm" type="password" formik={formik} autoComplete="new-password" />
            {formik.status ? <div className="sm:col-span-2"><ApiNotice>{formik.status}</ApiNotice></div> : null}
            <label className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-cream p-4 text-xs leading-5 text-black/55"><input type="checkbox" name="marketing" checked={formik.values.marketing} onChange={formik.handleChange} className="mt-0.5 h-4 w-4 shrink-0 accent-wine-800" /> Send me occasional H&H beauty edits, new arrivals and offers.</label>
            <button type="submit" disabled={formik.isSubmitting} className="button-primary sm:col-span-2 disabled:opacity-60">{formik.isSubmitting ? 'Creating account…' : 'Create my account'} <Icon name="arrow" /></button>
          </form>
          <p className="mt-6 text-sm text-black/55">Already registered? <Link to="/login" className="font-extrabold text-wine-700">Sign in</Link></p>
        </div>
      </div>
    </section>
  )
}
