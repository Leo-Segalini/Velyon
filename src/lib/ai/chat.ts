import { formatEuro } from '@/lib/knowledge/catalog'
import { estimateProject, normalize, stripNegations } from '@/lib/knowledge/estimate'
import type { Complexity, DossierRequest, Estimate, ProjectKind } from '@/lib/knowledge/types'
import { DAY_RATE_HT } from '@/lib/knowledge/types'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type ChatPlan = {
  text: string
  attachDocuments: boolean
  request: DossierRequest | null
  estimate: Estimate | null
}

const QUESTIONS = [
  'Qui va s’en servir au quotidien, et dans quel contexte ?',
  'Quelles sont les trois actions que l’outil doit absolument permettre ?',
  'Est-ce plutôt un site, une application mobile, ou une plateforme avec visio, traduction ou espace connecté ?',
  'Quelles contraintes comptez-vous : hors ligne, visio, traduction, paiement, comptes déjà existants, hébergement en France ?',
  'Quelle est l’échéance, et s’agit-il d’un premier pilote ou d’un périmètre déjà large ?',
] as const

export function planTurn(messages: ChatMessage[]): ChatPlan {
  const users = messages.filter((message) => message.role === 'user')
  const brief = users.map((message) => message.content).join('\n').slice(0, 8000)
  const substantive = substantiveMessages(users)

  if (substantive.length === 0) {
    return {
      text: 'Décrivez le projet en quelques phrases. Je poserai ensuite quelques questions, et le chiffrage viendra seulement à la fin.',
      attachDocuments: false,
      request: null,
      estimate: null,
    }
  }

  const questionIndex = substantive.length - 1
  if (questionIndex < QUESTIONS.length) {
    const question = QUESTIONS[questionIndex] ?? QUESTIONS[0]
    const text = questionIndex === 0
      ? `Bien noté. Avant tout chiffrage : ${question.charAt(0).toLowerCase()}${question.slice(1)}`
      : question
    return {
      text,
      attachDocuments: false,
      request: null,
      estimate: null,
    }
  }

  const request = toRequest(brief)
  const estimate = estimateProject(request)
  return {
    text: `J’ai assez d’éléments. ${priceSentence(estimate)} Le cahier des charges, la proposition technique et la proposition financière sont juste en dessous.`,
    attachDocuments: true,
    request,
    estimate,
  }
}

function substantiveMessages(users: ChatMessage[]): ChatMessage[] {
  let collected = ''
  let started = false
  const kept: ChatMessage[] = []
  for (const message of users) {
    collected = `${collected}\n${message.content}`
    if (!started && !isProjectBrief(collected)) continue
    started = true
    kept.push(message)
  }
  return kept
}

export function chatSystem(estimate: Estimate | null): string {
  const price = estimate
    ? `Si un prix est utile, cite uniquement ceux-ci : ${estimate.formulaName}, ${formatEuro(estimate.totalHt)} HT, ${formatEuro(estimate.totalTtc)} TTC, maintenance ${formatEuro(estimate.maintenanceAnnualHt)} HT, taux journalier ${DAY_RATE_HT} € HT. N’invente aucun autre montant.`
    : 'La phase de questions n’est pas terminée. Pose une seule question. N’annonce aucun montant, aucun ordre de grandeur, aucun tarif.'
  return [
    'Tu es Velyon. Tu discutes avec quelqu’un qui prépare un projet digital.',
    'Réponds en français, en quelques phrases, comme dans une conversation.',
    'Pas de titre, pas de tableau, pas de liste de tarifs.',
    'Pose une seule question si une information manque.',
    price,
  ].join('\n')
}

export function historyText(messages: ChatMessage[]): string {
  return messages
    .map((message) => `${message.role === 'user' ? 'Prospect' : 'Velyon'} : ${message.content}`)
    .join('\n\n')
}

export function keepsPrices(text: string, estimate: Estimate | null): boolean {
  const amounts = euroAmounts(text)
  if (!estimate) return amounts.length === 0
  const allowed = new Set<number>([
    estimate.totalHt,
    estimate.totalTtc,
    estimate.vat,
    estimate.maintenanceAnnualHt,
    DAY_RATE_HT,
    150,
    250,
    600,
    650,
    800,
    ...estimate.lines.map((line) => line.amountHt),
    ...estimate.options.map((line) => line.amountHt),
  ])
  return amounts.every((amount) => allowed.has(amount) || allowed.has(Math.round(amount)))
}

function priceSentence(estimate: Estimate): string {
  return `Je retiens ${estimate.formulaName} : ${formatEuro(estimate.totalHt)} HT, soit ${formatEuro(estimate.totalTtc)} TTC. La maintenance annuelle recommandée est de ${formatEuro(estimate.maintenanceAnnualHt)} HT.`
}

function toRequest(brief: string): DossierRequest {
  const text = stripNegations(normalize(brief))
  const complexity: Complexity = has(text, ['collaboratif', 'perimetre large', 'formule complete'])
    ? 'elevee'
    : has(text, ['pilote', 'mvp', 'premier perimetre', 'essentiel', 'le plus court'])
      ? 'simple'
      : 'standard'
  const kind: ProjectKind = has(text, ['application mobile', 'flutter', 'app store', 'play store']) && !has(text, ['visio', 'visioconference', 'traduction'])
    ? 'mobile'
    : has(text, ['visio', 'visioconference', 'livekit', 'traduction', 'sous-titre', 'sous titre', 'seminaire'])
      ? 'plateforme'
      : 'web'
  return { brief, clientName: '', kind, complexity, deadline: '' }
}

function isProjectBrief(brief: string): boolean {
  const text = normalize(brief).trim()
  if (text.length < 40) return false
  if (/^(bonjour|bonsoir|salut|hello|coucou)\b/.test(text) && text.length < 80) return false
  return true
}

function has(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(normalize(word)))
}

function euroAmounts(text: string): number[] {
  const matches = text.match(/(\d[\d\s\u00a0\u202f]*)(?:[,.]\d+)?\s*(?:€|euros?)/gi) ?? []
  return matches.map((raw) => Number(raw.replace(/[^\d,.]/g, '').replace(',', '.'))).filter((value) => Number.isFinite(value))
}
