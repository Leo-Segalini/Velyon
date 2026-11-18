import { contrastRatio, ensureContrast, wcagLevel } from '@/lib/color/contrast'
import type { ResolvedBrand, StandardColorRole } from '@/lib/brand/types'

export type ContrastPair = {
  id: string
  foreground: string
  foregroundHex: string
  background: string
  backgroundHex: string
  ratio: number
  level: ReturnType<typeof wcagLevel>
  suggestion: string
  critical: boolean
}

const PAIR_ROLES: { foreground: StandardColorRole | 'paper'; background: StandardColorRole; critical: boolean }[] = [
  { foreground: 'text', background: 'background', critical: true },
  { foreground: 'text', background: 'surface', critical: true },
  { foreground: 'text', background: 'accent', critical: false },
  { foreground: 'textSecondary', background: 'background', critical: true },
  { foreground: 'textSecondary', background: 'surface', critical: true },
  { foreground: 'paper', background: 'text', critical: true },
  { foreground: 'paper', background: 'primary', critical: false },
  { foreground: 'text', background: 'primary', critical: false },
  { foreground: 'paper', background: 'success', critical: true },
  { foreground: 'paper', background: 'error', critical: true },
  { foreground: 'paper', background: 'warning', critical: true },
]

export function contrastPairs(brand: ResolvedBrand): ContrastPair[] {
  return PAIR_ROLES.flatMap((pair) => {
    const background = brand.colorsByRole[pair.background]
    if (!background) return []
    const foregroundHex = pair.foreground === 'paper' ? '#FFFFFF' : brand.colorsByRole[pair.foreground]?.hex
    const foregroundName = pair.foreground === 'paper' ? 'Blanc' : brand.colorsByRole[pair.foreground]?.name
    if (!foregroundHex || !foregroundName) return []
    const ratio = contrastRatio(foregroundHex, background.hex)
    return [
      {
        id: `${pair.foreground}-on-${pair.background}`,
        foreground: foregroundName,
        foregroundHex,
        background: background.name,
        backgroundHex: background.hex,
        ratio,
        level: wcagLevel(ratio),
        suggestion: ensureContrast(foregroundHex, background.hex),
        critical: pair.critical,
      },
    ]
  })
}

export type ComplianceItem = {
  id: string
  label: string
  ok: boolean
  detail: string
}

export function complianceChecks(brand: ResolvedBrand): ComplianceItem[] {
  const text = brand.colorsByRole.text?.hex ?? '#000000'
  const background = brand.colorsByRole.background?.hex ?? '#FFFFFF'
  const ratio = contrastRatio(text, background)
  const failing = contrastPairs(brand).filter((pair) => pair.critical && pair.level === 'fail')
  return [
    {
      id: 'logo',
      label: 'Logo principal fourni',
      ok: Boolean(brand.logoSrc),
      detail: brand.logoSrc ? 'Fichier de logo présent.' : 'Importer un logo.',
    },
    {
      id: 'palette',
      label: 'Rôles chromatiques couverts',
      ok: !brand.warnings.some((warning) => warning.includes('manquante')),
      detail: brand.warnings.some((warning) => warning.includes('manquante'))
        ? 'Au moins un rôle utilise une couleur de repli.'
        : 'Chaque rôle a une teinte nommée.',
    },
    {
      id: 'contrast',
      label: 'Texte principal sur le fond',
      ok: ratio >= 4.5,
      detail: ratio >= 4.5 ? 'Le couple atteint au moins AA.' : 'Renforcer le contraste du texte ou du fond.',
    },
    {
      id: 'pairs',
      label: 'Associations clés texte / fond',
      ok: failing.length === 0,
      detail: failing.length === 0 ? 'Les associations contrôlées sont conformes.' : `${failing.length} association(s) sous le seuil AA.`,
    },
    {
      id: 'fonts',
      label: 'Rôles typographiques attribués',
      ok: ['heading', 'body', 'mono'].every((role) => brand.fonts.some((font) => font.role === role)),
      detail: 'Titres, corps et chiffres ont une famille.',
    },
    {
      id: 'license',
      label: 'Droits sur les polices confirmés',
      ok: brand.licenseConfirmed,
      detail: brand.licenseConfirmed ? 'La confirmation est enregistrée.' : 'La case de droits reste à cocher.',
    },
    {
      id: 'version',
      label: 'Version et date présentes',
      ok: Boolean(brand.version && brand.dateLabel),
      detail: `${brand.version} — ${brand.dateLabel}`,
    },
  ]
}
