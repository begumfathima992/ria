import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AccountNav from '../components/AccountNav'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import { apiMessage, userService } from '../services'
import { useAuth } from '../context/AuthContext'

const schema = Yup.object({
  label: Yup.string().trim().max(50).required('Address label is required.'),
  firstName: Yup.string().trim().min(2).max(80).required('First name is required.'),
  lastName: Yup.string().trim().min(2).max(80).required('Last name is required.'),
  phone: Yup.string().trim().max(30).required('Phone number is required.'),
  addressLine1: Yup.string().trim().max(191).required('Address line 1 is required.'),
  addressLine2: Yup.string().trim().max(191),
  city: Yup.string().trim().max(100).required('Town / city is required.'),
  county: Yup.string().trim().max(100),
  postcode: Yup.string().trim().max(20).required('Postcode is required.'),
  country: Yup.string().trim().max(80).required('Country is required.'),
  isDefault: Yup.boolean()
})

const blank = { label: 'Home', firstName: '', lastName: '', phone: '', addressLine1: '', addressLine2: '', city: '', county: '', postcode: '', country: 'United Kingdom', isDefault: false }

export default function AccountAddresses({ onLogout }) {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => { setLoading(true); setError(''); try { setAddresses(await userService.getAddresses()) } catch (err) { setError(apiMessage(err)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editingId ? { ...blank, ...(addresses.find((item) => item.id === editingId) || {}) } : { ...blank, firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      const payload = { ...values, addressLine2: values.addressLine2.trim() || null, county: values.county.trim() || null }
      try {
        if (editingId) await userService.updateAddress(editingId, payload)
        else await userService.createAddress(payload)
        await load(); setShowForm(false); setEditingId(null); helpers.resetForm()
      } catch (err) { helpers.setStatus(apiMessage(err)) }
    }
  })

  const edit = (address) => { setEditingId(address.id); setShowForm(true) }
  const create = () => { setEditingId(null); setShowForm(true) }
  const remove = async (id) => { if (!window.confirm('Remove this saved address?')) return; try { await userService.deleteAddress(id); await load() } catch (err) { setError(apiMessage(err)) } }
  const setDefault = async (id) => { try { await userService.setDefaultAddress(id); await load() } catch (err) { setError(apiMessage(err)) } }

  return <section className="section-pad"><div className="page-container"><div className="mb-8 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Your account</p><h1 className="mt-3 font-display text-[clamp(3rem,11vw,4.8rem)] font-semibold leading-[.9]">Saved addresses.</h1><p className="mt-4 text-sm leading-7 text-black/55">Manage the UK delivery details used during checkout.</p></div><button type="button" onClick={create} className="button-primary sm:w-auto"><Icon name="plus" size={16} /> Add address</button></div><div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]"><AccountNav onLogout={onLogout} /><div className="min-w-0 space-y-6">{error ? <ApiNotice onRetry={load}>{error}</ApiNotice> : null}{loading ? <LoadingState label="Loading saved addresses…" /> : addresses.length ? <div className="grid gap-4 md:grid-cols-2">{addresses.map((address) => <article key={address.id} className={`relative rounded-[28px] border bg-white p-5 shadow-soft sm:p-6 ${address.isDefault ? 'border-wine-300 ring-4 ring-wine-50' : 'border-black/[.07]'}`}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{address.label}</p><h2 className="mt-2 font-display text-3xl font-semibold">{address.firstName} {address.lastName}</h2></div>{address.isDefault ? <span className="rounded-full bg-wine-800 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-white">Default</span> : null}</div><div className="mt-4 text-sm leading-7 text-black/55">{address.addressLine1}{address.addressLine2 ? <><br />{address.addressLine2}</> : null}<br />{address.city}{address.county ? `, ${address.county}` : ''}<br />{address.postcode}<br />{address.country}<br /><span className="text-black/40">{address.phone}</span></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => edit(address)} className="button-secondary min-h-10 px-4 py-2 text-xs sm:w-auto"><Icon name="edit" size={14} /> Edit</button>{!address.isDefault ? <button type="button" onClick={() => setDefault(address.id)} className="button-secondary min-h-10 px-4 py-2 text-xs sm:w-auto">Make default</button> : null}<button type="button" onClick={() => remove(address.id)} className="button-secondary min-h-10 px-4 py-2 text-xs text-wine-700 sm:w-auto"><Icon name="trash" size={14} /> Remove</button></div></article>)}</div> : <div className="rounded-[30px] border border-black/[.07] bg-white p-10 text-center shadow-soft"><Icon name="location" size={34} className="mx-auto text-wine-300" /><h2 className="mt-4 font-display text-4xl font-semibold">No saved address yet.</h2><button type="button" onClick={create} className="button-primary mt-6 sm:w-auto">Add your first address</button></div>}
      {showForm ? <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-luxe sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{editingId ? 'Edit address' : 'New address'}</p><h2 className="mt-2 font-display text-4xl font-semibold">Delivery details</h2></div><button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="icon-button border border-black/10"><Icon name="close" /></button></div><form onSubmit={formik.handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate><FormField label="Label" name="label" formik={formik} /><FormField label="Phone" name="phone" formik={formik} /><FormField label="First name" name="firstName" formik={formik} /><FormField label="Last name" name="lastName" formik={formik} /><FormField label="Address line 1" name="addressLine1" formik={formik} className="sm:col-span-2" /><FormField label="Address line 2 (optional)" name="addressLine2" formik={formik} className="sm:col-span-2" /><FormField label="Town / city" name="city" formik={formik} /><FormField label="County (optional)" name="county" formik={formik} /><FormField label="Postcode" name="postcode" formik={formik} /><FormField label="Country" name="country" formik={formik} /><label className="sm:col-span-2 flex items-center gap-3 rounded-2xl bg-cream p-4 text-xs font-bold text-black/55"><input type="checkbox" name="isDefault" checked={formik.values.isDefault} onChange={formik.handleChange} className="h-4 w-4 accent-wine-800" /> Use as my default delivery address</label>{formik.status ? <div className="sm:col-span-2"><ApiNotice>{formik.status}</ApiNotice></div> : null}<div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row"><button disabled={formik.isSubmitting} className="button-primary sm:w-auto disabled:opacity-60">{formik.isSubmitting ? 'Saving…' : 'Save address'}</button><button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="button-secondary sm:w-auto">Cancel</button></div></form></section> : null}
    </div></div></div></section>
}
