import { formatCmyk, formatHsl, formatRgb, hexToRgb, rgbToCmyk, rgbToHsl } from '@/lib/color/color'
import type { ResolvedBrand } from '@/lib/brand/types'

export function renderTokensCss(brand: ResolvedBrand): string {
  const lines = Object.entries(brand.cssVariables).map(([key, value]) => `  ${key}: ${value};`)
  const imports = brand.fonts
    .filter((font) => font.family.trim())
    .map((font) => `/* ${font.role}: ${font.family} */`)
  return ['/* Design tokens — générés, aucune teinte figée dans le gabarit */', ':root {', ...lines, '}', '', ...imports].join('\n')
}

export function renderBrandJson(brand: ResolvedBrand): string {
  const color = (hex: string) => {
    const rgb = hexToRgb(hex)
    return {
      hex,
      rgb: formatRgb(rgb),
      hsl: formatHsl(rgbToHsl(rgb.r, rgb.g, rgb.b)),
      cmyk: formatCmyk(rgbToCmyk(rgb.r, rgb.g, rgb.b)),
    }
  }
  return JSON.stringify(
    {
      name: brand.name,
      baseline: brand.baseline,
      language: brand.language,
      version: brand.version,
      colors: brand.colors.map((entry) => ({
        name: entry.name,
        role: entry.role,
        ...color(entry.hex),
        usage: entry.usage,
      })),
      gradients: brand.gradients,
      fonts: brand.fonts,
      typeScale: brand.typeScale,
      grid: brand.grid,
    },
    null,
    2,
  )
}
