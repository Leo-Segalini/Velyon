import { describe, expect, it } from 'vitest'
import { formatEuro } from '@/lib/knowledge/catalog'
import { keepsPrices, planTurn } from '@/lib/ai/chat'

const mobile = 'Application mobile pour consulter des actualités, avec notifications et mode hors ligne pour les adhérents.'

describe('conversation', () => {
  it('demande le projet quand le message est trop court', () => {
    const plan = planTurn([{ role: 'user', content: 'Bonjour' }])
    expect(plan.attachDocuments).toBe(false)
    expect(plan.estimate).toBeNull()
    expect(plan.text).toContain('Décrivez le projet')
  })

  it('pose une question sans annoncer de prix', () => {
    const plan = planTurn([{ role: 'user', content: mobile }])
    expect(plan.attachDocuments).toBe(false)
    expect(plan.estimate).toBeNull()
    expect(plan.text).toContain('qui va s’en servir')
    expect(plan.text).not.toContain('€')
  })

  it('continue les questions même si on demande le prix', () => {
    const plan = planTurn([
      { role: 'user', content: mobile },
      { role: 'assistant', content: 'Qui va s’en servir au quotidien ?' },
      { role: 'user', content: 'C’est combien, le prix ?' },
    ])
    expect(plan.estimate).toBeNull()
    expect(plan.text).not.toContain('€')
    expect(plan.text).toContain('trois actions')
  })

  it('chiffre seulement après les cinq réponses', () => {
    const answers = [
      mobile,
      'Les adhérents et l’équipe qui publie les actualités.',
      'Lire, recevoir une notification, garder un article hors ligne.',
      'Une application mobile, sans visio.',
      'Hors ligne indispensable, hébergement en France, pas de paiement.',
      'Pilote pour septembre, premier périmètre.',
    ]
    const messages = answers.flatMap((content) => [
      { role: 'user' as const, content },
      { role: 'assistant' as const, content: 'Question suivante.' },
    ])
    messages.pop()
    const plan = planTurn(messages)
    expect(plan.attachDocuments).toBe(true)
    expect(plan.estimate?.totalHt).toBe(21495)
    expect(plan.text).toContain(formatEuro(21495))
  })

  it('refuse un prix inventé', () => {
    const priced = planTurn([
      { role: 'user', content: mobile },
      { role: 'assistant', content: 'Question.' },
      { role: 'user', content: 'Les adhérents.' },
      { role: 'assistant', content: 'Question.' },
      { role: 'user', content: 'Lire, notifier, hors ligne.' },
      { role: 'assistant', content: 'Question.' },
      { role: 'user', content: 'Application mobile.' },
      { role: 'assistant', content: 'Question.' },
      { role: 'user', content: 'Hors ligne et hébergement en France.' },
      { role: 'assistant', content: 'Question.' },
      { role: 'user', content: 'Pilote en septembre.' },
    ])
    expect(keepsPrices(`Le total est ${formatEuro(21495)} HT.`, priced.estimate)).toBe(true)
    expect(keepsPrices('Je vous le fais à 99 000 €.', priced.estimate)).toBe(false)
    expect(keepsPrices('Le prix sera de 12 000 €.', null)).toBe(false)
  })
})
