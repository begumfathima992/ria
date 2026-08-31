import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

const deliveryOptions = [
  { title: 'Standard UK delivery', price: '£3.95', timing: '2–4 working days', copy: 'Free when your basket reaches £45.' },
  { title: 'Express UK delivery', price: '£6.95', timing: '1–2 working days', copy: 'Order before the daily cut-off for priority dispatch.' },
  { title: 'Local collection', price: 'Free', timing: 'By appointment', copy: 'A future-ready option for a physical H&H location.' }
]

export default function DeliveryReturns() {
  return (
    <>
      <PageHero eyebrow="Customer care" title="Delivery & returns" copy="Clear timings, simple policies and no surprises at checkout. The information below is demonstration content ready for your final business rules." aside={<><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-champagne">Free delivery</p><p className="mt-3 font-display text-4xl font-semibold leading-none">On UK orders over £45.</p></>} />
      <section className="section-pad">
        <div className="page-container">
          <div className="grid gap-5 lg:grid-cols-3">{deliveryOptions.map((item, index) => <Reveal key={item.title} delay={index * 70} className="h-full"><div className="h-full rounded-[30px] border border-black/[.07] bg-white p-7 shadow-soft"><span className="grid h-12 w-12 place-items-center rounded-full bg-wine-50 text-wine-700"><Icon name={index === 2 ? 'pin' : 'truck'} /></span><h2 className="mt-6 font-display text-4xl font-semibold leading-none">{item.title}</h2><div className="mt-5 flex flex-col gap-2 border-y border-black/[.07] py-4"><strong className="text-lg text-wine-800">{item.price}</strong><span className="text-xs font-extrabold uppercase tracking-[.12em] text-black/40 sm:text-right">{item.timing}</span></div><p className="mt-5 text-sm leading-7 text-black/60">{item.copy}</p></div></Reveal>)}</div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="page-container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <Reveal><p className="eyebrow">Returns made simple</p><h2 className="mt-4 font-display text-[clamp(2.9rem,11vw,3.75rem)] font-semibold leading-[.93]">Changed your mind? Start with three easy steps.</h2><p className="mt-6 text-sm leading-7 text-black/60">For hygiene reasons, some opened hair and cosmetic products may not be eligible for return. Replace this demo policy with your final legal and operational terms before launch.</p><Link to="/contact" className="button-primary mt-7">Contact customer care <Icon name="arrow" /></Link></Reveal>
          <div className="space-y-4">{[['01', 'Contact us', 'Send your order number and reason for return within 14 days of delivery.'], ['02', 'Prepare the parcel', 'Keep eligible products unused, sealed and safely packed in their original condition.'], ['03', 'Receive your outcome', 'Once inspected, an approved refund is returned to the original payment method.']].map(([number, title, copy], index) => <Reveal key={number} delay={index * 70}><div className="flex min-w-0 flex-col gap-3 rounded-[26px] min-[430px]:flex-row min-[430px]:gap-5 border border-black/[.07] bg-cream p-6 sm:p-7"><span className="font-display text-5xl font-semibold text-wine-200">{number}</span><div><h3 className="font-display text-3xl font-semibold leading-none">{title}</h3><p className="mt-3 text-sm leading-7 text-black/60">{copy}</p></div></div></Reveal>)}</div>
        </div>
      </section>
      <section className="section-pad"><div className="page-container"><div className="rounded-[34px] bg-wine-glow p-8 text-white sm:p-12"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-champagne">Important note</p><h2 className="mt-3 max-w-3xl font-display text-[clamp(2.7rem,11vw,3.25rem)] font-semibold leading-[.95]">Delivery dates are estimates until your real courier integration is connected.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">This page is designed and routed, but the current policy content is for demonstration only.</p></div></div></section>
    </>
  )
}
