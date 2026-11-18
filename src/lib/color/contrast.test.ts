import { describe, expect, it } from 'vitest'
import { contrastRatio, ensureContrast, suggestForeground, wcagLevel } from '@/lib/color/contrast'

describe('contrastes WCAG', () => {
  it('calcule le noir sur blanc à 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5)
  })

  it('classe AA et AAA pour le texte courant', () => {
    expect(wcagLevel(7)).toBe('AAA')
    expect(wcagLevel(4.5)).toBe('AA')
    expect(wcagLevel(4.49)).toBe('fail')
    expect(wcagLevel(3, true)).toBe('AA')
  })

  it('choisit l’encre sur Cornsilk et le clair sur l’olive profond', () => {
    expect(suggestForeground('#FFFAE2')).toBe('#14160F')
    expect(suggestForeground('#26291E')).toBe('#FFFFFF')
    expect(contrastRatio('#26291E', '#FFFAE2')).toBeGreaterThan(7)
    expect(contrastRatio('#5C614D', '#FFFAE2')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#FFFAE2', '#92977E')).toBeLessThan(4.5)
    expect(contrastRatio('#26291E', '#92977E')).toBeGreaterThanOrEqual(4.5)
  })

  it('propose une teinte lisible quand le couple échoue', () => {
    const suggestion = ensureContrast('#92977E', '#FFFAE2')
    expect(contrastRatio(suggestion, '#FFFAE2')).toBeGreaterThanOrEqual(4.5)
  })
})
