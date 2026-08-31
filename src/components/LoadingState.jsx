import React from 'react'
import Icon from './Icons'

export default function LoadingState({ label = 'Loading…', compact = false }) {
  return <div className={`flex items-center justify-center gap-3 text-sm font-bold text-black/50 ${compact ? 'py-4' : 'min-h-[260px] py-12'}`}><span className="grid h-9 w-9 animate-pulse place-items-center rounded-full bg-wine-50 text-wine-700"><Icon name="sparkle" size={17} /></span>{label}</div>
}
