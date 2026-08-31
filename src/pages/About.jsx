import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons'
import Reveal from '../components/Reveal'
import Newsletter from '../components/Newsletter'
import PageHero from '../components/PageHero'
import logo from '../assets/hh-logo.jpeg'
import { categories } from '../data/products'

export default function About() {
  return (
    <>
      <PageHero eyebrow="Our story" title="Beauty should feel personal, polished and possible." copy="H&H Hair & Cosmetics is imagined as a modern UK destination where thoughtful curation meets warm, useful guidance." action={{ to: '/shop', label: 'Explore the collection' }} aside={<><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-champagne">Our point of view</p><p className="mt-3 font-display text-3xl font-semibold leading-none">Premium presentation without an intimidating beauty counter.</p></>} />

      <section className="section-pad">
        <div className="page-container grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-18">
          <Reveal className="relative min-h-[430px] overflow-hidden rounded-[30px] sm:min-h-[560px] sm:rounded-[38px] bg-gradient-to-br from-[#efd9d9] to-[#c89ca4] shadow-luxe">
            <img src={categories[0].image} alt="H&H hair-care collection" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-tr from-wine-950/70 via-wine-900/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-white/25 bg-white/85 p-5 backdrop-blur sm:bottom-7 sm:left-10 sm:right-auto sm:max-w-md sm:rounded-[26px] sm:p-6">
              <img src={logo} alt="H&H Hair & Cosmetics" className="h-14 w-auto rounded-sm object-contain" />
              <p className="mt-4 text-sm leading-7 text-black/60">A refined identity rooted in service, confidence and the rituals that help customers feel their best.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">Made for modern routines</p>
            <h2 className="mt-4 font-display text-[clamp(3rem,12vw,4.5rem)] font-semibold leading-[.91]">A calmer, clearer way to shop beauty.</h2>
            <p className="mt-7 text-base leading-8 text-black/60">Our concept brings hair care, protective styling, wigs, extensions, accessories and beauty essentials into one considered destination. Every category is organised to help customers shop by routine, need and finish.</p>
            <p className="mt-5 text-base leading-8 text-black/60">The current products, prices and photography are demonstration content, ready to be replaced with your live catalogue, stock, policies and brand imagery.</p>
            <div className="mt-8 grid gap-4 min-[460px]:grid-cols-2"><div className="rounded-[24px] border border-black/[.07] bg-white p-5"><strong className="font-display text-4xl font-semibold text-wine-800">UK-first</strong><p className="mt-2 text-xs leading-6 text-black/50">Tone, pricing and delivery language designed for British customers.</p></div><div className="rounded-[24px] border border-black/[.07] bg-white p-5"><strong className="font-display text-4xl font-semibold text-wine-800">Routine-led</strong><p className="mt-2 text-xs leading-6 text-black/50">Navigation based on real beauty needs, not confusing product jargon.</p></div></div>
            <Link to="/shop" className="button-primary mt-8">Explore the collection <Icon name="arrow" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="page-container">
          <div className="mx-auto mb-12 max-w-3xl text-center"><p className="eyebrow">What guides H&H</p><h2 className="mt-3 font-display text-[clamp(2.8rem,11vw,3.75rem)] font-semibold leading-none">Considered from first click to final detail.</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {[{ number: '01', title: 'Curated with purpose', copy: 'Clear categories and thoughtful recommendations make browsing feel effortless.' }, { number: '02', title: 'Designed for confidence', copy: 'Editorial presentation meets practical product detail for a premium but approachable experience.' }, { number: '03', title: 'Built for the UK', copy: 'Pound pricing, delivery messaging and a refined British tone create a familiar storefront.' }].map((item, index) => <Reveal key={item.number} delay={index * 80} className="h-full"><div className="group h-full rounded-[30px] border border-black/[.07] bg-cream p-8 transition duration-500 hover:-translate-y-1 hover:shadow-card"><span className="font-display text-6xl font-semibold text-wine-200 transition group-hover:text-wine-300">{item.number}</span><h3 className="mt-6 font-display text-4xl font-semibold leading-none">{item.title}</h3><p className="mt-5 text-sm leading-7 text-black/60">{item.copy}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-container grid overflow-hidden rounded-[30px] bg-wine-glow text-white sm:rounded-[38px] lg:grid-cols-2">
          <Reveal className="relative min-h-[340px] overflow-hidden sm:min-h-[450px]"><img src={categories[1].image} alt="Wigs and hairpieces collection" className="absolute inset-0 h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-wine-950/50" /></Reveal>
          <Reveal delay={100} className="flex flex-col justify-center p-8 sm:p-12 lg:p-16"><p className="text-[10px] font-extrabold uppercase tracking-[.23em] text-champagne">The next chapter</p><h2 className="mt-4 font-display text-[clamp(2.8rem,11vw,3.75rem)] font-semibold leading-[.92]">Ready for your real products, photography and story.</h2><p className="mt-6 text-sm leading-7 text-white/70 sm:text-base">This front-end is structured to connect with an ecommerce API, payment provider and content system when you are ready to move beyond dummy content.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-white">Talk to the team <Icon name="arrow" /></Link></Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
