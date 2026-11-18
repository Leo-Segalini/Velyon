export const SECTION_IDS = [
  'cover',
  'toc',
  'identity',
  'logo',
  'clearance',
  'misuse',
  'palette',
  'gradients',
  'accessibility',
  'combinations',
  'typography',
  'typeScale',
  'grid',
  'icons',
  'components',
  'documents',
  'tokens',
  'checklist',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

export type CatalogEntry = {
  id: SectionId
  toc: boolean
  fr: string
  en: string
}

export const CATALOG: readonly CatalogEntry[] = [
  { id: 'cover', toc: false, fr: 'Couverture', en: 'Cover' },
  { id: 'toc', toc: false, fr: 'Sommaire', en: 'Contents' },
  { id: 'identity', toc: true, fr: 'Identité de marque', en: 'Brand identity' },
  { id: 'logo', toc: true, fr: 'Logotype', en: 'Logotype' },
  { id: 'clearance', toc: true, fr: 'Zone de protection et tailles minimales', en: 'Clear space and minimum sizes' },
  { id: 'misuse', toc: true, fr: 'Usages interdits', en: 'Incorrect logo use' },
  { id: 'palette', toc: true, fr: 'Palette chromatique', en: 'Colour palette' },
  { id: 'gradients', toc: true, fr: 'Équilibre des teintes et dégradés', en: 'Balance and gradients' },
  { id: 'accessibility', toc: true, fr: 'Accessibilité', en: 'Accessibility' },
  { id: 'combinations', toc: true, fr: 'Combinaisons texte et fond', en: 'Text and background combinations' },
  { id: 'typography', toc: true, fr: 'Typographie', en: 'Typography' },
  { id: 'typeScale', toc: true, fr: 'Échelle typographique', en: 'Type scale' },
  { id: 'grid', toc: true, fr: 'Grille, espacements et surfaces', en: 'Grid, spacing and surfaces' },
  { id: 'icons', toc: true, fr: 'Iconographie', en: 'Iconography' },
  { id: 'components', toc: true, fr: 'Composants d’interface', en: 'UI components' },
  { id: 'documents', toc: true, fr: 'Documents types', en: 'Sample documents' },
  { id: 'tokens', toc: true, fr: 'Design tokens', en: 'Design tokens' },
  { id: 'checklist', toc: true, fr: 'Check-list de conformité', en: 'Compliance checklist' },
]

export function activeSections(enabled: readonly SectionId[]): CatalogEntry[] {
  const selected = new Set(enabled)
  return CATALOG.filter((entry) => selected.has(entry.id))
}

export function sectionTitle(id: SectionId, language: 'fr' | 'en'): string {
  const entry = CATALOG.find((item) => item.id === id)
  if (!entry) return id
  return language === 'en' ? entry.en : entry.fr
}
