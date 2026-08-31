import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import { authService, apiMessage } from '../services'

const schema = Yup.object({
  token: Yup.string().min(32, 'Reset token is incomplete.').required('Reset token is required.'),
  password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/, 'Use 8+ characters with uppercase, lowercase and a number.').required('New password is required.'),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match.').required('Confirm your new password.')
})

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { token: params.get('token') || '', password: '', confirm: '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        await authService.resetPassword({ token: values.token.trim(), password: values.password })
        helpers.setStatus({ success: true, message: 'Password changed successfully. Redirecting to sign in…' })
        setTimeout(() => navigate('/login', { replace: true }), 1000)
      } catch (error) { helpers.setStatus({ success: false, message: apiMessage(error) }) }
    }
  })
  return <section className="section-pad"><div className="page-container"><div className="mx-auto max-w-2xl rounded-[36px] border border-black/[.07] bg-white p-6 shadow-card sm:p-10 lg:p-12"><p className="eyebrow">Secure reset</p><h1 className="mt-3 font-display text-[clamp(3rem,11vw,4.5rem)] font-semibold leading-[.9]">Choose a new password.</h1><p className="mt-5 text-sm leading-7 text-black/55">Your password must contain uppercase, lowercase and a number.</p><form onSubmit={formik.handleSubmit} className="mt-7 space-y-4" noValidate><FormField label="Reset token" name="token" formik={formik} /><FormField label="New password" name="password" type="password" formik={formik} autoComplete="new-password" /><FormField label="Confirm new password" name="confirm" type="password" formik={formik} autoComplete="new-password" />{formik.status ? <ApiNotice type={formik.status.success ? 'success' : 'error'}>{formik.status.message}</ApiNotice> : null}<button type="submit" disabled={formik.isSubmitting} className="button-primary w-full disabled:opacity-60">{formik.isSubmitting ? 'Updating…' : 'Update password'} <Icon name="lock" size={16} /></button></form><p className="mt-6 text-sm text-black/50"><Link to="/login" className="font-extrabold text-wine-700">Back to sign in</Link></p></div></div></section>
}
