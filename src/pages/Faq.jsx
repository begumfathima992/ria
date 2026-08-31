import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons'
import PageHero from '../components/PageHero'

const questions = [
  ['Where does the product information come from?', 'Categories, products, variants, prices, stock and approved reviews are loaded from the connected H&H ecommerce API. The seeded database contains dummy catalogue content that can be replaced from the backend later.'],
  ['Do you deliver throughout the UK?', 'The checkout supports Standard and Express UK delivery. Delivery fees and the free-delivery threshold come from public backend settings and are revalidated during checkout.'],
  ['Can customers save products to a wishlist?', 'Yes. Signed-in wishlists are stored by the backend. Guests can still save favourites locally, and those favourites are synchronised to their account after sign-in.'],
  ['Does the shopping bag keep products after refresh?', 'Yes. A signed-in customer uses the server-backed cart. A guest cart is stored locally and synchronised into the customer cart after sign-in.'],
  ['Which payment methods are available?', 'Cash on Delivery is the only payment option enabled in this version. No card details are collected by the storefront.'],
  ['Can I track or manage an order?', 'Yes. Customers can view their order history and order details after sign-in, cancel eligible orders, request a return for delivered orders and use the public order-tracking page with their order number and email address.']
]

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <PageHero eyebrow="Customer care" title="Frequently asked questions" copy="Useful answers about your H&H account, delivery, Cash on Delivery, shopping bag and order management." aside={<><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-champagne">Still unsure?</p><p className="mt-3 font-display text-4xl font-semibold leading-none">Our team is ready to help.</p></>} />
      <section className="section-pad">
        <div className="page-container grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:gap-16">
          <div><p className="eyebrow">Answers, clearly presented</p><h2 className="mt-4 font-display text-[clamp(2.9rem,11vw,3.75rem)] font-semibold leading-[.92]">Everything customers usually ask before they order.</h2><p className="mt-6 text-sm leading-7 text-black/60">These answers reflect the connected customer storefront and can be refined further when your final delivery and returns policies are confirmed.</p><Link to="/contact" className="button-primary mt-7">Ask another question <Icon name="arrow" /></Link></div>
          <div className="overflow-hidden rounded-[30px] border border-black/[.07] bg-white shadow-soft">{questions.map(([question, answer], index) => { const active = open === index; return <div key={question} className="border-b border-black/[.07] last:border-0"><button type="button" onClick={() => setOpen(active ? -1 : index)} className="flex w-full min-w-0 items-start justify-between gap-3 p-5 text-left sm:items-center sm:gap-5 sm:p-7"><span className="min-w-0 font-display text-[clamp(1.65rem,7vw,1.875rem)] font-semibold leading-tight">{question}</span><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${active ? 'rotate-45 bg-wine-800 text-white' : 'bg-wine-50 text-wine-700'}`}><Icon name="plus" size={17} /></span></button><div className={`grid transition-all duration-300 ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><div className="overflow-hidden"><p className="px-6 pb-7 text-sm leading-7 text-black/60 sm:px-7">{answer}</p></div></div></div> })}</div>
        </div>
      </section>
    </>
  )
}
