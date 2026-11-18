'use client'

import { buttonClass } from '@/components/ui/button'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-container px-6 py-24">
      <h1 className="font-heading text-4xl font-bold">Une erreur est survenue</h1>
      <p className="mt-4 max-w-xl text-sage">Le chargement de la page a échoué. Vous pouvez relancer l’affichage.</p>
      <button type="button" className={`${buttonClass('primary')} mt-8`} onClick={() => reset()}>Réessayer</button>
    </div>
  )
}
