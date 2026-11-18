import { describe, expect, it } from 'vitest'
import { formatEuro, sumLines, vatFromHt } from '@/lib/knowledge/catalog'
import { buildTexts, fallbackNarrative } from '@/lib/knowledge/documents'
import { estimateProject } from '@/lib/knowledge/estimate'

const base = {
  clientName: 'Atelier Nord',
  deadline: 'juin 2027',
}

describe('estimation à partir des références', () => {
  it('retient le socle mobile à 21 495 € HT', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'mobile',
      complexity: 'standard',
      brief: 'Application mobile pour consulter des actualités, avec notifications et mode hors ligne.',
    })
    expect(estimate.totalHt).toBe(21495)
    expect(sumLines(estimate.lines)).toBe(21495)
    expect(estimate.maintenanceAnnualHt).toBe(2700)
    expect(estimate.vat).toBe(1827.08)
    expect(estimate.totalTtc).toBe(23322.08)
    expect(estimate.lines.some((line) => line.label.includes('Flutter') || line.detail.includes('Flutter'))).toBe(true)
  })

  it('ajoute l’agenda sans modifier le socle mobile', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'mobile',
      complexity: 'standard',
      brief: 'Application mobile avec un agenda des événements du réseau.',
    })
    expect(estimate.totalHt).toBe(21495)
    expect(estimate.options.map((line) => line.amountHt)).toEqual([1350])
  })

  it('aligne la visio standard sur la formule Mobilité', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'plateforme',
      complexity: 'standard',
      brief: 'Plateforme de séminaires en visioconférence avec traduction en direct et transcription.',
    })
    expect(estimate.formulaName).toBe('Formule Mobilité')
    expect(estimate.totalHt).toBe(19500)
    expect(estimate.maintenanceAnnualHt).toBe(2450)
    expect(vatFromHt(7000)).toEqual({ vat: 595, ttc: 7595 })
  })

  it('aligne le besoin simple sur la formule Essentielle', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'plateforme',
      complexity: 'simple',
      brief: 'Sessions en visio avec sous-titres traduits, pour un premier pilote.',
    })
    expect(estimate.totalHt).toBe(7000)
    expect(estimate.maintenanceAnnualHt).toBe(900)
    expect(estimate.warnings.some((item) => item.includes('Essentielle'))).toBe(true)
  })

  it('passe en formule Complète quand l’espace collaboratif est demandé', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'plateforme',
      complexity: 'standard',
      brief: 'Visio, traduction, et un espace collaboratif pour les documents bilingues.',
    })
    expect(estimate.totalHt).toBe(25000)
    expect(estimate.maintenanceAnnualHt).toBe(3150)
    expect(estimate.lines.filter((line) => line.id === 'collaboratif')).toHaveLength(1)
  })

  it('chiffre une vitrine au taux journalier, sans forfait inventé', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'web',
      complexity: 'simple',
      brief: 'Site vitrine de présentation de l’activité, avec un formulaire de contact.',
    })
    expect(estimate.totalHt).toBe(4050)
    expect(estimate.lines.every((line) => line.origin === 'tjm')).toBe(true)
  })

  it('reconnaît une application mobile même si le type choisi est web', () => {
    const estimate = estimateProject({
      ...base,
      kind: 'web',
      complexity: 'standard',
      brief: 'Il nous faut une application Flutter publiée sur l’App Store et le Play Store.',
    })
    expect(estimate.kind).toBe('mobile')
    expect(estimate.totalHt).toBe(21495)
  })

  it('rédige la proposition financière avec le total de la grille', () => {
    const request = {
      ...base,
      kind: 'mobile' as const,
      complexity: 'standard' as const,
      brief: 'Application mobile de consultation, notifications et favoris hors ligne pour un réseau d’adhérents.',
    }
    const estimate = estimateProject(request)
    const texts = buildTexts(request, estimate, fallbackNarrative(request, estimate))
    expect(texts.propositionFinanciere).toContain(formatEuro(21495))
    expect(texts.propositionTechnique).toContain('Flutter')
    expect(texts.cahierDesCharges).toContain('Atelier Nord')
    expect(texts.propositionFinanciere).not.toContain(formatEuro(31600))
  })
})
