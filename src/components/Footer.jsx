import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons'
import logo from '../assets/hh-logo.jpeg'
import { useCommerce } from '../context/CommerceContext'

export default function Footer() {
  const { settings } = useCommerce()
  const freeDelivery = Number(settings?.free_delivery_threshold || 45)
  const supportPhone = settings?.support_phone || '+44 20 7946 0123'
  const supportEmail = settings?.support_email || 'hello@hhcosmetics.co.uk'
  return (
    <footer className="border-t border-black/10 bg-[#efe7df]">
      <div className="border-b border-black/10 bg-wine-950 text-white">
        <div className="page-container grid gap-0 sm:grid-cols-3">
          {[{ icon: 'truck', title: 'Complimentary delivery', copy: `On UK orders over £${freeDelivery.toFixed(0)}` }, { icon: 'refresh', title: 'Simple returns', copy: '14-day return window' }, { icon: 'package', title: 'Cash on Delivery', copy: 'Payment collected on delivery' }].map((item) => <div key={item.title} className="flex min-w-0 items-start gap-4 border-b border-white/10 px-2 py-5 last:border-0 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/[.07] text-champagne"><Icon name={item.icon} /></span><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[.12em]">{item.title}</p><p className="mt-1 text-xs text-white/60">{item.copy}</p></div></div>)}
        </div>
      </div>

      <div className="page-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_.68fr_.78fr_.95fr] lg:py-20">
        <div>
          <img src={logo} alt="H&H Hair & Cosmetics" className="h-16 w-auto max-w-[250px] rounded-sm object-contain" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-black/60">An editorial UK hair and beauty destination for considered care, protective styling and polished everyday rituals.</p>
          <div className="mt-6 flex gap-2"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="icon-button bg-white" aria-label="Instagram"><Icon name="instagram" /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="icon-button bg-white" aria-label="Facebook"><Icon name="facebook" /></a></div>
        </div>
        <div><h3 className="footer-title">Shop</h3><div className="footer-links"><Link to="/shop">All products</Link><Link to="/shop?category=hair-care">Hair care</Link><Link to="/shop?category=wigs-hairpieces">Wigs & hairpieces</Link><Link to="/shop?category=extensions">Extensions</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Shopping bag</Link></div></div>
        <div><h3 className="footer-title">Customer care</h3><div className="footer-links"><Link to="/contact">Contact us</Link><Link to="/delivery-returns">Delivery & returns</Link><Link to="/track-order">Track an order</Link><Link to="/faq">FAQs</Link><Link to="/account">My account</Link></div></div>
        <div><h3 className="footer-title">Visit & contact</h3><div className="mt-5 space-y-4 text-sm text-black/60"><p className="flex gap-3"><Icon name="pin" className="mt-0.5 shrink-0 text-wine-700" /> London, United Kingdom</p><p className="flex gap-3"><Icon name="phone" className="shrink-0 text-wine-700" /> {supportPhone}</p><p className="flex min-w-0 gap-3"><Icon name="mail" className="shrink-0 text-wine-700" /><span className="min-w-0 break-all">{supportEmail}</span></p><p className="pt-2 text-xs leading-6 text-black/50">Monday–Friday, 9:00–18:00<br />Saturday, 10:00–16:00</p></div></div>
      </div>
      <div className="border-t border-black/10"><div className="page-container flex min-w-0 flex-col gap-4 py-5 text-[11px] text-black/50 md:flex-row md:items-center md:justify-between"><span>© 2026 H&H Hair & Cosmetics. Premium demo storefront.</span><div className="flex flex-wrap gap-x-5 gap-y-2"><Link to="/privacy" className="hover:text-wine-700">Privacy</Link><Link to="/terms" className="hover:text-wine-700">Terms</Link><Link to="/cookies" className="hover:text-wine-700">Cookies</Link><Link to="/accessibility" className="hover:text-wine-700">Accessibility</Link></div></div></div>
    </footer>
  )
}
