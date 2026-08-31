import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import { useAuth } from '../context/AuthContext'
import { apiMessage } from '../services'

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string().required('Password is required.')
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/account'

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        await login({ email: values.email.trim().toLowerCase(), password: values.password })
        navigate(destination, { replace: true })
      } catch (error) {
        helpers.setStatus(apiMessage(error, 'Sign in failed. Please check your details.'))
      }
    }
  })

  return (
    <section className="relative overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-wine-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-champagne/15 blur-3xl" />
      <div className="page-container relative grid overflow-hidden rounded-[34px] border border-black/[.06] bg-white shadow-luxe lg:grid-cols-[.88fr_1.12fr] lg:rounded-[42px]">
        <div className="order-2 p-6 sm:p-10 lg:order-1 lg:p-14 xl:p-16">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-3 font-display text-[clamp(3.2rem,12vw,5rem)] font-semibold leading-[.88]">Sign in to your H&H account.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-black/55">Access your server-backed wishlist, saved addresses, bag and order history.</p>
          <form onSubmit={formik.handleSubmit} className="mt-8 space-y-4" noValidate>
            <FormField label="Email address" name="email" type="email" formik={formik} autoComplete="email" placeholder="you@example.co.uk" />
            <FormField label="Password" name="password" type="password" formik={formik} autoComplete="current-password" placeholder="••••••••" />
            {formik.status ? <ApiNotice>{formik.status}</ApiNotice> : null}
            <div className="flex min-w-0 items-center justify-end text-xs"><Link to="/forgot-password" className="font-extrabold text-wine-700">Forgot your password?</Link></div>
            <button type="submit" disabled={formik.isSubmitting} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">{formik.isSubmitting ? 'Signing in…' : 'Sign in securely'} <Icon name="lock" size={16} /></button>
          </form>
          <p className="mt-6 text-sm text-black/55">New to H&H? <Link to="/register" className="font-extrabold text-wine-700">Create an account</Link></p>
        </div>
        <div className="order-1 relative min-h-[300px] overflow-hidden bg-wine-glow p-7 text-white sm:min-h-[380px] sm:p-10 lg:order-2 lg:min-h-full lg:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" /><div className="absolute bottom-[-90px] left-[-70px] h-72 w-72 rounded-full bg-champagne/15 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.23em] text-champagne">The H&H circle</p><h2 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,10vw,4.7rem)] font-semibold leading-[.88]">Your beauty edit, remembered.</h2></div><div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{[['heart','Saved favourites'],['orders','Order history'],['package','Faster checkout']].map(([icon,label]) => <div key={label} className="rounded-[20px] border border-white/15 bg-white/[.07] p-4 backdrop-blur"><Icon name={icon} className="text-champagne" /><p className="mt-3 text-xs font-extrabold uppercase tracking-[.1em]">{label}</p></div>)}</div></div>
        </div>
      </div>
    </section>
  )
}
