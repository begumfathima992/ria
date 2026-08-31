import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons'

export default function SectionHeading({ eyebrow, title, copy, link, align = 'left' }) {
  const centred = align === 'center'
  return (
    <div className={`mb-9 flex min-w-0 flex-col gap-6 md:mb-12 ${centred ? 'mx-auto max-w-4xl items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 max-w-full font-display text-[clamp(2.65rem,9vw,3.75rem)] font-semibold leading-[.94] tracking-[-.015em] text-ink">{title}</h2>
        {copy && <p className={`mt-5 max-w-2xl text-sm leading-7 text-black/60 sm:text-base ${centred ? 'mx-auto' : ''}`}>{copy}</p>}
      </div>
      {link && !centred && <Link to={link.to} className="group hidden shrink-0 items-center gap-2 text-sm font-extrabold text-wine-800 md:flex">{link.label}<Icon name="arrow" className="transition-transform group-hover:translate-x-1" /></Link>}
    </div>
  )
}
