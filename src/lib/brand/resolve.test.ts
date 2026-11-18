import { describe, expect, it } from 'vitest'
import { activeSections } from '@/lib/brand/catalog'
import { complianceChecks, contrastPairs } from '@/lib/brand/compliance'
import { demoBrand } from '@/lib/brand/demo'
import { safeFamily } from '@/lib/brand/fonts'
import { getLabels } from '@/lib/brand/labels'
import { resolveBrand } from '@/lib/brand/resolve'
import { renderTokensCss } from '@/lib/brand/tokens'

describe('marque résolue', () => {
  it('accepte la démonstration sans repli', () => {
    const brand = resolveBrand(demoBrand)
    expect(brand.warnings).toEqual([])
    expect(brand.cssVariables['--brand-primary']).toBe('#92977E')
    expect(brand.cssVariables['--brand-background']).toBe('#FFFAE2')
    expect(activeSections(brand.enabledSections)).toHaveLength(18)
    expect(complianceChecks(brand).every((item) => item.ok)).toBe(true)
    expect(contrastPairs(brand).some((pair) => pair.level === 'fail' && !pair.critical)).toBe(true)
  })

  it('signale et remplace une couleur manquante', () => {
    const brand = resolveBrand({
      ...demoBrand,
      colors: demoBrand.colors.filter((color) => color.role !== 'primary'),
    })
    expect(brand.colorsByRole.primary?.hex).toBe('#1F2933')
    expect(brand.warnings.some((warning) => warning.includes('primaire'))).toBe(true)
  })

  it('n’injecte pas de balise dans un nom de police', () => {
    expect(safeFamily('Inter</style><script>')).not.toContain('<')
    expect(safeFamily('Plus Jakarta Sans')).toBe('Plus Jakarta Sans')
  })

  it('écrit les jetons à partir des variables résolues', () => {
    const css = renderTokensCss(resolveBrand(demoBrand))
    expect(css).toContain('--brand-primary: #92977E;')
    expect(css).toContain('Plus Jakarta Sans')
    expect(css).not.toContain('#112233')
  })

  it('traduit les libellés du gabarit', () => {
    expect(getLabels('fr').forbidden).toBe('Interdit')
    expect(getLabels('en').coverSubtitle).toContain('Graphic charter')
  })
})
