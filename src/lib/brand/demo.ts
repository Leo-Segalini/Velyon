import { SECTION_IDS } from '@/lib/brand/catalog'
import type { BrandDocument } from '@/lib/brand/types'

export const demoBrand: BrandDocument = {
  name: 'Velyon',
  baseline: 'Donnez vie à vos projets à la vitesse de l’IA',
  sector: 'Logiciel — identité visuelle',
  description:
    'Velyon assemble une charte graphique professionnelle à partir du logo, des couleurs et des polices. La vélocité d’exécution reste tenue par la clarté du document.',
  values: ['Vélocité', 'Clarté', 'Rigueur', 'Confiance'],
  language: 'fr',
  version: '1.0',
  dateLabel: '18 novembre 2026',
  logoSrc: '/brand/logo-velyon.png',
  logoMarkSrc: '/brand/logo-mark.png',
  logoAlt: 'Velyon — Donnez vie à vos projets à la vitesse de l’IA',
  logoWidth: 851,
  logoHeight: 291,
  markWidth: 280,
  markHeight: 291,
  minWidthWithBaselinePx: 140,
  clearSpaceLabel: 'Marge minimale = hauteur de la lettre V',
  colors: [
    { id: 'palm', name: 'Palm Leaf', role: 'primary', hex: '#92977E', usage: 'Filets actifs, états sélectionnés, en-têtes.' },
    { id: 'olive', name: 'Olive secondaire', role: 'secondary', hex: '#6E7358', usage: 'Appuis secondaires et légendes fortes.' },
    { id: 'gold', name: 'Light Gold', role: 'accent', hex: '#E6E18F', usage: 'Badges, surbrillance et action secondaire.' },
    { id: 'cornsilk', name: 'Cornsilk', role: 'background', hex: '#FFFAE2', usage: 'Fond de page et couverture.' },
    { id: 'paper', name: 'Blanc pur', role: 'surface', hex: '#FFFFFF', usage: 'Cartes, factures, fonds de logo principal.' },
    { id: 'ink', name: 'Deep Olive Charcoal', role: 'text', hex: '#26291E', usage: 'Titres, corps de texte et boutons principaux.' },
    { id: 'sage', name: 'Muted Sage', role: 'textSecondary', hex: '#5C614D', usage: 'Légendes, métadonnées et pieds de page.' },
    { id: 'line', name: 'Vanilla Custard 2', role: 'border', hex: '#EADDA6', usage: 'Séparateurs, contours de cartes et de champs.' },
    { id: 'success', name: 'Olive succès', role: 'success', hex: '#1B6B43', usage: 'Confirmation. Texte blanc sur cette teinte.' },
    { id: 'error', name: 'Terre cuite', role: 'error', hex: '#8E2E2A', usage: 'Erreur et usages interdits. Texte blanc.' },
    { id: 'warning', name: 'Bronze', role: 'warning', hex: '#7A4E0D', usage: 'Avertissement. Texte blanc.' },
    { id: 'surface-ia', name: 'Vanilla Custard', role: 'custom', hex: '#FEFCAD', usage: 'Encarts d’information et infobulles.' },
  ],
  gradients: [
    {
      name: 'Gradient Brand',
      css: 'linear-gradient(135deg, #92977E 0%, #E6E18F 50%, #EADDA6 100%)',
      usage: 'Bandeau de couverture et barres de progression.',
    },
    {
      name: 'Gradient Soft Canvas',
      css: 'linear-gradient(180deg, #FFFAE2 0%, #FEFCAD 100%)',
      usage: 'Fond de hero et encarts légers.',
    },
  ],
  fonts: [
    { role: 'heading', family: 'Plus Jakarta Sans', weights: [500, 600, 700], usage: 'Titres, navigation et interface.' },
    { role: 'body', family: 'Inter', weights: [400, 500, 600], usage: 'Textes courants et spécifications.' },
    { role: 'mono', family: 'JetBrains Mono', weights: [500, 700], usage: 'Chiffres tabulaires, codes couleur et jetons.' },
    { role: 'fallback', family: 'sans-serif', weights: [400], usage: 'Repli si une famille ne se charge pas.' },
  ],
  typeScale: [
    { id: 'h1', label: 'Titre 1', sizePx: 44, weight: 700, lineHeight: 1.15, letterSpacingEm: -0.03, sample: 'Charte graphique', fontRole: 'heading' },
    { id: 'h2', label: 'Titre 2', sizePx: 32, weight: 600, lineHeight: 1.2, letterSpacingEm: -0.02, sample: 'Palette chromatique', fontRole: 'heading' },
    { id: 'h3', label: 'Titre 3', sizePx: 20, weight: 600, lineHeight: 1.3, letterSpacingEm: -0.01, sample: 'Zone de protection', fontRole: 'heading' },
    { id: 'body', label: 'Corps', sizePx: 16, weight: 400, lineHeight: 1.6, letterSpacingEm: 0, sample: 'Le texte courant se lit longtemps, sans fatigue.', fontRole: 'body' },
    { id: 'label', label: 'Label', sizePx: 13, weight: 500, lineHeight: 1.4, letterSpacingEm: 0.01, sample: 'Version du document', fontRole: 'body' },
    { id: 'caption', label: 'Légende', sizePx: 12, weight: 400, lineHeight: 1.4, letterSpacingEm: 0, sample: 'CMJN indicatif, hors profil impression.', fontRole: 'body' },
    { id: 'figure', label: 'Chiffre', sizePx: 18, weight: 700, lineHeight: 1.2, letterSpacingEm: 0, sample: '01    4,50    18', fontRole: 'mono' },
  ],
  template: 'classique',
  format: 'landscape',
  enabledSections: [...SECTION_IDS],
  watermark: false,
  licenseConfirmed: true,
  copy: {
    identity:
      'Velyon réunit la vitesse d’exécution et la rigueur d’un document d’agence. L’identité s’éloigne des bleus froids pour une palette organique, lisible et institutionnelle.',
    logo:
      'Le symbole est un V ascendant. Il se pose à gauche du mot-symbole. La baseline reste visible tant que le verrouillage dépasse la taille minimale.',
    palette:
      'Cinq teintes signatures s’appuient sur une encre olive très profonde. Cette encre porte les titres, le corps et les boutons, pour tenir le contraste AA.',
    typography:
      'Plus Jakarta Sans porte les titres. Inter porte la lecture longue. JetBrains Mono aligne les chiffres et les codes.',
    principles: [
      'La vitesse ne dispense pas de la lisibilité.',
      'Aucune teinte ni police de marque n’est figée dans le gabarit : tout passe par des variables.',
      'Un contraste se mesure. S’il échoue, le texte change, pas le lecteur.',
    ],
  },
  grid: { containerPx: 1280, columns: 12, gutterPx: 24, radiusSmPx: 8, radiusMdPx: 12 },
}
