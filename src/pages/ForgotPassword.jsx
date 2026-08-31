import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import { authService, apiMessage } from '../services'

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({ email: Yup.string().email('Enter a valid email address.').required('Email is required.') }),
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        const result = await authService.forgotPassword(values.email.trim().toLowerCase())
        helpers.setStatus({ success: true, message: result.message, token: result.data?.resetToken || '' })
      } catch (error) { helpers.setStatus({ success: false, message: apiMessage(error) }) }
    }
  })
  const status = formik.status
  return <section className="section-pad"><div className="page-container"><div className="mx-auto max-w-2xl rounded-[36px] border border-black/[.07] bg-white p-6 text-center shadow-card sm:p-10 lg:p-12"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-wine-50 text-wine-700"><Icon name={status?.success ? 'checkCircle' : 'lock'} size={26} /></div><p className="eyebrow mt-6">Account support</p><h1 className="mt-3 font-display text-[clamp(3rem,11vw,4.5rem)] font-semibold leading-[.9]">{status?.success ? 'Check your reset instructions.' : 'Reset your password.'}</h1>
    {status?.success ? <div className="mt-7 space-y-4 text-left"><ApiNotice type="success">{status.message}</ApiNotice>{status.token ? <div className="rounded-2xl border border-champagne/40 bg-[#fffaf0] p-4 text-xs leading-6 text-black/65"><strong className="block text-ink">Development reset token</strong><code className="mt-2 block break-all rounded-xl bg-white p-3 text-wine-800">{status.token}</code><Link to={`/reset-password?token=${encodeURIComponent(status.token)}`} className="button-primary mt-4">Continue to reset password</Link></div> : null}<Link to="/login" className="button-secondary">Back to sign in</Link></div> : <form onSubmit={formik.handleSubmit} className="mx-auto mt-7 max-w-md text-left" noValidate><FormField label="Email address" name="email" type="email" formik={formik} placeholder="you@example.co.uk" />{status?.message ? <div className="mt-4"><ApiNotice>{status.message}</ApiNotice></div> : null}<button type="submit" disabled={formik.isSubmitting} className="button-primary mt-5 w-full disabled:opacity-60">{formik.isSubmitting ? 'Preparing…' : 'Send reset instructions'} <Icon name="mail" size={16} /></button></form>}
  </div></div></section>
}
