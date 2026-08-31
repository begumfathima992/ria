import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icons'
import { useAuth } from '../context/AuthContext'

export default function Wishlist({ products, addToCart, wishlist, toggleWishlist, openQuickView }) {
  const { isAuthenticated } = useAuth()
  const items = products.filter((product) => wishlist.some((id) => Number(id) === Number(product.id)))
  return <section className="section-pad"><div className="page-container"><div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Saved for later</p><h1 className="mt-3 font-display text-[clamp(3.2rem,11vw,5rem)] font-semibold leading-[.9]">Your wishlist.</h1><p className="mt-4 text-sm leading-7 text-black/55">{isAuthenticated ? 'Your favourites are synced to your H&H account.' : 'These favourites are saved on this device. Sign in to sync them with your account.'}</p></div>{!isAuthenticated ? <Link to="/login" state={{ from: '/wishlist' }} className="button-secondary sm:w-auto">Sign in to sync</Link> : null}</div>{items.length ? <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} openQuickView={openQuickView} />)}</div> : <div className="mt-9 rounded-[34px] border border-black/[.07] bg-white p-10 text-center shadow-soft sm:p-14"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-wine-50 text-wine-700"><Icon name="heart" size={28} /></span><h2 className="mt-5 font-display text-4xl font-semibold">No favourites yet.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-black/50">Tap the heart on anything you want to revisit.</p><Link to="/shop" className="button-primary mt-6 sm:w-auto">Discover products</Link></div>}</div></section>
}
