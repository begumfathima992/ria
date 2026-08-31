import React from 'react'
import { NavLink } from 'react-router-dom'
import Icon from './Icons'

const links = [
  { to: '/account', label: 'Overview', icon: 'user', end: true },
  { to: '/account/orders', label: 'Orders', icon: 'orders' },
  { to: '/account/addresses', label: 'Addresses', icon: 'location' },
  { to: '/wishlist', label: 'Wishlist', icon: 'heart' }
]

export default function AccountNav({ onLogout }) {
  return (
    <aside className="rounded-[28px] border border-black/[.07] bg-white p-3 shadow-soft lg:sticky lg:top-[118px]">
      <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1" aria-label="Account navigation">
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-extrabold transition ${isActive ? 'bg-wine-800 text-white shadow-soft' : 'text-black/60 hover:bg-cream hover:text-wine-800'}`}>
            <Icon name={item.icon} size={18} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
        <button type="button" onClick={onLogout} className="flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-extrabold text-black/60 transition hover:bg-wine-50 hover:text-wine-800">
          <Icon name="logout" size={18} className="shrink-0" /> Sign out
        </button>
      </nav>
    </aside>
  )
}
