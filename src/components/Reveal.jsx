import React from 'react'
/**
 * Safe reveal wrapper.
 *
 * The previous IntersectionObserver version started every block at opacity: 0.
 * During client-side route changes an observer could initialise after the user was
 * still at the previous scroll position, leaving the new route visually blank.
 * This animation is CSS-only, always completes to a visible state and cannot get
 * stuck hidden.
 */
export default function Reveal({ children, className = '', delay = 0 }) {
  return (
    <div
      style={{ animationDelay: `${Math.max(0, delay)}ms` }}
      className={`${className} min-w-0 animate-safe-reveal`}
    >
      {children}
    </div>
  )
}
