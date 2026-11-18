export type Rgb = { r: number; g: number; b: number }
export type Hsl = { h: number; s: number; l: number }
export type Cmyk = { c: number; m: number; y: number; k: number }

const SHORT_HEX = /^#?[0-9a-fA-F]{3}$/
const LONG_HEX = /^#?[0-9a-fA-F]{6}$/

export function parseHex(input: string): string | null {
  const value = input.trim()
  if (SHORT_HEX.test(value)) {
    const body = value.replace('#', '')
    const [r, g, b] = body.split('')
    if (!r || !g || !b) return null
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  if (LONG_HEX.test(value)) {
    return `#${value.replace('#', '').toUpperCase()}`
  }
  return null
}

export function hexToRgb(hex: string): Rgb {
  const normalized = parseHex(hex)
  if (!normalized) {
    throw new Error(`Couleur HEX invalide : ${hex}`)
  }
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const channel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase()
}

export function mixHex(from: string, to: string, amount: number): string {
  const start = hexToRgb(from)
  const end = hexToRgb(to)
  const mix = (a: number, b: number) => a + (b - a) * amount
  return rgbToHex(mix(start.r, end.r), mix(start.g, end.g), mix(start.b, end.b))
}

const LIGHT_MIX: Record<number, number> = { 100: 0.86, 200: 0.68, 300: 0.48, 400: 0.26 }
const DARK_MIX: Record<number, number> = { 600: 0.14, 700: 0.28, 800: 0.44, 900: 0.62 }

export const SHADE_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const
export type ShadeStep = (typeof SHADE_STEPS)[number]

export function shades(hex: string): Record<ShadeStep, string> {
  const base = parseHex(hex)
  if (!base) throw new Error(`Couleur HEX invalide : ${hex}`)
  return {
    100: mixHex(base, '#FFFFFF', LIGHT_MIX[100] ?? 0),
    200: mixHex(base, '#FFFFFF', LIGHT_MIX[200] ?? 0),
    300: mixHex(base, '#FFFFFF', LIGHT_MIX[300] ?? 0),
    400: mixHex(base, '#FFFFFF', LIGHT_MIX[400] ?? 0),
    500: base,
    600: mixHex(base, '#000000', DARK_MIX[600] ?? 0),
    700: mixHex(base, '#000000', DARK_MIX[700] ?? 0),
    800: mixHex(base, '#000000', DARK_MIX[800] ?? 0),
    900: mixHex(base, '#000000', DARK_MIX[900] ?? 0),
  }
}

export function rgbToHsl(r: number, g: number, b: number): Hsl {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2
  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) }
  }
  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0
  if (max === red) hue = ((green - blue) / delta) % 6
  else if (max === green) hue = (blue - red) / delta + 2
  else hue = (red - green) / delta + 4
  hue = Math.round(hue * 60)
  if (hue < 0) hue += 360
  return { h: hue, s: Math.round(saturation * 100), l: Math.round(lightness * 100) }
}

/** Conversion indicative pour l'impression. Ce n'est pas un profil ICC. */
export function rgbToCmyk(r: number, g: number, b: number): Cmyk {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const k = 1 - Math.max(red, green, blue)
  if (k >= 0.999) return { c: 0, m: 0, y: 0, k: 100 }
  const scale = (value: number) => Math.round(((1 - value - k) / (1 - k)) * 100)
  return { c: scale(red), m: scale(green), y: scale(blue), k: Math.round(k * 100) }
}

export function formatRgb(rgb: Rgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export function formatHsl(hsl: Hsl): string {
  return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`
}

export function formatCmyk(cmyk: Cmyk): string {
  return `C${cmyk.c} M${cmyk.m} J${cmyk.y} N${cmyk.k}`
}
