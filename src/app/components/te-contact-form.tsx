"use client"

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMPTY = { name: '', email: '', message: '', company: '' }

/**
 * Contact form for the homepage §05, styled to the terminal-editorial system
 * rather than the shadcn/Tailwind look of the older form components.
 *
 * `company` is a honeypot — hidden from sighted users and from the tab order,
 * and rejected server-side if it arrives filled.
 */
export default function TeContactForm() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof EMPTY) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please email me directly.')
        setStatus('error')
        return
      }

      setForm(EMPTY)
      setStatus('sent')
    } catch {
      setError('Network error. Please email me directly.')
      setStatus('error')
    }
  }

  return (
    <form className="ct-form" onSubmit={handleSubmit} data-rise>
      <div className="ct-form-head">
        <span className="ct-lab">[ or send a message ]</span>
        <span className="ct-note mono">replies within ~24h</span>
      </div>

      <div className="ct-form-grid">
        <div className="ct-field">
          <label className="ct-flab mono" htmlFor="ct-name">name</label>
          <input
            id="ct-name"
            className="ct-input"
            type="text"
            value={form.name}
            onChange={set('name')}
            required
            maxLength={100}
            autoComplete="name"
            disabled={status === 'sending'}
          />
        </div>

        <div className="ct-field">
          <label className="ct-flab mono" htmlFor="ct-email">email</label>
          <input
            id="ct-email"
            className="ct-input"
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            maxLength={254}
            autoComplete="email"
            disabled={status === 'sending'}
          />
        </div>
      </div>

      <div className="ct-field">
        <label className="ct-flab mono" htmlFor="ct-message">message</label>
        <textarea
          id="ct-message"
          className="ct-input ct-textarea"
          rows={5}
          value={form.message}
          onChange={set('message')}
          required
          maxLength={5000}
          disabled={status === 'sending'}
        />
      </div>

      {/* Honeypot — off-screen and out of the tab order. */}
      <div className="ct-hp" aria-hidden="true">
        <label htmlFor="ct-company">Company</label>
        <input
          id="ct-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={set('company')}
        />
      </div>

      <div className="ct-form-foot">
        <button className="ct-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'sending…' : 'send message'}
          <span className="arrow" aria-hidden="true">↗</span>
        </button>

        <p className="ct-status mono" role="status" aria-live="polite">
          {status === 'sent' && <span className="ct-ok">✓ sent, thanks, I&apos;ll be in touch.</span>}
          {status === 'error' && <span className="ct-err">{error}</span>}
        </p>
      </div>
    </form>
  )
}
