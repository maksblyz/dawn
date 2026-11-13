'use client'

import { useState } from 'react'

const contactEmail = 'contact@seeyouatdawn.com'
const instagram = 'https://www.instagram.com/cafedawn/'

export default function ContactFooter() {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [missing, setMissing] = useState('')

  function miss(form, field, message) {
    setMissing(field)
    setStatus(message)
    requestAnimationFrame(() => form.elements[field]?.focus())
  }

  async function sendInquiry(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const details = String(data.get('details') || '').trim()
    if (!name) return miss(form, 'name', 'Add your name.')
    if (!email) return miss(form, 'email', 'Add your email.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return miss(form, 'email', 'That email does not look right.')
    if (!details) return miss(form, 'details', 'Tell us a little about the occasion.')
    setMissing('')
    setSending(true)
    setStatus('Sending…')
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          date: data.get('date'),
          location: data.get('location'),
          details: data.get('details'),
          company: data.get('company'),
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setStatus(result.error || 'The note could not be sent. Please try again.')
        return
      }
      form.reset()
      setMissing('')
      setStatus('Sent. Liana will reply to the email you entered.')
    } catch {
      setStatus('The note could not be sent. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <footer className="footer" id="contact" aria-labelledby="contact-title">
      <div className="footer__layout">
        <div className="footer__intro">
          <h2 id="contact-title">Let’s get together.</h2>
          <p>A date, a place, an idea.</p>
        </div>
        <div className="footer__letter">
          <form className="inquiry" noValidate onSubmit={sendInquiry} onInput={() => { setMissing(''); setStatus('') }}>
            <div className="inquiry__trap" aria-hidden="true">
              <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <div className="inquiry__pair">
              <label>Your name<input name="name" autoComplete="name" maxLength={100} aria-invalid={missing === 'name'} className={missing === 'name' ? 'is-missing' : undefined} /></label>
              <label>Your email<input name="email" type="email" autoComplete="email" maxLength={254} aria-invalid={missing === 'email'} className={missing === 'email' ? 'is-missing' : undefined} /></label>
            </div>
            <div className="inquiry__pair">
              <label>When <span>(if you know)</span><input name="date" type="date" /></label>
              <label>Where <span>(if you know)</span><input name="location" maxLength={200} /></label>
            </div>
            <label>A little about the occasion<textarea name="details" rows={4} maxLength={3000} placeholder="The occasion, how many people, anything you’d like us to know…" aria-invalid={missing === 'details'} className={missing === 'details' ? 'is-missing' : undefined} /></label>
            <div className="inquiry__action">
              <button type="submit" disabled={sending}>Send <span className="up-right" aria-hidden="true">{'\u2197\uFE0E'}</span></button>
            </div>
            <p className="inquiry__status" role="status">{status}</p>
          </form>
        </div>
      </div>
      <div className="footer__bottom">
          <address className="footer__links">
            <div><a href={instagram} target="_blank" rel="noreferrer">@cafedawn <span className="up-right" aria-hidden="true">{'\u2197\uFE0E'}</span><span className="sr-only"> (opens in a new tab)</span></a></div>
            <div>{contactEmail ? <a href={'mailto:' + contactEmail}>{contactEmail}</a> : <span className="footer__soon" aria-label="Email coming soon">Coming soon</span>}</div>
          </address>
        <p className="footer__phrase">Your favorite coffee, for your favorite event</p>
      </div>
    </footer>
  )
}
