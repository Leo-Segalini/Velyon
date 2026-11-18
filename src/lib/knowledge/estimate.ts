import {
  BOUTIQUE,
  COLLABORATION,
  ESSENTIELLE,
  MAINTENANCE_BY_TOTAL,
  MOBILE_LINES,
  MOBILE_OPTIONS,
  MOBILITE,
  STACKS,
  VITRINE,
  VISIO_OPTIONS,
  WEB_SOCLE,
  sumLines,
  vatFromHt,
} from '@/lib/knowledge/catalog'
import type { Complexity, Estimate, MoneyLine, ProjectKind, StackChoice } from '@/lib/knowledge/types'
import { DAY_RATE_HT } from '@/lib/knowledge/types'

const PAYMENT_WEB = ['30 % à la commande', '40 % à la mise en service', '30 % à la recette']
const PAYMENT_MOBILE = ['40 % à la commande', '30 % à la livraison intermédiaire', '30 % à la recette']

const CONDITIONS = [
  'Montants hors taxes. TVA de 8,5 % applicable aux prestations réalisées à La Réunion.',
  `Toute évolution hors périmètre est chiffrée avant engagement, au taux journalier unique de ${DAY_RATE_HT} € HT, après accord écrit.`,
  'Garantie de 30 jours sur les anomalies après livraison.',
  'Offre valable 90 jours.',
  'L’hébergement est refacturé au réel, sans marge, sur justificatif. Il reste dû tant que le service est en ligne.',
  'Le code source développé est cédé au commanditaire.',
]

export type EstimateInput = {
  brief: string
  kind: ProjectKind
  complexity: Complexity
}

type Signals = {
  mobile: boolean
  visio: boolean
  translation: boolean
  collab: boolean
  voice: boolean
  coedit: boolean
  summary: boolean
  sso: boolean
  shop: boolean
  agenda: boolean
  pentest: boolean
}

export function estimateProject(input: EstimateInput): Estimate {
  const text = normalize(input.brief)
  const signals = detect(text)
  const warnings: string[] = []
  let kind = input.kind

  if (kind !== 'mobile' && signals.mobile && !signals.visio) {
    kind = 'mobile'
    warnings.push('Le texte décrit une application mobile : la grille mobile a été retenue.')
  } else if (kind === 'web' && (signals.visio || signals.translation)) {
    kind = 'plateforme'
    warnings.push('Le texte décrit une plateforme de visio ou de traduction : la grille correspondante a été retenue.')
  }

  if (kind === 'mobile') return finishMobile(signals, warnings)
  if (kind === 'plateforme' && (signals.visio || signals.translation)) return finishVisio(input.complexity, signals, warnings)
  if (signals.shop) return finishShop(warnings)
  return finishWeb(input.complexity, signals, warnings, kind === 'plateforme')
}

function finishMobile(signals: Signals, warnings: string[]): Estimate {
  const options: MoneyLine[] = []
  if (signals.agenda) options.push(MOBILE_OPTIONS.agenda)
  if (signals.pentest) options.push(MOBILE_OPTIONS.pentest)
  if (signals.sso) options.push(VISIO_OPTIONS.sso)
  return build({
    kind: 'mobile',
    formulaName: 'Socle application mobile',
    lines: MOBILE_LINES,
    options,
    hosting:
      'Première année d’hébergement comprise dans le socle. Ensuite, environ 600 € HT par an pour la production et la préproduction en France, révisable selon l’hébergeur. Les comptes Apple et Google restent à la charge du commanditaire.',
    payment: PAYMENT_MOBILE,
    warnings,
    stack: STACKS.mobile,
    extraConditions: ['Les délais de validation des stores Apple et Google sont extérieurs au planning.'],
  })
}

function finishVisio(complexity: Complexity, signals: Signals, warnings: string[]): Estimate {
  const formula = complexity === 'simple' ? 'essentielle' : complexity === 'elevee' || signals.collab ? 'complete' : 'mobilite'
  const lines = formula === 'essentielle' ? ESSENTIELLE : formula === 'complete' ? [...MOBILITE, COLLABORATION] : [...MOBILITE]
  const options: MoneyLine[] = []

  if (complexity === 'simple') {
    warnings.push(
      'La formule Essentielle ne spécialise pas la traduction sur le vocabulaire métier, ne relit pas la transcription et ne reprend pas seule après une coupure. L’adaptation vocabulaire (1 800 € HT) et l’espace collaboratif (5 500 € HT) supposent la formule Mobilité.',
    )
  }
  if (signals.voice && formula !== 'essentielle') options.push(VISIO_OPTIONS.voix)
  if (signals.voice && formula === 'essentielle') {
    warnings.push('La voix de synthèse (1 800 € HT) s’ajoute à la formule Mobilité, pas à l’Essentielle.')
  }
  if (signals.coedit && formula === 'complete') options.push(VISIO_OPTIONS.coedition)
  if (signals.coedit && formula !== 'complete') {
    warnings.push('La coédition (3 000 € HT) suppose l’espace collaboratif.')
  }
  if (signals.summary && formula !== 'essentielle') options.push(VISIO_OPTIONS.synthese)
  if (signals.sso) options.push(VISIO_OPTIONS.sso)

  const names = { essentielle: 'Formule Essentielle', mobilite: 'Formule Mobilité', complete: 'Formule Complète' } as const
  return build({
    kind: 'visio',
    formulaName: names[formula],
    lines,
    options,
    hosting:
      'Hébergement refacturé au réel. GPU sur créneaux : 150 à 250 € HT par mois. GPU permanent : 650 à 800 € HT par mois. Ordre de grandeur annuel en créneaux : 1 800 à 3 000 € HT.',
    payment: PAYMENT_WEB,
    warnings,
    stack: STACKS.visio,
  })
}

function finishWeb(complexity: Complexity, signals: Signals, warnings: string[], platformAsked: boolean): Estimate {
  if (complexity === 'simple') {
    warnings.push(`Aucun forfait « site vitrine » dans les références. Estimation au taux journalier de ${DAY_RATE_HT} € HT.`)
    return build({
      kind: 'web',
      formulaName: 'Estimation site vitrine',
      lines: VITRINE,
      options: signals.sso ? [VISIO_OPTIONS.sso] : [],
      hosting: 'Hébergement en France, refacturé au réel. Sans GPU, compter un ordre de grandeur de 600 € HT par an.',
      payment: PAYMENT_WEB,
      warnings,
      stack: STACKS.web,
    })
  }
  if (platformAsked) {
    warnings.push('Aucun module visio ni IA repéré dans le texte. Le socle est chiffré sans ces briques.')
  }
  if (complexity === 'elevee') {
    warnings.push('Un périmètre plus large que le socle se chiffre en avenant, au taux journalier, après cadrage.')
  }
  return build({
    kind: 'web',
    formulaName: 'Socle applicatif web',
    lines: [...WEB_SOCLE],
    options: signals.sso ? [VISIO_OPTIONS.sso] : [],
    hosting: 'Hébergement en France, refacturé au réel, sans marge. Sans GPU, compter un ordre de grandeur de 600 € HT par an.',
    payment: PAYMENT_WEB,
    warnings,
    stack: STACKS.web,
  })
}

function finishShop(warnings: string[]): Estimate {
  warnings.push(`Aucun forfait e-commerce dans les références. Estimation au taux journalier de ${DAY_RATE_HT} € HT.`)
  return build({
    kind: 'boutique',
    formulaName: 'Estimation boutique en ligne',
    lines: BOUTIQUE,
    options: [],
    hosting: 'Hébergement en France, refacturé au réel, sans marge.',
    payment: PAYMENT_WEB,
    warnings,
    stack: STACKS.web,
  })
}

function build(input: {
  kind: Estimate['kind']
  formulaName: string
  lines: MoneyLine[]
  options: MoneyLine[]
  hosting: string
  payment: string[]
  warnings: string[]
  stack: readonly StackChoice[]
  extraConditions?: string[]
}): Estimate {
  const totalHt = sumLines(input.lines)
  const { vat, ttc } = vatFromHt(totalHt)
  const known = MAINTENANCE_BY_TOTAL[totalHt]
  const maintenanceAnnualHt = known ?? Math.max(900, Math.round((totalHt * 0.125) / 50) * 50)
  return {
    kind: input.kind,
    formulaName: input.formulaName,
    lines: input.lines,
    options: input.options,
    totalHt,
    vat,
    totalTtc: ttc,
    maintenanceAnnualHt,
    maintenanceBasis: known
      ? 'Montant déjà pratiqué pour un forfait de même total.'
      : 'Environ 12,5 % du forfait, arrondi à 50 €, dans la fourchette des formules de référence.',
    hosting: input.hosting,
    payment: input.payment,
    conditions: [...CONDITIONS, ...(input.extraConditions ?? [])],
    warnings: input.warnings,
    stack: [...input.stack],
  }
}

export function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

function detect(text: string): Signals {
  const cleaned = stripNegations(text)
  return {
    mobile: has(cleaned, ['application mobile', 'flutter', 'app store', 'play store', 'ios et android', 'android et ios']),
    visio: has(cleaned, ['visio', 'visioconference', 'livekit', 'webinaire', 'seminaire', 'reunion en ligne']),
    translation: has(cleaned, ['traduction', 'sous-titre', 'sous titre', 'multilingue', 'interprete']),
    collab: has(cleaned, ['collaboratif', 'coedition', 'co-edition', 'documents bilingues']),
    voice: has(cleaned, ['voix de synthese', 'synthese vocale', 'ecouter la traduction']),
    coedit: has(cleaned, ['coedition', 'co-edition', 'edition simultanee', 'google docs']),
    summary: has(cleaned, ['synthese automatique', 'compte rendu automatique', 'resume automatique']),
    sso: has(cleaned, ['sso', 'authentification unique', 'saml', 'openid']),
    shop: has(cleaned, ['e-commerce', 'ecommerce', 'boutique en ligne', 'panier', 'paiement en ligne']),
    agenda: has(cleaned, ['agenda', 'evenement', 'calendrier']),
    pentest: has(cleaned, ['pentest', 'test d intrusion', 'audit d intrusion', 'audit de securite']),
  }
}

export function stripNegations(text: string): string {
  return text.replace(/\b(sans|pas de|pas d'|aucune|aucun|non)\s+\S+/g, ' ')
}

function has(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(normalize(word)))
}
