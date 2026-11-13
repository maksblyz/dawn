'use client'

import { useRef, useState } from 'react'

// Add the business email here when it is ready.
const contactEmail = ''
const instagram = 'https://www.instagram.com/cafedawn/'

export default function ContactFooter() {
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')
  const draftRef = useRef(null)
  const resultRef = useRef(null)

  function prepareInquiry(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const text = [
      'Hi Liana,', '',
      String(data.get('details')).trim(), '',
      'Name: ' + String(data.get('name')).trim(),
      'Reply to: ' + String(data.get('email')).trim(),
      'Event date: ' + (data.get('date') || 'Still deciding'),
      'Location: ' + (String(data.get('location')).trim() || 'Still deciding'),
    ].join('\n')
    setDraft(text)
    setStatus('')
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(draft)
      setStatus('Copied. Send your note to @cafedawn on Instagram.')
    } catch {
      draftRef.current?.focus()
      draftRef.current?.select()
      setStatus('Select and copy the note below, then send it to @cafedawn on Instagram.')
    }
  }

  return (
    <footer className="footer" id="contact" aria-labelledby="contact-title">
      <div className="footer__layout">
        <div className="footer__intro">
          <h2 id="contact-title">Let’s get together.</h2>
          <p>A date, a place, an idea.<br />Tell Liana what you have in mind.</p>
        </div>
        <div className="footer__letter">
          <form className="inquiry" onSubmit={prepareInquiry} onChange={() => { setDraft(''); setStatus('') }}>
            <div className="inquiry__pair">
              <label>Your name<input name="name" autoComplete="name" required maxLength={100} /></label>
              <label>Your email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            </div>
            <div className="inquiry__pair">
              <label>When <span>(if you know)</span><input name="date" type="date" /></label>
              <label>Where <span>(if you know)</span><input name="location" maxLength={200} /></label>
            </div>
            <label>A little about the occasion<textarea name="details" rows={4} required maxLength={3000} placeholder="The occasion, how many people, anything you’d like us to know…" /></label>
            <div className="inquiry__action"><button type="submit">Send <span className="up-right" aria-hidden="true">{'\u2197\uFE0E'}</span></button></div>
          </form>
          {draft && <div className="inquiry__result" ref={resultRef} tabIndex={-1} aria-label="Your prepared inquiry">
            <p>Your note is ready. {contactEmail ? 'Open your email app to send it.' : 'Copy it, then send it to @cafedawn.'}</p>
            <textarea ref={draftRef} readOnly value={draft} rows={7} aria-label="Prepared inquiry" />
            <div className="inquiry__delivery">{contactEmail ? <a href={'mailto:' + contactEmail + '?subject=' + encodeURIComponent('Café Dawn event inquiry') + '&body=' + encodeURIComponent(draft)}>Open email <span className="up-right" aria-hidden="true">{'\u2197\uFE0E'}</span></a> : <><button type="button" onClick={copyInquiry}>Copy note</button><a href={instagram} target="_blank" rel="noreferrer">Open Instagram <span className="up-right" aria-hidden="true">{'\u2197\uFE0E'}</span><span className="sr-only"> (opens in a new tab)</span></a></>}</div>
            <p role="status">{status}</p>
          </div>}
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
