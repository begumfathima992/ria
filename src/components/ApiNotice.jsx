import React from 'react'
import Icon from './Icons'

export default function ApiNotice({ type = 'error', children, onRetry }) {
  const success = type === 'success'
  return (
    <div className={`flex min-w-0 items-start gap-3 rounded-2xl border px-4 py-3 text-xs font-bold leading-5 ${success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-wine-100 bg-wine-50 text-wine-800'}`} role={success ? 'status' : 'alert'}>
      <Icon name={success ? 'checkCircle' : 'info'} size={17} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {onRetry ? <button type="button" onClick={onRetry} className="shrink-0 underline underline-offset-2">Retry</button> : null}
    </div>
  )
}
