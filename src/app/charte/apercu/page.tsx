import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandBook } from '@/components/brand-book/brand-book'
import '@/components/brand-book/book.css'
import { DownloadPdfButton } from '@/components/pdf/download-button'
import { demoBrand } from '@/lib/brand/demo'
import { fontOverridesFor } from '@/lib/brand/fonts'
import { parseBookOptions } from '@/lib/brand/options'
import { resolveBrand } from '@/lib/brand/resolve'
import { buttonClass } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Aperçu de la charte' }
export const dynamic = 'force-dynamic'

type PreviewPageProps = {
  searchParams: { template?: string; format?: string }
}

const TEMPLATES = [
  ['classique', 'Classique'],
  ['editorial', 'Éditorial'],
  ['minimal', 'Minimal'],
] as const

const FORMATS = [
  ['landscape', 'A4 paysage'],
  ['portrait', 'A4 portrait'],
] as const

export default function PreviewPage({ searchParams }: PreviewPageProps) {
  const options = parseBookOptions({ template: searchParams.template, format: searchParams.format })
  const brand = resolveBrand({ ...demoBrand, template: options.template, format: options.format })
  const query = `template=${options.template}&format=${options.format}`

  return (
    <div>
      <a href="#charte" className="skip-link no-print">Aller à la charte</a>
      <div className="no-print sticky top-0 z-[var(--z-header)] border-b border-line bg-canvas/95">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-sage">Même moteur que le PDF</p>
            <h1 className="font-heading text-2xl font-semibold">Charte de démonstration</h1>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Modèle de mise en page">
              {TEMPLATES.map(([value, label]) => (
                <Link key={value} href={`/charte/apercu?template=${value}&format=${options.format}`} aria-current={options.template === value ? 'page' : undefined} className={buttonClass(options.template === value ? 'primary' : 'outline', 'min-h-11')}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Format">
              {FORMATS.map(([value, label]) => (
                <Link key={value} href={`/charte/apercu?template=${options.template}&format=${value}`} aria-current={options.format === value ? 'page' : undefined} className={buttonClass(options.format === value ? 'ai' : 'outline')}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <DownloadPdfButton href={`/api/charte/pdf?${query}`} />
            <Link href="/tableau-de-bord" className={buttonClass('outline')}>Retour au tableau de bord</Link>
          </div>
        </div>
        {brand.warnings.length > 0 ? (
          <ul className="mx-auto max-w-[1400px] px-6 pb-4 text-sm text-danger" role="status">
            {brand.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        ) : null}
        <p className="mx-auto max-w-[1400px] px-6 pb-3 text-xs text-sage md:hidden">Sur un petit écran, faites défiler horizontalement pour voir la page entière.</p>
      </div>
      <div className="preview-stage" id="charte">
        <BrandBook brand={brand} fontOverrides={fontOverridesFor(brand.fonts)} />
      </div>
    </div>
  )
}
