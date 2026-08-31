import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import Icon from '../components/Icons'
import { catalogService, apiMessage } from '../services'
import { adaptProduct, absoluteAssetUrl } from '../utils/productAdapter'

export default function CategoryPage({ addToCart, wishlist, toggleWishlist, openQuickView }) {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, category: null, products: [], error: '' })
  useEffect(() => {
    let active = true
    setState({ loading: true, category: null, products: [], error: '' })
    Promise.all([catalogService.getCategory(slug), catalogService.getProducts({ category: slug, limit: 100, sort: 'newest' })]).then(([category,result]) => { if (active) setState({ loading: false, category, products: result.items.map(adaptProduct), error: '' }) }).catch((error) => { if (active) setState({ loading: false, category: null, products: [], error: apiMessage(error) }) })
    return () => { active = false }
  }, [slug])
  if (state.loading) return <LoadingState label="Loading category…" />
  if (state.error) return <section className="section-pad"><div className="page-container"><ApiNotice>{state.error}</ApiNotice><Link to="/shop" className="button-primary mt-5 sm:w-auto">Back to shop</Link></div></section>
  const category = state.category
  return <><section className="relative isolate overflow-hidden bg-wine-glow py-14 text-white sm:py-20"><div className="page-container grid items-center gap-8 md:grid-cols-[1fr_360px]"><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-champagne">Shop category</p><h1 className="mt-4 font-display text-[clamp(3.5rem,12vw,6rem)] font-semibold leading-[.86]">{category.name}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">{category.description}</p></div><div className="hidden aspect-[16/11] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 md:block"><img src={absoluteAssetUrl(category.imageUrl)} alt="" className="h-full w-full object-cover opacity-90" /></div></div></section><section className="section-pad"><div className="page-container"><div className="flex flex-wrap gap-2">{(category.subcategories || []).map((sub) => <Link key={sub.id} to={`/shop?category=${category.slug}&subcategory=${sub.slug}`} className="filter-pill">{sub.name}</Link>)}</div><div className="mt-8 flex items-end justify-between gap-4"><div><p className="eyebrow">{state.products.length} products</p><h2 className="mt-2 font-display text-4xl font-semibold">The {category.name} edit.</h2></div><Link to="/shop" className="hidden items-center gap-2 text-xs font-extrabold text-wine-700 sm:flex">All categories <Icon name="arrow" size={14} /></Link></div>{state.products.length ? <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{state.products.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} openQuickView={openQuickView} />)}</div> : <div className="mt-7 rounded-[30px] bg-white p-10 text-center shadow-soft">No active products in this category yet.</div>}</div></section></>
}
