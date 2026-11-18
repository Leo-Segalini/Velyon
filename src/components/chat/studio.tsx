'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

type Documents = {
  title: string
  cahierDesCharges: string
  propositionTechnique: string
  propositionFinanciere: string
}

type Item = {
  role: 'user' | 'assistant'
  content: string
  documents?: Documents | null
}

const SUGGESTIONS = [
  'Une application mobile pour des adhérents, avec notifications et lecture hors ligne.',
  'Une plateforme de séminaires en visio, avec traduction en direct.',
  'Un site de présentation avec un formulaire de contact.',
]

export function ChatStudio() {
  const fieldId = useId()
  const scroller = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const node = scroller.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollTo({ top: node.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [items, pending])

  async function send(text: string) {
    const content = text.trim()
    if (!content || pending) return
    const history = [...items, { role: 'user' as const, content }]
    setItems(history)
    setDraft('')
    setError(null)
    setPending(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content: value }) => ({ role, content: value })) }),
      })
      const payload = (await response.json()) as { message?: string; documents?: Documents | null; error?: string }
      if (!response.ok || !payload.message) {
        setError(payload.error ?? 'Le message n’a pas abouti.')
        return
      }
      setItems([...history, { role: 'assistant', content: payload.message, documents: payload.documents ?? null }])
    } catch {
      setError('La connexion a échoué. Réessayez.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8">
          {items.length === 0 ? (
            <div className="m-auto w-full max-w-xl text-center">
              <h1 className="font-heading text-4xl font-bold">Que prépare-t-on ?</h1>
              <p className="mt-3 text-sage">Décrivez le projet. Je pose d’abord plusieurs questions. Le chiffrage et les documents arrivent seulement ensuite.</p>
              <ul className="mt-8 flex flex-col gap-3 text-left">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button type="button" className="btn btn-outline w-full justify-start px-4 text-left" onClick={() => send(suggestion)}>
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="flex flex-col gap-4" aria-live="polite">
              {items.map((item, index) => (
                <li key={`${item.role}-${index}`} className={item.role === 'user' ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[92%]'}>
                  <p className={item.role === 'user' ? 'rounded-2xl bg-ink px-4 py-3 text-canvas' : 'bubble px-4 py-3'}>{item.content}</p>
                  {item.documents ? <DocumentStack documents={item.documents} /> : null}
                </li>
              ))}
              {pending ? <li className="text-sm text-sage">Velyon écrit…</li> : null}
            </ol>
          )}
        </div>
      </div>
      <form
        className="border-t border-line bg-canvas px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault()
          void send(draft)
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-line bg-paper p-2 shadow-card">
          <label className="sr-only" htmlFor={fieldId}>Votre message</label>
          <textarea
            id={fieldId}
            rows={1}
            value={draft}
            maxLength={4000}
            placeholder="Décrivez le projet…"
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-base text-ink outline-none"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void send(draft)
              }
            }}
          />
          <button type="submit" className="btn btn-primary h-11 w-11 px-0" disabled={pending || draft.trim().length === 0} aria-label="Envoyer">
            <ArrowUp aria-hidden="true" size={18} />
          </button>
        </div>
        {error ? <p role="alert" className="mx-auto mt-2 max-w-3xl text-sm font-medium text-danger">{error}</p> : null}
      </form>
    </div>
  )
}

function DocumentStack({ documents }: { documents: Documents }) {
  const files = [
    { label: 'Cahier des charges', text: documents.cahierDesCharges },
    { label: 'Proposition technique', text: documents.propositionTechnique },
    { label: 'Proposition financière', text: documents.propositionFinanciere },
  ]
  return (
    <div className="mt-3 grid gap-2">
      {files.map((file) => (
        <details key={file.label} className="card p-3">
          <summary className="flex min-h-11 cursor-pointer items-center font-heading font-semibold">{file.label}</summary>
          <div className="mt-3">
            <CopyButton text={file.text} />
            <pre className="mt-3 whitespace-pre-wrap font-body text-sm text-sage">{file.text}</pre>
          </div>
        </details>
      ))}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-outline px-3 text-sm"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? 'Copié' : 'Copier'}
    </button>
  )
}
