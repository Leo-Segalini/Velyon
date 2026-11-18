import { parseHex } from '@/lib/color/color'
import { suggestForeground } from '@/lib/color/contrast'
import { activeSections } from '@/lib/brand/catalog'
import { FALLBACK_COLORS, ROLE_VARIABLE } from '@/lib/brand/fallbacks'
import { safeFamily } from '@/lib/brand/fonts'
import { COLOR_ROLES, type BrandColor, type BrandDocument, type ResolvedBrand, type StandardColorRole } from '@/lib/brand/types'

function roleLabel(role: StandardColorRole): string {
  const labels: Record<StandardColorRole, string> = {
    primary: 'primaire',
    secondary: 'secondaire',
    accent: 'accent',
    background: 'fond',
    surface: 'surface',
    text: 'texte',
    textSecondary: 'texte secondaire',
    border: 'bordure',
    success: 'succès',
    error: 'erreur',
    warning: 'avertissement',
  }
  return labels[role]
}

export function resolveBrand(input: BrandDocument): ResolvedBrand {
  const warnings: string[] = []
  const colors: BrandColor[] = []
  const seenRoles = new Set<StandardColorRole>()

  for (const color of input.colors) {
    const hex = parseHex(color.hex)
    if (!hex) {
      warnings.push(`La couleur « ${color.name} » a un HEX illisible et a été ignorée.`)
      continue
    }
    if (color.role !== 'custom') {
      if (seenRoles.has(color.role)) {
        warnings.push(`Le rôle ${roleLabel(color.role)} est défini deux fois. La première teinte est conservée.`)
        continue
      }
      seenRoles.add(color.role)
    }
    colors.push({ ...color, hex })
  }

  const colorsByRole: Partial<Record<StandardColorRole, BrandColor>> = {}
  for (const role of COLOR_ROLES) {
    const found = colors.find((color) => color.role === role)
    if (found) {
      colorsByRole[role] = found
      continue
    }
    const fallback = FALLBACK_COLORS[role]
    colors.push(fallback)
    colorsByRole[role] = fallback
    warnings.push(`Couleur « ${roleLabel(role)} » manquante : repli ${fallback.hex} appliqué.`)
  }

  if (!input.logoSrc) warnings.push('Aucun logo n’est fourni. Les planches logotype resteront vides.')
  if (!input.licenseConfirmed) {
    warnings.push('Les droits d’utilisation des polices ne sont pas confirmés.')
  }
  for (const role of ['heading', 'body', 'mono'] as const) {
    if (!input.fonts.some((font) => font.role === role && font.family.trim())) {
      warnings.push(`Police « ${role} » manquante : une famille de repli sera utilisée.`)
    }
  }
  if (activeSections(input.enabledSections).length === 0) {
    warnings.push('Aucune section n’est activée.')
  }

  const cssVariables: Record<string, string> = {}
  for (const role of COLOR_ROLES) {
    const color = colorsByRole[role]
    if (!color) continue
    cssVariables[ROLE_VARIABLE[role]] = color.hex
  }
  const text = colorsByRole.text?.hex ?? FALLBACK_COLORS.text.hex
  const background = colorsByRole.background?.hex ?? FALLBACK_COLORS.background.hex
  const primary = colorsByRole.primary?.hex ?? FALLBACK_COLORS.primary.hex
  const accent = colorsByRole.accent?.hex ?? FALLBACK_COLORS.accent.hex
  cssVariables['--brand-on-text'] = suggestForeground(text)
  cssVariables['--brand-on-background'] = suggestForeground(background)
  cssVariables['--brand-on-primary'] = suggestForeground(primary)
  cssVariables['--brand-on-accent'] = suggestForeground(accent)

  const heading = input.fonts.find((font) => font.role === 'heading')?.family
  const body = input.fonts.find((font) => font.role === 'body')?.family
  const mono = input.fonts.find((font) => font.role === 'mono')?.family
  cssVariables['--brand-font-heading'] = `"${safeFamily(heading || 'sans-serif')}", sans-serif`
  cssVariables['--brand-font-body'] = `"${safeFamily(body || 'sans-serif')}", sans-serif`
  cssVariables['--brand-font-mono'] = `"${safeFamily(mono || 'monospace')}", ui-monospace, monospace`
  cssVariables['--brand-radius-sm'] = `${input.grid.radiusSmPx}px`
  cssVariables['--brand-radius-md'] = `${input.grid.radiusMdPx}px`

  return { ...input, colors, colorsByRole, warnings, cssVariables }
}
