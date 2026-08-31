import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icons'
import FormField from '../components/FormField'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import { useAuth } from '../context/AuthContext'
import { useCommerce } from '../context/CommerceContext'
import { apiMessage, orderService, userService } from '../services'

const requiredIfNew = (label, max = 191) => Yup.string().when('addressMode', { is: 'new', then: (schema) => schema.trim().max(max).required(`${label} is required.`), otherwise: (schema) => schema.notRequired() })
const schema = Yup.object({
  addressMode: Yup.string().oneOf(['saved','new']).required(),
  addressId: Yup.string().when('addressMode', { is: 'saved', then: (s) => s.required('Choose a saved address.'), otherwise: (s) => s.notRequired() }),
  firstName: requiredIfNew('First name', 80), lastName: requiredIfNew('Last name', 80), phone: requiredIfNew('Phone number', 30),
  addressLine1: requiredIfNew('Address line 1'), addressLine2: Yup.string().max(191), city: requiredIfNew('Town / city',100), county: Yup.string().max(100), postcode: requiredIfNew('Postcode',20), country: requiredIfNew('Country',80),
  shippingMethod: Yup.string().oneOf(['STANDARD','EXPRESS']).required(), couponCode: Yup.string().trim().max(50), customerNote: Yup.string().trim().max(1000)
})
const money = (value) => `£${Number(value || 0).toFixed(2)}`

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, cartTotals, coupon, quoteCart, refreshCart, settings, commerceBusy } = useCommerce()
  const [addresses, setAddresses] = useState([])
  const [addressLoading, setAddressLoading] = useState(true)
  const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState('')

  useEffect(() => { userService.getAddresses().then(setAddresses).catch(() => setAddresses([])).finally(() => setAddressLoading(false)) }, [])

  const defaultAddress = useMemo(() => addresses.find((item) => item.isDefault) || addresses[0] || null, [addresses])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { addressMode: addresses.length ? 'saved' : 'new', addressId: defaultAddress ? String(defaultAddress.id) : '', firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '', addressLine1: '', addressLine2: '', city: '', county: '', postcode: '', country: 'United Kingdom', shippingMethod: 'STANDARD', couponCode: coupon?.code || '', customerNote: '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        const currentQuote = await quoteCart({ couponCode: values.couponCode.trim().toUpperCase(), shippingMethod: values.shippingMethod })
        setQuote(currentQuote)
        const payload = {
          shippingMethod: values.shippingMethod,
          paymentMethod: 'COD',
          couponCode: values.couponCode.trim().toUpperCase() || null,
          customerNote: values.customerNote.trim() || null,
          ...(values.addressMode === 'saved'
            ? { addressId: Number(values.addressId) }
            : { shippingAddress: { firstName: values.firstName.trim(), lastName: values.lastName.trim(), phone: values.phone.trim(), addressLine1: values.addressLine1.trim(), addressLine2: values.addressLine2.trim() || null, city: values.city.trim(), county: values.county.trim() || null, postcode: values.postcode.trim(), country: values.country.trim() } })
        }
        const order = await orderService.create(payload)
        await refreshCart().catch(() => {})
        navigate(`/order-success/${order.id}`, { replace: true, state: { order } })
      } catch (error) { helpers.setStatus(apiMessage(error, 'Could not place your order.')) }
    }
  })

  useEffect(() => {
    if (!cart.length) return
    let active = true
    setQuoteError('')
    const timer = setTimeout(() => {
      quoteCart({ couponCode: formik.values.couponCode.trim().toUpperCase(), shippingMethod: formik.values.shippingMethod })
        .then((data) => { if (active) setQuote(data) })
        .catch((error) => { if (active) setQuoteError(apiMessage(error)) })
    }, 250)
    return () => { active = false; clearTimeout(timer) }
  }, [formik.values.shippingMethod, formik.values.couponCode])

  const totals = quote?.totals || cartTotals
  if (commerceBusy) return <LoadingState label="Syncing your bag with your account…" />
  if (!cart.length) return <section className="section-pad"><div className="page-container"><div className="mx-auto max-w-2xl rounded-[32px] border border-black/[.07] bg-white p-8 text-center shadow-soft"><Icon name="bag" size={32} className="mx-auto text-wine-300" /><h1 className="mt-4 font-display text-4xl font-semibold">Your bag is empty.</h1><Link to="/shop" className="button-primary mt-6 sm:w-auto">Return to shop</Link></div></div></section>

  return <section className="section-pad"><div className="page-container"><div className="mb-8"><p className="eyebrow">Secure checkout</p><h1 className="mt-3 font-display text-[clamp(3rem,11vw,5rem)] font-semibold leading-[.9]">Delivery, then it’s yours.</h1><p className="mt-4 text-sm leading-7 text-black/55">Payment method: <strong>Cash on Delivery</strong>. Prices and stock are revalidated by the backend before the order is created.</p></div><form onSubmit={formik.handleSubmit} className="grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]" noValidate><div className="min-w-0 space-y-6">
    <section className="checkout-card"><div className="checkout-card-title"><span>1</span><div><p className="eyebrow">Delivery address</p><h2>Where should we send it?</h2></div></div>{addressLoading ? <LoadingState compact label="Loading addresses…" /> : addresses.length ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{addresses.map((address) => <label key={address.id} className={`checkout-option ${formik.values.addressMode === 'saved' && String(formik.values.addressId) === String(address.id) ? 'checkout-option-active' : ''}`}><div className="flex min-w-0 gap-3"><input type="radio" name="addressId" value={String(address.id)} checked={formik.values.addressMode === 'saved' && String(formik.values.addressId) === String(address.id)} onChange={() => { formik.setFieldValue('addressMode','saved'); formik.setFieldValue('addressId',String(address.id)) }} className="mt-1 accent-wine-800" /><div><strong>{address.label}{address.isDefault ? ' · Default' : ''}</strong><small>{address.addressLine1}, {address.city}, {address.postcode}</small></div></div></label>)}</div> : null}<label className={`checkout-option mt-3 ${formik.values.addressMode === 'new' ? 'checkout-option-active' : ''}`}><div className="flex gap-3"><input type="radio" checked={formik.values.addressMode === 'new'} onChange={() => formik.setFieldValue('addressMode','new')} className="mt-1 accent-wine-800" /><div><strong>Use a different address</strong><small>Enter delivery details for this order.</small></div></div></label>{formik.values.addressMode === 'new' ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><FormField label="First name" name="firstName" formik={formik} /><FormField label="Last name" name="lastName" formik={formik} /><FormField label="Phone" name="phone" formik={formik} className="sm:col-span-2" /><FormField label="Address line 1" name="addressLine1" formik={formik} className="sm:col-span-2" /><FormField label="Address line 2 (optional)" name="addressLine2" formik={formik} className="sm:col-span-2" /><FormField label="Town / city" name="city" formik={formik} /><FormField label="County (optional)" name="county" formik={formik} /><FormField label="Postcode" name="postcode" formik={formik} /><FormField label="Country" name="country" formik={formik} /></div> : null}</section>
    <section className="checkout-card"><div className="checkout-card-title"><span>2</span><div><p className="eyebrow">Delivery speed</p><h2>Choose your service.</h2></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[['STANDARD','Standard UK delivery',`Free over ${money(settings.free_delivery_threshold || 45)}, otherwise ${money(settings.standard_delivery_fee || 4.95)}`],['EXPRESS','Express UK delivery',money(settings.express_delivery_fee || 7.95)]].map(([value,title,copy]) => <label key={value} className={`checkout-option ${formik.values.shippingMethod === value ? 'checkout-option-active' : ''}`}><div className="flex gap-3"><input type="radio" name="shippingMethod" value={value} checked={formik.values.shippingMethod === value} onChange={formik.handleChange} className="mt-1 accent-wine-800" /><div><strong>{title}</strong><small>{copy}</small></div></div><Icon name="truck" size={18} /></label>)}</div></section>
    <section className="checkout-card"><div className="checkout-card-title"><span>3</span><div><p className="eyebrow">Payment</p><h2>Cash on Delivery.</h2></div></div><div className="mt-6 rounded-[22px] border border-wine-200 bg-wine-50 p-5"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-wine-700"><Icon name="package" /></span><div><p className="font-extrabold text-wine-900">Pay when your order arrives</p><p className="mt-2 text-xs leading-6 text-black/55">No card information is collected by this checkout. The backend currently accepts only <code className="font-bold text-wine-700">COD</code>.</p></div></div></div><div className="mt-5 grid gap-4"><FormField label="Offer code (optional)" name="couponCode" formik={formik} placeholder="HH10" /><FormField label="Order note (optional)" name="customerNote" as="textarea" rows="4" formik={formik} placeholder="Delivery note, access details or helpful instructions…" /></div>{quoteError ? <div className="mt-4"><ApiNotice>{quoteError}</ApiNotice></div> : null}{formik.status ? <div className="mt-4"><ApiNotice>{formik.status}</ApiNotice></div> : null}</section>
  </div><aside className="h-fit rounded-[30px] border border-black/[.07] bg-white p-5 shadow-luxe sm:p-7 lg:sticky lg:top-[118px]"><p className="eyebrow">Order review</p><h2 className="mt-2 font-display text-4xl font-semibold">{cart.length} product line{cart.length === 1 ? '' : 's'}.</h2><div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">{cart.map((item) => <div key={item.id} className="grid grid-cols-[58px_minmax(0,1fr)_auto] gap-3 rounded-2xl bg-cream p-3"><img src={item.image} alt="" className="h-14 w-14 rounded-xl bg-white object-contain" /><div className="min-w-0"><p className="text-xs font-extrabold leading-5">{item.name}</p><p className="mt-1 text-[10px] text-black/45">Qty {item.quantity}{item.variantName ? ` · ${item.variantName}` : ''}</p></div><strong className="text-xs">{money(item.price * item.quantity)}</strong></div>)}</div>{totals ? <div className="mt-6 space-y-3 border-t border-black/[.08] pt-5 text-sm">{[['Subtotal',totals.subtotal],['Discount',-Number(totals.discountAmount || 0)],['Delivery',totals.shippingAmount],['COD fee',totals.codFee]].map(([label,value]) => <div key={label} className="flex justify-between gap-4"><span className="text-black/50">{label}</span><strong>{Number(value) < 0 ? '-' : ''}{money(Math.abs(Number(value || 0)))}</strong></div>)}<div className="flex items-end justify-between gap-4 border-t border-black/10 pt-4"><span className="font-extrabold">Total</span><strong className="font-display text-4xl">{money(totals.totalAmount)}</strong></div></div> : <LoadingState compact label="Calculating total…" />}<button type="submit" disabled={formik.isSubmitting || !totals} className="button-primary mt-6 w-full disabled:opacity-60">{formik.isSubmitting ? 'Placing order…' : 'Place COD order'} <Icon name="arrow" size={16} /></button><p className="mt-3 text-center text-[10px] font-bold leading-5 text-black/40">By placing the order you agree to our terms and delivery policy.</p></aside></form></div></section>
}
