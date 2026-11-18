import { AGENCY, METHOD, SECURITY, formatEuro } from '@/lib/knowledge/catalog'
import type { DossierRequest, Estimate, Narrative } from '@/lib/knowledge/types'

export function fallbackNarrative(input: DossierRequest, estimate: Estimate): Narrative {
  const brief = input.brief.replace(/\s+/g, ' ').trim().slice(0, 700)
  return {
    title: titleFrom(input, estimate),
    context: `${input.clientName || 'Le commanditaire'} décrit le besoin ainsi : ${brief} Le chiffrage retient ${estimate.formulaName}, à partir des forfaits déjà pratiqués. Le périmètre se fige à l’atelier de cadrage.`,
    objectives: [
      'Mettre en service un outil que les équipes utilisent sans formation longue.',
      'Garder les données en France et documenter les traitements.',
      'Céder le code et permettre de changer d’hébergeur.',
    ],
    vigilance: estimate.warnings.length > 0 ? estimate.warnings : ['Le besoin est à confirmer en atelier avant de figer le périmètre et le prix.'],
    functionalScope: estimate.lines.map((line) => ({ title: line.label, detail: line.detail })),
    technicalRequirements: estimate.stack.map((item) => `${item.layer} : ${item.choice}. ${item.why}`),
    method: [...METHOD],
    security: [...SECURITY],
  }
}

export function buildTexts(input: DossierRequest, estimate: Estimate, narrative: Narrative): {
  cahierDesCharges: string
  propositionTechnique: string
  propositionFinanciere: string
} {
  const who = input.clientName || 'le commanditaire'
  const when = input.deadline ? `Échéance indiquée : ${input.deadline}.` : 'Échéance à confirmer au cadrage.'
  const cahier = [
    `Cahier des charges — ${narrative.title}`,
    `Préparé pour ${who}. ${when}`,
    '',
    '1. Contexte',
    narrative.context,
    '',
    '2. Objectifs',
    ...narrative.objectives.map((item) => `— ${item}`),
    '',
    '3. Périmètre fonctionnel',
    ...narrative.functionalScope.flatMap((item) => [item.title, item.detail, '']),
    '4. Exigences techniques',
    ...narrative.technicalRequirements.map((item) => `— ${item}`),
    '',
    '5. Points à confirmer',
    ...narrative.vigilance.map((item) => `— ${item}`),
    '',
    '6. Méthode',
    ...narrative.method.map((item) => `— ${item}`),
  ].join('\n')

  const technique = [
    `Proposition technique — ${narrative.title}`,
    AGENCY.name,
    `Pour ${who}. ${when}`,
    '',
    '1. Compréhension du besoin',
    narrative.context,
    '',
    '2. Points de vigilance',
    ...narrative.vigilance.map((item) => `— ${item}`),
    '',
    '3. Solution proposée',
    ...narrative.functionalScope.flatMap((item) => [item.title, item.detail, '']),
    '4. Architecture',
    ...estimate.stack.map((item) => `${item.layer} — ${item.choice}. ${item.why}`),
    '',
    '5. Sécurité, RGPD et réversibilité',
    ...narrative.security.map((item) => `— ${item}`),
    '',
    '6. Méthode et planning',
    ...narrative.method.map((item) => `— ${item}`),
    'Le planning détaillé est arrêté au cadrage. Les délais de tiers (stores, hébergeur, contenus fournis par le commanditaire) décalent d’autant.',
    '',
    '7. Engagement',
    'Les montants figurent dans la proposition financière. Ils ne sont pas renégociés dans ce document.',
    AGENCY.legal,
    AGENCY.signature,
  ].join('\n')

  const financiere = [
    `Proposition financière — ${narrative.title}`,
    AGENCY.name,
    `Pour ${who}. ${when}`,
    '',
    `Formule retenue : ${estimate.formulaName}`,
    '',
    'Détail',
    ...estimate.lines.map((line) => `${line.label} — ${formatEuro(line.amountHt)} HT${line.origin === 'tjm' ? ' (taux journalier)' : ''}\n${line.detail}`),
    '',
    `Total forfait : ${formatEuro(estimate.totalHt)} HT`,
    `TVA 8,5 % : ${formatEuro(estimate.vat)}`,
    `Total TTC : ${formatEuro(estimate.totalTtc)}`,
    '',
    estimate.options.length > 0 ? 'Options, non comprises dans le forfait' : 'Aucune option ajoutée.',
    ...estimate.options.map((line) => `${line.label} — ${formatEuro(line.amountHt)} HT\n${line.detail}`),
    '',
    `Maintenance annuelle recommandée : ${formatEuro(estimate.maintenanceAnnualHt)} HT. ${estimate.maintenanceBasis}`,
    `Hébergement : ${estimate.hosting}`,
    '',
    'Paiement',
    ...estimate.payment.map((item) => `— ${item}`),
    '',
    'Conditions',
    ...estimate.conditions.map((item) => `— ${item}`),
    '',
    'Choix',
    `☐ ${estimate.formulaName}`,
    ...estimate.options.map((line) => `☐ Option — ${line.label}`),
    '',
    'Bon pour accord',
    `Pour ${who} : date et signature.`,
    `Pour l’agence : ${AGENCY.signature}`,
    AGENCY.legal,
  ].join('\n')

  return { cahierDesCharges: cahier, propositionTechnique: technique, propositionFinanciere: financiere }
}

function titleFrom(input: DossierRequest, estimate: Estimate): string {
  if (input.clientName) return `Projet ${input.clientName}`
  if (estimate.kind === 'mobile') return 'Application mobile'
  if (estimate.kind === 'visio') return 'Plateforme de sessions'
  if (estimate.kind === 'boutique') return 'Boutique en ligne'
  return 'Projet web'
}
