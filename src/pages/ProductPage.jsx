import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icons'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import FormField from '../components/FormField'
import { apiMessage, catalogService, reviewService } from '../services'
import { adaptProduct } from '../utils/productAdapter'

const reviewSchema = Yup.object({ rating: Yup.number().min(1).max(5).required(), title: Yup.string().trim().max(120), comment: Yup.string().trim().min(3, 'Please add a little more detail.').max(3000).required('Review text is required.') })

export default function ProductPage({ products, addToCart, wishlist, toggleWishlist, openQuickView, currentUser }) {
  const { slug } = useParams()
  const fallback = products.find((item) => item.slug === slug || String(item.id) === String(slug)) || null
  const [product, setProduct] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewMeta, setReviewMeta] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [variantId, setVariantId] = useState(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [reviewMessage, setReviewMessage] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [myReview, setMyReview] = useState(null)

  const loadReviews = async (key = slug) => {
    try {
      const result = await catalogService.getProductReviews(key, { page: 1, limit: 20 })
      setReviews(result.items)
      setReviewMeta(result.meta)
      const approvedOwn = result.items.find((review) => Number(review.userId || review.user?.id) === Number(currentUser?.id))
      if (approvedOwn) setMyReview(approvedOwn)
    } catch { setReviews([]) }
  }

  useEffect(() => {
    let active = true
    setLoading(true); setError(''); setQuantity(1); setGalleryIndex(0); setEditingReview(null); setMyReview(null); setReviewMessage(null)
    catalogService.getProduct(slug).then((data) => {
      if (!active) return
      const adapted = adaptProduct(data)
      setProduct(adapted)
      setVariantId(adapted.defaultVariant?.id || null)
      return loadReviews(data.slug || data.id)
    }).catch((err) => { if (active) { setError(apiMessage(err)); if (fallback) { setProduct(fallback); setVariantId(fallback.defaultVariant?.id || null) } } }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  const selectedVariant = useMemo(() => product?.variants?.find((variant) => Number(variant.id) === Number(variantId)) || product?.defaultVariant || null, [product, variantId])
  const selectedPrice = Number(selectedVariant?.price ?? product?.price ?? 0)
  const selectedOldPrice = selectedVariant?.compareAtPrice ?? product?.oldPrice
  const maxStock = Number(selectedVariant?.stock ?? product?.stock ?? 99)
  const wished = product ? wishlist.some((id) => Number(id) === Number(product.id)) : false
  const related = useMemo(() => products.filter((item) => item.categorySlug === product?.categorySlug && item.id !== product?.id).slice(0, 4), [products, product])
  const ownReview = myReview || reviews.find((review) => Number(review.userId || review.user?.id) === Number(currentUser?.id)) || null

  const reviewFormik = useFormik({
    enableReinitialize: true,
    initialValues: editingReview ? { rating: editingReview.rating, title: editingReview.title || '', comment: editingReview.comment || '' } : { rating: 5, title: '', comment: '' },
    validationSchema: reviewSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null)
      try {
        const savedReview = editingReview
          ? await reviewService.update(editingReview.id, { rating: Number(values.rating), title: values.title.trim() || null, comment: values.comment.trim() })
          : await reviewService.create(product.id, { rating: Number(values.rating), title: values.title.trim() || null, comment: values.comment.trim() })
        setMyReview(savedReview)
        setReviewMessage({ success: true, message: editingReview ? 'Review updated and sent back for moderation.' : 'Review submitted for moderation.' })
        setEditingReview(null); helpers.resetForm(); await loadReviews(product.slug)
      } catch (err) { helpers.setStatus(apiMessage(err)) }
    }
  })

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try { await reviewService.remove(id); setMyReview(null); setEditingReview(null); setReviewMessage({ success: true, message: 'Your review has been deleted.' }); await loadReviews(product.slug) }
    catch (err) { setReviewMessage({ success: false, message: apiMessage(err) }) }
  }

  if (loading && !product) return <LoadingState label="Loading product…" />
  if (!product) return <section className="section-pad"><div className="page-container"><ApiNotice>{error || 'We could not find that product.'}</ApiNotice><Link to="/shop" className="button-primary mt-6 sm:w-auto">Back to shop</Link></div></section>
  const gallery = product.images?.length ? product.images : [{ src: product.image }]

  return <>
    <section className="page-container flex min-w-0 flex-wrap items-center gap-y-1 py-5 text-[11px] font-semibold text-black/50"><Link to="/">Home</Link><span className="px-2">/</span><Link to="/shop">Shop</Link><span className="px-2">/</span><span>{product.name}</span></section>
    {error ? <div className="page-container pb-4"><ApiNotice>{error} Showing the cached product while the live endpoint is unavailable.</ApiNotice></div> : null}
    <section className="page-container grid min-w-0 gap-10 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,.94fr)] lg:gap-16">
      <div className="grid gap-4 sm:grid-cols-[86px_1fr]"><div className="order-2 flex gap-3 overflow-x-auto no-scrollbar sm:order-1 sm:flex-col">{gallery.map((image, index) => <button key={image.id || index} type="button" onClick={() => setGalleryIndex(index)} className={`grid aspect-square w-20 shrink-0 place-items-center overflow-hidden rounded-[18px] border bg-gradient-to-br from-[#f9f2ed] to-[#e4d2d1] p-2 transition sm:w-full ${galleryIndex === index ? 'border-wine-700 shadow-soft' : 'border-black/[.07] opacity-75'}`}><img src={image.src} alt="" className="h-[82%] w-[82%] object-contain" /></button>)}</div><div className="relative order-1 grid min-h-[390px] place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f9f2ed] to-[#e4d2d1] p-6 shadow-soft sm:order-2 sm:min-h-[520px] sm:rounded-[38px] lg:min-h-[670px]"><div className="absolute inset-[10%] rounded-full border border-white/50" /><img src={gallery[Math.min(galleryIndex, gallery.length - 1)]?.src || product.image} alt={product.name} className="relative h-[72%] w-[72%] object-contain drop-shadow-[0_42px_30px_rgba(45,20,25,.24)]" /></div></div>
      <div className="flex min-w-0 flex-col justify-center"><p className="eyebrow">{product.category}</p><h1 className="mt-4 font-display text-[clamp(3rem,12vw,4.5rem)] font-semibold leading-[.91]">{product.name}</h1><div className="mt-5 flex flex-wrap items-center gap-3"><span className="flex items-center gap-1 text-champagne"><Icon name="star" size={17} filled /><strong className="text-ink">{Number(product.rating || 0).toFixed(1)}</strong></span><span className="text-sm text-black/50">{product.reviews} reviews</span>{maxStock > 0 ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700">In stock</span> : <span className="rounded-full bg-wine-50 px-3 py-1 text-[10px] font-extrabold text-wine-700">Out of stock</span>}</div><p className="mt-7 text-base leading-8 text-black/60">{product.description}</p>
        {product.variants?.length ? <div className="mt-7"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-black/45">Choose option</p><div className="mt-3 flex flex-wrap gap-2">{product.variants.map((variant) => <button key={variant.id} type="button" onClick={() => { setVariantId(variant.id); setQuantity(1) }} className={`rounded-full border px-4 py-2.5 text-xs font-extrabold transition ${Number(variantId || product.defaultVariant?.id) === Number(variant.id) ? 'border-wine-800 bg-wine-800 text-white' : 'border-black/10 bg-white text-black/60 hover:border-wine-300'}`}>{variant.name} · £{Number(variant.price).toFixed(2)}</button>)}</div></div> : null}
        <div className="mt-7 flex items-baseline gap-3"><span className="font-display text-5xl font-semibold">£{selectedPrice.toFixed(2)}</span>{selectedOldPrice ? <span className="text-lg text-black/40 line-through">£{Number(selectedOldPrice).toFixed(2)}</span> : null}</div><p className="mt-2 text-xs text-black/50">VAT included. Delivery calculated by the backend at checkout.</p>
        <div className="mt-8 grid min-w-0 gap-3 min-[430px]:grid-cols-[auto_minmax(0,1fr)_auto]"><div className="flex items-center justify-center rounded-full border border-black/20 bg-white px-2"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-12 w-10 place-items-center"><Icon name="minus" size={16} /></button><span className="w-9 text-center font-bold">{quantity}</span><button type="button" disabled={maxStock > 0 && quantity >= maxStock} onClick={() => setQuantity(quantity + 1)} className="grid h-12 w-10 place-items-center disabled:opacity-30"><Icon name="plus" size={16} /></button></div><button type="button" disabled={maxStock <= 0} onClick={() => addToCart(product, quantity, selectedVariant?.id || null)} className="button-primary flex-1 disabled:opacity-50">Add to bag <Icon name="bag" size={18} /></button><button type="button" onClick={() => toggleWishlist(product.id)} className={`grid h-12 w-full place-items-center rounded-full border min-[430px]:w-12 ${wished ? 'border-wine-700 bg-wine-50 text-wine-700' : 'border-black/20 bg-white'}`}><Icon name="heart" filled={wished} /></button></div>
        <div className="mt-9 border-t border-black/10 pt-6"><div className="grid gap-4 sm:grid-cols-2"><InfoBlock title="Ingredients" text={product.ingredients || 'Ingredient information will be maintained in the product catalogue.'} /><InfoBlock title="How to use" text={product.usageNotes || 'Use as directed on the product label.'} /></div></div>
      </div>
    </section>

    <section className="section-pad border-y border-black/[.07] bg-white"><div className="page-container grid gap-8 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Customer reviews</p><h2 className="mt-3 font-display text-[clamp(3rem,10vw,4.2rem)] font-semibold leading-[.9]">Real routines, moderated with care.</h2><p className="mt-5 text-sm leading-7 text-black/55">Approved reviews are public. New and edited reviews are sent to moderation by the backend.</p>{currentUser ? <div className="mt-7 rounded-[26px] bg-cream p-5"><h3 className="font-display text-3xl font-semibold">{editingReview ? 'Edit your review' : ownReview ? 'Your review' : 'Write a review'}</h3>{ownReview?.status === 'PENDING' ? <p className="mt-2 text-xs font-bold text-amber-700">Pending moderation · you can still edit or delete it.</p> : null}{ownReview && !editingReview ? <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setEditingReview(ownReview)} className="button-secondary min-h-10 px-4 py-2 text-xs sm:w-auto"><Icon name="edit" size={14} /> Edit review</button><button type="button" onClick={() => deleteReview(ownReview.id)} className="button-secondary min-h-10 px-4 py-2 text-xs text-wine-700 sm:w-auto"><Icon name="trash" size={14} /> Delete</button></div> : !ownReview || editingReview ? <form onSubmit={reviewFormik.handleSubmit} className="mt-5 space-y-4" noValidate><label className="form-field"><span>Rating</span><select name="rating" value={reviewFormik.values.rating} onChange={reviewFormik.handleChange} onBlur={reviewFormik.handleBlur}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} star{value === 1 ? '' : 's'}</option>)}</select></label><FormField label="Review title (optional)" name="title" formik={reviewFormik} /><FormField label="Your review" name="comment" as="textarea" rows="5" formik={reviewFormik} />{reviewFormik.status ? <ApiNotice>{reviewFormik.status}</ApiNotice> : null}<div className="flex flex-col gap-2 sm:flex-row"><button disabled={reviewFormik.isSubmitting} className="button-primary sm:w-auto">{reviewFormik.isSubmitting ? 'Submitting…' : editingReview ? 'Update review' : 'Submit review'}</button>{editingReview ? <button type="button" onClick={() => setEditingReview(null)} className="button-secondary sm:w-auto">Cancel</button> : null}</div></form> : null}{reviewMessage ? <div className="mt-4"><ApiNotice type={reviewMessage.success ? 'success' : 'error'}>{reviewMessage.message}</ApiNotice></div> : null}</div> : <Link to="/login" state={{ from: `/product/${product.slug}` }} className="button-secondary mt-7 sm:w-auto">Sign in to review</Link>}</div>
      <div>{reviews.length ? <div className="space-y-4">{reviews.map((review) => <article key={review.id} className="rounded-[26px] border border-black/[.07] bg-cream p-5 sm:p-6"><div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex gap-1 text-champagne">{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} filled={i < Number(review.rating)} className={i < Number(review.rating) ? '' : 'text-black/15'} />)}</div><h3 className="mt-3 font-display text-2xl font-semibold">{review.title || 'H&H customer review'}</h3></div><div className="text-left sm:text-right"><p className="text-xs font-extrabold">{review.user?.firstName} {review.user?.lastName}</p>{review.isVerifiedPurchase ? <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[.12em] text-emerald-700">Verified purchase</p> : null}</div></div><p className="mt-4 text-sm leading-7 text-black/60">{review.comment}</p><p className="mt-3 text-[10px] text-black/35">{new Date(review.createdAt).toLocaleDateString('en-GB')}</p></article>)}</div> : <div className="rounded-[28px] border border-black/[.07] bg-cream p-8 text-center"><Icon name="star" size={30} className="mx-auto text-champagne" /><h3 className="mt-4 font-display text-3xl font-semibold">No approved reviews yet.</h3><p className="mt-3 text-sm text-black/50">Be the first to submit one.</p></div>}{reviewMeta?.total ? <p className="mt-4 text-right text-[10px] font-bold text-black/35">Showing {reviews.length} of {reviewMeta.total} approved reviews</p> : null}</div></div></section>
    {related.length ? <section className="section-pad bg-white"><div className="page-container"><SectionHeading eyebrow="Complete your ritual" title="You may also love" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} openQuickView={openQuickView} />)}</div></div></section> : null}
  </>
}

function InfoBlock({ title, text }) { return <div className="rounded-[22px] bg-cream p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-wine-700">{title}</p><p className="mt-3 text-sm leading-7 text-black/60">{text}</p></div> }
