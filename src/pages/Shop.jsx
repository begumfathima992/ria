import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icons'
import ApiNotice from '../components/ApiNotice'
import LoadingState from '../components/LoadingState'
import { catalogService, apiMessage } from '../services'
import { adaptProduct } from '../utils/productAdapter'

const schema = Yup.object({ minPrice: Yup.number().min(0, 'Minimum price must be 0 or more.').nullable().transform((v,o) => o === '' ? null : v), maxPrice: Yup.number().min(0, 'Maximum price must be 0 or more.').nullable().transform((v,o) => o === '' ? null : v) })

export default function Shop({ products: fallbackProducts, categories, addToCart, wishlist, toggleWishlist, openQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [result, setResult] = useState({ loading: true, items: [], meta: null, error: '' })
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))
  const initialCategory = searchParams.get('category') || ''
  const categorySlugFromName = useMemo(() => categories.find((category) => category.name === initialCategory)?.slug || initialCategory, [categories, initialCategory])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { search: searchParams.get('search') || '', category: categorySlugFromName || '', subcategory: searchParams.get('subcategory') || '', sort: searchParams.get('sort') || 'newest', minPrice: searchParams.get('minPrice') || '', maxPrice: searchParams.get('maxPrice') || '' },
    validationSchema: schema,
    onSubmit: (values) => {
      setPage(1)
      const params = {}
      Object.entries(values).forEach(([key,value]) => { if (String(value ?? '').trim()) params[key] = String(value).trim() })
      setSearchParams(params)
    }
  })

  const requestKey = searchParams.toString()
  useEffect(() => {
    let active = true
    const params = Object.fromEntries(searchParams.entries())
    params.page = page
    params.limit = 12
    setResult((current) => ({ ...current, loading: true, error: '' }))
    catalogService.getProducts(params).then((data) => { if (active) setResult({ loading: false, items: data.items.map(adaptProduct), meta: data.meta, error: '' }) }).catch((error) => { if (active) setResult({ loading: false, items: fallbackProducts, meta: null, error: apiMessage(error, 'The live catalogue could not be loaded.') }) })
    return () => { active = false }
  }, [requestKey, page])

  const activeCategory = categories.find((category) => category.slug === formik.values.category)
  const subcategories = activeCategory?.subcategories || []
  const clearFilters = () => { formik.resetForm({ values: { search: '', category: '', subcategory: '', sort: 'newest', minPrice: '', maxPrice: '' } }); setPage(1); setSearchParams({}) }

  return <><PageHero eyebrow="The H&H collection" title="Premium hair and beauty, without the noise." copy="Filter our live catalogue by category, subcategory, price or product name." /><section className="section-pad"><div className="page-container">
    <form onSubmit={formik.handleSubmit} className="rounded-[30px] border border-black/[.07] bg-white p-4 shadow-soft sm:p-6" noValidate><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_1fr_1fr_.85fr_.7fr_.7fr_auto]"><label className="form-field"><span>Search</span><div className="relative"><Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" /><input name="search" value={formik.values.search} onChange={formik.handleChange} placeholder="Shampoo, bonnet, lace…" className="pl-11" /></div></label><label className="form-field"><span>Category</span><select name="category" value={formik.values.category} onChange={(event) => { formik.setFieldValue('category',event.target.value); formik.setFieldValue('subcategory','') }}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select></label><label className="form-field"><span>Subcategory</span><select name="subcategory" value={formik.values.subcategory} onChange={formik.handleChange} disabled={!formik.values.category}><option value="">All</option>{subcategories.map((sub) => <option key={sub.id} value={sub.slug}>{sub.name}</option>)}</select></label><label className="form-field"><span>Sort</span><select name="sort" value={formik.values.sort} onChange={formik.handleChange}><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name</option></select></label><label className="form-field"><span>Min £</span><input name="minPrice" type="number" min="0" step="0.01" value={formik.values.minPrice} onChange={formik.handleChange} /></label><label className="form-field"><span>Max £</span><input name="maxPrice" type="number" min="0" step="0.01" value={formik.values.maxPrice} onChange={formik.handleChange} /></label><button type="submit" className="button-primary self-end md:w-auto">Apply</button></div>{(formik.errors.minPrice || formik.errors.maxPrice) ? <p className="mt-3 text-xs font-bold text-wine-700">{formik.errors.minPrice || formik.errors.maxPrice}</p> : null}<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/[.06] pt-4"><button type="button" onClick={clearFilters} className="filter-pill">Clear filters</button>{categories.map((category) => <button key={category.id} type="button" onClick={() => { formik.setFieldValue('category',category.slug); formik.setFieldValue('subcategory',''); setSearchParams({ category: category.slug, sort: formik.values.sort }); setPage(1) }} className={`filter-pill ${formik.values.category === category.slug ? 'filter-pill-active' : ''}`}>{category.name}</button>)}</div></form>
    <div className="mt-7 flex min-w-0 items-end justify-between gap-4"><div><p className="eyebrow">Live catalogue</p><h2 className="mt-2 font-display text-4xl font-semibold">{result.meta?.total ?? result.items.length} products</h2></div>{result.meta ? <span className="text-xs font-bold text-black/40">Page {result.meta.page} of {result.meta.pages}</span> : null}</div>{result.error ? <div className="mt-5"><ApiNotice>{result.error} Demo products are shown as a fallback.</ApiNotice></div> : null}{result.loading ? <LoadingState label="Loading products…" /> : result.items.length ? <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{result.items.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} openQuickView={openQuickView} />)}</div> : <div className="mt-7 rounded-[30px] border border-black/[.07] bg-white p-10 text-center shadow-soft"><Icon name="search" size={32} className="mx-auto text-wine-300" /><h3 className="mt-4 font-display text-4xl font-semibold">No products matched.</h3><button type="button" onClick={clearFilters} className="button-primary mt-6 sm:w-auto">Reset the collection</button></div>}{result.meta?.pages > 1 ? <div className="mt-9 flex items-center justify-center gap-3"><button type="button" className="button-secondary sm:w-auto" disabled={page <= 1} onClick={() => { const next = Math.max(1,page-1); setPage(next); window.scrollTo({top:0,behavior:'smooth'}) }}>Previous</button><span className="px-3 text-xs font-extrabold text-black/45">{page} / {result.meta.pages}</span><button type="button" className="button-secondary sm:w-auto" disabled={page >= result.meta.pages} onClick={() => { setPage(page+1); window.scrollTo({top:0,behavior:'smooth'}) }}>Next</button></div> : null}
  </div></section></>
}
