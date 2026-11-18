'use client'

import { useState } from 'react'
import { buttonClass } from '@/components/ui/button'

type DownloadPdfButtonProps = {
  href: string
}

export function DownloadPdfButton({ href }: DownloadPdfButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('La génération ouvre Chromium et peut prendre quelques secondes.')

  async function download() {
    setStatus('loading')
    setMessage('Génération du PDF…')
    try {
      const response = await fetch(href)
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error ?? 'La génération a échoué.')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'velyon-charte-demonstration.pdf'
      anchor.click()
      URL.revokeObjectURL(url)
      setStatus('idle')
      setMessage('Le PDF a été téléchargé.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'La génération a échoué. Réessayez.')
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button type="button" className={buttonClass('primary')} onClick={() => void download()} disabled={status === 'loading'} aria-busy={status === 'loading'}>
        {status === 'loading' ? 'Génération du PDF…' : 'Télécharger le PDF'}
      </button>
      <p role="status" className={`text-xs ${status === 'error' ? 'text-danger' : 'text-sage'}`}>{message}</p>
    </div>
  )
}
