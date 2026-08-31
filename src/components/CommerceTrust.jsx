import React from 'react'
import Icon from './Icons'

const items = [
  { icon: 'shield', title: 'Secure checkout', copy: 'Protected checkout experience' },
  { icon: 'truck', title: 'UK delivery', copy: 'Free standard delivery over £45' },
  { icon: 'refresh', title: 'Easy returns', copy: '14-day return window' }
]

export default function CommerceTrust({ compact = false }) {
  return (
    <div className={`grid overflow-hidden rounded-[24px] border border-black/[.07] bg-white ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-3'} shadow-soft`}>
      {items.map((item) => (
        <div key={item.title} className="flex min-w-0 items-start gap-3 border-b border-black/[.07] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-wine-50 text-wine-700"><Icon name={item.icon} size={18} /></span>
          <div className="min-w-0"><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-ink">{item.title}</p><p className="mt-1 text-[11px] leading-5 text-black/50">{item.copy}</p></div>
        </div>
      ))}
    </div>
  )
}
