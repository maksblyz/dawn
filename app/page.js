'use client'

import { useLayoutEffect, useRef } from 'react'
import ContactFooter from './contact-footer'

function FramedPhoto({ src, alt, className = '', width = 2000, height = 1500 }) {
  return <figure className={'framed-photo ' + className}>
    <img className="framed-photo__image" src={src} alt={alt} width={width} height={height} loading="lazy" />
    <img className="framed-photo__border" src="/images/frame1.webp" alt="" aria-hidden="true" width="1320" height="1060" loading="lazy" />
  </figure>
}

export default function Home() {
  const headerRef = useRef(null)
  const slotRef = useRef(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    const slot = slotRef.current
    let frame = 0
    let disposed = false
    let origin = 0
    let fullHeight = 0

    const draw = () => {
      frame = 0
      const scroll = Math.max(0, window.scrollY)
      const travel = Math.max(1, origin - 14)
      const fraction = Math.min(scroll / travel, 1)
      const progress = fraction * fraction * (3 - 2 * fraction)
      const scale = 1 - .5 * progress
      header.style.setProperty('--header-y', Math.max(14, origin - scroll) + 'px')
      header.style.setProperty('--header-height', fullHeight * scale + 'px')
      header.style.setProperty('--logo-scale', scale)
      header.style.setProperty('--quote-scale', 1 - .18 * progress)
      header.style.setProperty('--header-opacity', Math.max(0, (progress - .7) / .3))
    }
    const measure = () => {
      if (disposed) return
      const bounds = slot.getBoundingClientRect()
      origin = bounds.top + window.scrollY
      fullHeight = bounds.height
      header.style.setProperty('--header-left', bounds.left + 'px')
      header.style.setProperty('--header-width', bounds.width + 'px')
      draw()
      header.classList.add('is-ready')
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(draw) }
    const observer = new ResizeObserver(measure)
    observer.observe(slot)
    measure()
    document.fonts.ready.then(measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('pageshow', measure)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pageshow', measure)
    }
  }, [])

  return <main className="canvas" id="top">
      <section className="opening" aria-label="Café Dawn">
        <div className="identity">
          <div className="identity__slot" ref={slotRef}>
          <header className="identity__row" ref={headerRef}>
          <h1 className="identity__logo"><span className="sr-only">Café Dawn</span></h1>
          <a className="contact" href="#contact"><span aria-hidden="true">&gt; </span>Free Quote<span aria-hidden="true"> &lt;</span></a>
          </header>
          </div>
          <p className="opening__sentence"><span>Your favorite coffee,</span><span>for your favorite event</span></p>
        </div>
      </section>
    <section className="owner-story" aria-label="A note from Liana">
      <div className="owner-story__photobooth">
        <img className="photobooth-strip photobooth-strip--first" src="/images/liana-photobooth-1-three.jpg" alt="Photobooth strip of Liana raising a coffee cup, taking a sip, and smiling" width="390" height="1465" loading="lazy" />
        <img className="photobooth-strip photobooth-strip--second" src="/images/liana-photobooth-2-three.jpg" alt="A second photobooth strip of Liana posing with her coffee" width="343" height="1350" loading="lazy" />
      </div>
      <p className="owner-story__note">I’m Liana. I love art and coffee, but most of all, I love people. Café Dawn is my way of bringing those things together. I’d love to be there for the days that mean the most to you.</p>
    </section>
    <section className="fabric" aria-label="Café Dawn catering and gatherings">
      <div className="fabric__cloth" aria-hidden="true" />
      <div className="patchwork">
        <FramedPhoto className="patchwork__coffee" src="/images/nice-coffee.jpg" alt="A latte beside white lace on the wooden Café Dawn counter" />
        <div className="paper-note patchwork__services">
          <h2>Coffee Cart Catering for</h2>
          <ul>
            <li>Events</li>
            <li>Collaborations</li>
            <li>Any and All Occasions</li>
          </ul>
        </div>
      </div>
    </section>
    <section className="cart-story" aria-labelledby="cart-title">
      <div className="story-copy cart-story__copy">
        <h2 id="cart-title">Good coffee brings<br />people together.</h2>
        <p>That’s the idea behind our cart. A familiar ritual, a reason to stop for a moment, and something to share.</p>
        <p>From events to collaborations, we bring the coffee. You bring the company.</p>
        <a href="https://www.instagram.com/cafedawn/" target="_blank" rel="noreferrer">Let’s plan something <span className="up-right" aria-hidden="true">{'\u2197\uFE0E'}</span><span className="sr-only"> on Instagram (opens in a new tab)</span></a>
      </div>
      <FramedPhoto className="cart-story__photo" src="/images/cart.jpg" alt="The wooden Café Dawn coffee cart set up outdoors with a red espresso machine" width={1400} height={933} />
    </section>
    <ContactFooter />
  </main>
}
