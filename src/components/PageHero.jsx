import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons'
import Reveal from './Reveal'

export default function PageHero({ eyebrow, title, copy, action, aside }) {
  return (
    <section className="page-hero">
      <div className="page-container grid min-w-0 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(250px,330px)] lg:gap-10">
        <Reveal className="max-w-4xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-champagne sm:text-xs">{eyebrow}</p>
          <h1 className="mt-5 max-w-full font-display text-[clamp(3rem,12vw,5.75rem)] font-semibold leading-[.9] tracking-[-0.025em]">{title}</h1>
          {copy && <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">{copy}</p>}
          {action && <Link to={action.to} className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-white transition hover:text-champagne">{action.label}<Icon name="arrow" size={18} /></Link>}
        </Reveal>
        {aside && <Reveal delay={100} className="hidden min-w-0 rounded-[26px] border border-white/20 bg-white/[.07] p-6 backdrop-blur lg:block">{aside}</Reveal>}
      </div>
    </section>
  )
}
