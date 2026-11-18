import { hexToRgb, mixHex, parseHex } from '@/lib/color/color'

export const PAPER = '#FFFFFF'
export const INK = '#14160F'

function linearize(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

export function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

export type WcagLevel = 'AAA' | 'AA' | 'fail'

export function wcagLevel(ratio: number, largeText = false): WcagLevel {
  const aaa = largeText ? 4.5 : 7
  const aa = largeText ? 3 : 4.5
  if (ratio >= aaa) return 'AAA'
  if (ratio >= aa) return 'AA'
  return 'fail'
}

export function suggestForeground(background: string): typeof PAPER | typeof INK {
  const onPaper = contrastRatio(PAPER, background)
  const onInk = contrastRatio(INK, background)
  return onPaper >= onInk ? PAPER : INK
}

/**
 * Éclaircit ou assombrit la couleur jusqu'à atteindre le ratio demandé.
 * Si aucune teinte intermédiaire n'y parvient, retombe sur le blanc ou l'encre.
 */
export function ensureContrast(foreground: string, background: string, minimum = 4.5): string {
  const normalized = parseHex(foreground)
  if (!normalized) return suggestForeground(background)
  if (contrastRatio(normalized, background) >= minimum) return normalized

  let current = normalized
  for (let step = 0; step < 24; step += 1) {
    const darker = mixHex(current, '#000000', 0.12)
    const lighter = mixHex(current, '#FFFFFF', 0.12)
    const darkerRatio = contrastRatio(darker, background)
    const lighterRatio = contrastRatio(lighter, background)
    current = darkerRatio >= lighterRatio ? darker : lighter
    if (contrastRatio(current, background) >= minimum) return current
  }
  return suggestForeground(background)
}

export function formatRatio(ratio: number, language: 'fr' | 'en'): string {
  const value = ratio.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${value} : 1`
}
