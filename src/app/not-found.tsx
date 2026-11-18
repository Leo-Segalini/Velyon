import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { buttonClass } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <SiteHeader />
      <main id="contenu" className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-heading text-4xl font-bold">Cette page n’existe pas</h1>
        <p className="mt-4 text-sage">Le lien est ancien. La discussion est à l’accueil.</p>
        <p className="mt-8">
          <Link href="/" className={buttonClass('primary')}>Retour à la discussion</Link>
        </p>
      </main>
    </>
  )
}
