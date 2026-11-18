import type { MoneyLine, StackChoice } from '@/lib/knowledge/types'
import { DAY_RATE_HT } from '@/lib/knowledge/types'

export const AGENCY = {
  name: 'Agence Digitale Iroko',
  legal:
    'Agence Digitale Iroko, SASU au capital de 1 000 €, 14 rue Pasteur, 97400 Saint-Denis, RCS Saint-Denis 908 093 354, SIRET 908 093 354 00011. Assurance responsabilité civile professionnelle des métiers de l’informatique (Hiscox).',
  signature: 'Ali Srour — Directeur, Agence Digitale Iroko',
} as const

export const ESSENTIELLE: MoneyLine[] = [
  { id: 'cadrage-allege', label: 'Cadrage allégé', detail: 'Atelier de cadrage, parcours participant et écran de salle.', amountHt: 500, origin: 'reference' },
  { id: 'socle-simple', label: 'Socle simplifié', detail: 'Comptes administrateur et participant, sessions, invitations, affichage mobile.', amountHt: 1400, origin: 'reference' },
  { id: 'visio-simple', label: 'Visioconférence intégrée', detail: 'LiveKit auto-hébergé, salles par session, partage d’écran, mode audio seul.', amountHt: 1500, origin: 'reference' },
  { id: 'traduction-standard', label: 'Sous-titres traduits en direct, version standard', detail: 'Transcription et traduction avec les modèles génériques, glossaire simple, affichage fixe, sans reprise automatique après coupure.', amountHt: 2400, origin: 'reference' },
  { id: 'transcription-brute', label: 'Transcription brute', detail: 'Texte de la session dans les deux langues, exportable.', amountHt: 400, origin: 'reference' },
  { id: 'mise-en-service-simple', label: 'Mise en service', detail: 'Session de test, manuel utilisateur, une session de formation.', amountHt: 800, origin: 'reference' },
]

export const MOBILITE: MoneyLine[] = [
  { id: 'cadrage', label: 'Cadrage et conception', detail: 'Atelier de cadrage, maquettes du parcours, architecture, dossier RGPD.', amountHt: 1500, origin: 'reference' },
  { id: 'socle', label: 'Socle de la plateforme', detail: 'Comptes et quatre niveaux d’accès, sessions, invitations, espace documentaire, affichage mobile.', amountHt: 4000, origin: 'reference' },
  { id: 'visio', label: 'Visioconférence intégrée', detail: 'LiveKit auto-hébergé, salles par session, partage d’écran, mode audio seul en réseau faible.', amountHt: 2800, origin: 'reference' },
  { id: 'traduction', label: 'Traduction en temps réel', detail: 'Sous-titres, historique, reprise après coupure, horodatage par intervenant, essai de charge.', amountHt: 4500, origin: 'reference' },
  { id: 'vocabulaire', label: 'Adaptation au vocabulaire métier', detail: 'Glossaire bilingue administrable, ajustement des modèles sur le corpus, jeu de tests.', amountHt: 1800, origin: 'reference' },
  { id: 'transcription', label: 'Transcription et comptes rendus', detail: 'Enregistrement, séparation des intervenants, transcription bilingue, relecture, export et recherche.', amountHt: 3200, origin: 'reference' },
  { id: 'recette', label: 'Pilote, recette, formation et mise en service', detail: 'Session pilote, corrections, manuels, une session de formation.', amountHt: 1700, origin: 'reference' },
]

export const COLLABORATION: MoneyLine = {
  id: 'collaboratif',
  label: 'Espace collaboratif asynchrone',
  detail: 'Documents bilingues côte à côte, contributions traduites, validation, historique des versions, suivi des décisions.',
  amountHt: 5500,
  origin: 'reference',
}

export const VISIO_OPTIONS = {
  voix: { id: 'voix', label: 'Voix de synthèse', detail: 'Écoute de la traduction, voix générées sur les serveurs du projet.', amountHt: 1800, origin: 'reference' },
  coedition: { id: 'coedition', label: 'Coédition en temps réel', detail: 'Édition simultanée, avec une colonne traduite. Suppose l’espace collaboratif.', amountHt: 3000, origin: 'reference' },
  synthese: { id: 'synthese', label: 'Synthèse automatique des comptes rendus', detail: 'Points clés, décisions et actions, par un modèle local en circuit fermé.', amountHt: 1800, origin: 'reference' },
  sso: { id: 'sso', label: 'Connexion aux comptes de l’organisation (SSO)', detail: 'En plus des comptes indépendants pour les partenaires externes.', amountHt: 1200, origin: 'reference' },
} as const satisfies Record<string, MoneyLine>

export const MOBILE_LINES: MoneyLine[] = [
  { id: 'm-cadrage', label: 'Cadrage et architecture', detail: 'Atelier, arborescence, personas, maquettes des écrans clés, design system mobile, validation avant développement.', amountHt: 1350, origin: 'reference' },
  { id: 'm-cms', label: 'CMS et API', detail: 'Strapi, types de contenu, API documentée, rôles, prévisualisation mobile, journal d’audit, notifications.', amountHt: 4050, origin: 'reference' },
  { id: 'm-app', label: 'Application mobile', detail: 'Flutter, navigation, recherche, favoris, mode hors ligne, partage, notifications, compte facultatif. iOS 15+ et Android 8+.', amountHt: 9000, origin: 'reference' },
  { id: 'm-stats', label: 'Tableau de bord, statistiques et RGPD', detail: 'Indicateurs d’usage, Matomo auto-hébergé, exports, consentement, clause de sous-traitance, registre.', amountHt: 3600, origin: 'reference' },
  { id: 'm-deploy', label: 'Déploiement, tests et documentation', detail: 'Bêta, essais sur terminaux représentatifs, publication sur les stores, guides, pipeline.', amountHt: 2250, origin: 'reference' },
  { id: 'm-infra', label: 'Infrastructure et hébergement de mise en service', detail: 'Production et préproduction en France, sauvegardes, supervision, chiffrement.', amountHt: 600, origin: 'reference' },
  { id: 'm-escrow', label: 'Séquestre du code, première année', detail: 'Dépôt et clause d’accès au profit du commanditaire.', amountHt: 645, origin: 'reference' },
]

export const MOBILE_OPTIONS = {
  agenda: { id: 'agenda', label: 'Agenda et fiche événement', detail: 'Module optionnel, en plus du socle mobile.', amountHt: 1350, origin: 'reference' },
  pentest: { id: 'pentest', label: 'Audit d’intrusion', detail: 'Test d’intrusion ponctuel, en option.', amountHt: 3500, origin: 'reference' },
} as const satisfies Record<string, MoneyLine>

export const WEB_SOCLE: MoneyLine[] = [
  MOBILITE[0]!,
  { id: 'socle-web', label: 'Socle applicatif', detail: 'Comptes, droits, contenus et affichage mobile. Repris des socles déjà chiffrés, sans module visio ni IA.', amountHt: 4000, origin: 'reference' },
  MOBILITE[6]!,
]

export const VITRINE: MoneyLine[] = [
  { id: 'v-cadrage', label: 'Cadrage', detail: `2 jours × ${DAY_RATE_HT} €. Aucun forfait « site vitrine » dans les références.`, amountHt: 900, origin: 'tjm' },
  { id: 'v-realisation', label: 'Réalisation', detail: `6 jours × ${DAY_RATE_HT} €. Pages, formulaire et mise en ligne.`, amountHt: 2700, origin: 'tjm' },
  { id: 'v-service', label: 'Mise en service', detail: `1 jour × ${DAY_RATE_HT} €. Recette et passation.`, amountHt: 450, origin: 'tjm' },
]

export const BOUTIQUE: MoneyLine[] = [
  { id: 'b-cadrage', label: 'Cadrage', detail: `3 jours × ${DAY_RATE_HT} €. Aucun forfait e-commerce dans les références.`, amountHt: 1350, origin: 'tjm' },
  { id: 'b-catalogue', label: 'Catalogue, panier et commande', detail: `12 jours × ${DAY_RATE_HT} €.`, amountHt: 5400, origin: 'tjm' },
  { id: 'b-paiement', label: 'Paiement', detail: `4 jours × ${DAY_RATE_HT} €.`, amountHt: 1800, origin: 'tjm' },
  { id: 'b-service', label: 'Mise en service', detail: `2 jours × ${DAY_RATE_HT} €.`, amountHt: 900, origin: 'tjm' },
]

export const MAINTENANCE_BY_TOTAL: Record<number, number> = {
  7000: 900,
  19500: 2450,
  25000: 3150,
  21495: 2700,
}

export const STACKS = {
  visio: [
    { layer: 'Interface', choice: 'Next.js', why: 'Site et espace connecté, le même socle que les plateformes web déjà livrées.' },
    { layer: 'API', choice: 'NestJS', why: 'Règles métier, comptes et sessions isolés de l’interface.' },
    { layer: 'Données', choice: 'PostgreSQL', why: 'Données relationnelles, sauvegardes, hébergement en France.' },
    { layer: 'Visio', choice: 'LiveKit auto-hébergé', why: 'Salles, partage d’écran et audio faible débit, sans dépendre d’un service de visio tiers.' },
    { layer: 'IA', choice: 'Modèles locaux, circuit fermé', why: 'Traduction et transcription sur un serveur du projet. Les contenus ne partent pas vers un service d’IA grand public.' },
    { layer: 'Hébergement', choice: 'France, GPU à la demande', why: 'Le serveur GPU ne tourne que pour les sessions planifiées, sauf choix d’un service permanent.' },
  ],
  mobile: [
    { layer: 'Application', choice: 'Flutter', why: 'Une base de code pour iOS et Android, hors ligne compris.' },
    { layer: 'Back-office', choice: 'Strapi', why: 'Rédaction des contenus, rôles, médias et API.' },
    { layer: 'Données', choice: 'PostgreSQL', why: 'Contenus et comptes, en France.' },
    { layer: 'Mesure', choice: 'Matomo auto-hébergé', why: 'Statistiques sans outil publicitaire tiers.' },
    { layer: 'Hors ligne', choice: 'SQLite ou Hive', why: 'Lecture et favoris sans réseau.' },
    { layer: 'Hébergement', choice: 'Scaleway, France', why: 'Production et préproduction, sauvegardes et chiffrement.' },
  ],
  web: [
    { layer: 'Interface', choice: 'Next.js', why: 'Pages rapides, formulaire et espace connecté si le périmètre le demande.' },
    { layer: 'Données', choice: 'PostgreSQL', why: 'Dès qu’il y a des comptes ou des contenus structurés.' },
    { layer: 'Hébergement', choice: 'France', why: 'Réversibilité : le commanditaire peut reprendre les abonnements à son nom.' },
  ],
} as const satisfies Record<string, StackChoice[]>

export const METHOD = [
  'Cadrage : le besoin est reformulé, les maquettes sont validées avant d’écrire le code.',
  'Réalisation par incréments, avec une recette à chaque jalon.',
  'Sécurité et RGPD traités dans le périmètre, pas en fin de projet.',
  'Formation, guides, et cession du code au commanditaire.',
  'Garantie de 30 jours sur les anomalies après chaque livraison.',
]

export const SECURITY = [
  'Hébergement en France. SecNumCloud lorsque les données ou l’IA l’exigent.',
  'Les contenus métier ne sont pas envoyés à un service d’IA grand public.',
  'Le code développé est cédé. Aucune dépendance propre à l’agence sans accord écrit.',
  'Sous-traitance documentée, minimisation des données, droits des personnes.',
  'Sauvegardes, chiffrement des échanges, journal d’audit sur les actions sensibles.',
]

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function vatFromHt(amountHt: number): { vat: number; ttc: number } {
  const htCents = Math.round(amountHt * 100)
  const ttcCents = Math.round(htCents * (1 + 0.085))
  return { vat: (ttcCents - htCents) / 100, ttc: ttcCents / 100 }
}

export function sumLines(lines: readonly MoneyLine[]): number {
  return lines.reduce((total, line) => total + line.amountHt, 0)
}
