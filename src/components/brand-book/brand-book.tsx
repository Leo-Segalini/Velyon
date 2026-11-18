import type { CSSProperties } from 'react'
import { activeSections, sectionTitle } from '@/lib/brand/catalog'
import { getLabels } from '@/lib/brand/labels'
import type { ResolvedBrand } from '@/lib/brand/types'
import { renderSection } from '@/components/brand-book/sections'

type BrandBookProps = {
  brand: ResolvedBrand
  fontOverrides?: Record<string, string>
}

export function BrandBook({ brand, fontOverrides }: BrandBookProps) {
  const labels = getLabels(brand.language)
  const pages = activeSections(brand.enabledSections)
  const style = { ...brand.cssVariables, ...fontOverrides } as CSSProperties
  const pageSize = brand.format === 'portrait' ? 'A4 portrait' : 'A4 landscape'

  return (
    <article className="brand-book" data-template={brand.template} data-format={brand.format} style={style}>
      <style>{`@page { size: ${pageSize}; margin: 0; }`}</style>
      {pages.length === 0 ? (
        <section className="sheet" aria-label={labels.missingSections}>
          <div className="sheet-body">
            <p>{labels.missingSections}</p>
          </div>
        </section>
      ) : (
        pages.map((page, index) => (
          <section className={page.id === 'cover' ? 'sheet sheet-cover' : 'sheet'} id={`section-${page.id}`} aria-label={sectionTitle(page.id, brand.language)} key={page.id}>
            {page.id === 'cover' ? null : (
              <header className="sheet-head">
                <p>{brand.name}</p>
                <h2>{sectionTitle(page.id, brand.language)}</h2>
              </header>
            )}
            <div className="sheet-body">{renderSection(page.id, brand)}</div>
            <footer className="sheet-foot">
              <span>
                {brand.name} — {labels.coverSubtitle}
              </span>
              <span>
                {labels.page} {index + 1} / {pages.length}
              </span>
            </footer>
            {brand.watermark ? (
              <p className="watermark" aria-hidden="true">
                {labels.watermark}
              </p>
            ) : null}
          </section>
        ))
      )}
    </article>
  )
}
