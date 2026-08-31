import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import AccountNav from '../components/AccountNav'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import { useAuth } from '../context/AuthContext'
import { useCommerce } from '../context/CommerceContext'
import { apiMessage, orderService, publicService, userService } from '../services'

const profileSchema = Yup.object({
  firstName: Yup.string().trim().min(2).max(80).required('First name is required.'),
  lastName: Yup.string().trim().min(2).max(80).required('Last name is required.'),
  phone: Yup.string().trim().max(30)
})
const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required.'),
  newPassword: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/, 'Use 8+ characters with uppercase, lowercase and a number.').required('New password is required.'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match.').required('Confirm the new password.')
})

export default function Account({ onLogout }) {
  const { user, updateProfile } = useAuth()
  const { wishlist } = useCommerce()
  const [summary, setSummary] = useState({ orders: 0, addresses: 0, recent: [] })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newsletterStatus, setNewsletterStatus] = useState(null)

  useEffect(() => {
    let active = true
    Promise.allSettled([orderService.list({ page: 1, limit: 2 }), userService.getAddresses()]).then(([orders, addresses]) => {
      if (!active) return
      setSummary({
        orders: orders.status === 'fulfilled' ? Number(orders.value.meta?.total || orders.value.items.length) : 0,
        recent: orders.status === 'fulfilled' ? orders.value.items : [],
        addresses: addresses.status === 'fulfilled' ? addresses.value.length : 0
      })
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const profile = useFormik({
    enableReinitialize: true,
    initialValues: { firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' },
    validationSchema: profileSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        await updateProfile({ firstName: values.firstName.trim(), lastName: values.lastName.trim(), phone: values.phone.trim() || null })
        helpers.setStatus({ success: true, message: 'Your profile has been updated.' })
        setEditing(false)
      } catch (error) { helpers.setStatus({ success: false, message: apiMessage(error) }) }
    }
  })

  const password = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: passwordSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        await userService.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
        helpers.resetForm()
        helpers.setStatus({ success: true, message: 'Password updated. For security, please sign in again.' })
        setTimeout(() => { onLogout?.() }, 700)
      } catch (error) { helpers.setStatus({ success: false, message: apiMessage(error) }) }
    }
  })

  return (
    <section className="section-pad">
      <div className="page-container">
        <div className="mb-8 min-w-0"><p className="eyebrow">Your H&H account</p><h1 className="mt-3 font-display text-[clamp(3rem,11vw,4.8rem)] font-semibold leading-[.9]">Welcome, {user?.firstName || 'beauty lover'}.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">Your live account data, orders, addresses and favourites in one refined space.</p></div>
        <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]">
          <AccountNav onLogout={onLogout} />
          <div className="min-w-0 space-y-6">
            {loading ? <LoadingState compact label="Loading account summary…" /> : <div className="grid gap-4 sm:grid-cols-3">{[[summary.orders,'Orders','orders'],[summary.addresses,'Saved addresses','location'],[wishlist.length,'Wishlist','heart']].map(([value,label,icon]) => <div key={label} className="rounded-[26px] border border-black/[.07] bg-white p-5 shadow-soft"><Icon name={icon} className="text-wine-700" /><strong className="mt-4 block font-display text-4xl font-semibold leading-none">{value}</strong><span className="mt-2 block text-[10px] font-extrabold uppercase tracking-[.13em] text-black/45">{label}</span></div>)}</div>}

            <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow">Profile</p><h2 className="mt-2 font-display text-3xl font-semibold">Personal details</h2></div><button type="button" onClick={() => setEditing((value) => !value)} className="button-secondary sm:w-auto"><Icon name="edit" size={16} /> {editing ? 'Cancel' : 'Edit details'}</button></div>
              {profile.status ? <div className="mt-5"><ApiNotice type={profile.status.success ? 'success' : 'error'}>{profile.status.message}</ApiNotice></div> : null}
              {editing ? <form onSubmit={profile.handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate><FormField label="First name" name="firstName" formik={profile} /><FormField label="Last name" name="lastName" formik={profile} /><div className="form-field sm:col-span-2"><span>Email address</span><div className="rounded-2xl border border-black/10 bg-black/[.025] px-4 py-3.5 text-sm font-normal text-black/55">{user?.email}</div></div><FormField label="Phone" name="phone" formik={profile} className="sm:col-span-2" /><button disabled={profile.isSubmitting} className="button-primary sm:col-span-2 sm:w-auto sm:justify-self-start disabled:opacity-60">{profile.isSubmitting ? 'Saving…' : 'Save changes'}</button></form> : <div className="mt-6 grid gap-4 sm:grid-cols-2"><Info label="Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()} /><Info label="Email" value={user?.email || 'Not added'} /><Info label="Phone" value={user?.phone || 'Not added'} /><Info label="Account status" value={user?.status || 'ACTIVE'} /></div>}
            </section>

            <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7"><div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow">Email preferences</p><h2 className="mt-2 font-display text-3xl font-semibold">The H&H edit</h2><p className="mt-2 text-sm leading-6 text-black/50">Subscribe or unsubscribe your account email from beauty notes and new arrivals.</p></div><div className="flex shrink-0 flex-col gap-2 min-[430px]:flex-row"><button type="button" onClick={async () => { try { await publicService.subscribeNewsletter(user.email); setNewsletterStatus({success:true,message:'You are subscribed to H&H updates.'}) } catch (error) { setNewsletterStatus({success:false,message:apiMessage(error)}) } }} className="button-secondary min-h-10 px-4 py-2 text-xs sm:w-auto">Subscribe</button><button type="button" onClick={async () => { try { await publicService.unsubscribeNewsletter(user.email); setNewsletterStatus({success:true,message:'You have been unsubscribed.'}) } catch (error) { setNewsletterStatus({success:false,message:apiMessage(error)}) } }} className="button-secondary min-h-10 px-4 py-2 text-xs sm:w-auto">Unsubscribe</button></div></div>{newsletterStatus ? <div className="mt-4"><ApiNotice type={newsletterStatus.success ? 'success' : 'error'}>{newsletterStatus.message}</ApiNotice></div> : null}</section>

            <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7">
              <div><p className="eyebrow">Security</p><h2 className="mt-2 font-display text-3xl font-semibold">Change password</h2><p className="mt-2 text-sm leading-6 text-black/50">Updating your password revokes active refresh sessions. You will be asked to sign in again.</p></div>
              <form onSubmit={password.handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate><FormField label="Current password" name="currentPassword" type="password" formik={password} className="sm:col-span-2" /><FormField label="New password" name="newPassword" type="password" formik={password} /><FormField label="Confirm password" name="confirmPassword" type="password" formik={password} />{password.status ? <div className="sm:col-span-2"><ApiNotice type={password.status.success ? 'success' : 'error'}>{password.status.message}</ApiNotice></div> : null}<button disabled={password.isSubmitting} className="button-primary sm:col-span-2 sm:w-auto sm:justify-self-start disabled:opacity-60">{password.isSubmitting ? 'Updating…' : 'Update password'} <Icon name="lock" size={16} /></button></form>
            </section>

            <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-soft sm:p-7"><div className="flex min-w-0 items-end justify-between gap-4"><div><p className="eyebrow">Recent activity</p><h2 className="mt-2 font-display text-3xl font-semibold">Latest orders</h2></div><Link to="/account/orders" className="shrink-0 text-xs font-extrabold text-wine-700">View all</Link></div>{summary.recent.length ? <div className="mt-6 space-y-3">{summary.recent.map((order) => <Link key={order.id} to={`/account/orders/${order.id}`} className="flex min-w-0 flex-col gap-3 rounded-[22px] bg-cream p-4 transition hover:bg-wine-50 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-display text-2xl font-semibold">{order.orderNumber}</p><p className="mt-1 text-xs text-black/45">{new Date(order.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} · {order.items?.length || 0} product lines</p></div><div className="flex items-center justify-between gap-5 sm:justify-end"><Status value={order.status} /><strong>£{Number(order.totalAmount || 0).toFixed(2)}</strong></div></Link>)}</div> : <div className="mt-6 rounded-[22px] bg-cream p-6 text-center"><p className="text-sm text-black/50">You have not placed an order yet.</p><Link to="/shop" className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-wine-700">Start shopping <Icon name="arrow" size={15} /></Link></div>}</section>
          </div>
        </div>
      </div>
    </section>
  )
}

function Info({ label, value }) { return <div className="rounded-[20px] bg-cream p-4"><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-black/40">{label}</p><p className="mt-2 break-words text-sm font-bold text-ink">{value || 'Not added'}</p></div> }
function Status({ value }) { return <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-wine-700">{String(value || '').replaceAll('_',' ')}</span> }
