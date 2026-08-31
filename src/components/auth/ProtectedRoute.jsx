import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../Icons'

export default function ProtectedRoute({ children }) {
  const { authReady, isAuthenticated } = useAuth()
  const location = useLocation()
  if (!authReady) {
    return <section className="section-pad"><div className="page-container"><div className="mx-auto flex max-w-md flex-col items-center rounded-[32px] border border-black/[.07] bg-white p-10 text-center shadow-soft"><span className="grid h-14 w-14 animate-pulse place-items-center rounded-full bg-wine-50 text-wine-700"><Icon name="lock" /></span><p className="eyebrow mt-5">Secure account</p><h1 className="mt-2 font-display text-4xl font-semibold">Loading your account…</h1></div></div></section>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  return children
}
