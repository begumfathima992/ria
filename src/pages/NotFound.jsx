import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons'

export default function NotFound() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-gradient-to-br from-cream to-[#ead4d6] px-4 py-20 text-center">
      <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full border border-wine-200" />
      <div className="absolute bottom-[-160px] right-[-100px] h-96 w-96 rounded-full bg-wine-200/30 blur-3xl" />
      <div className="relative"><p className="font-display text-[130px] font-semibold leading-none text-wine-200 sm:text-[180px]">404</p><p className="eyebrow">Page not found</p><h1 className="mt-3 font-display text-5xl font-semibold leading-none sm:text-6xl">This page slipped away.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/60">The page you are looking for does not exist or may have moved to another part of the H&H collection.</p><Link to="/" className="button-primary mt-8">Return home <Icon name="arrow" /></Link></div>
    </section>
  )
}
