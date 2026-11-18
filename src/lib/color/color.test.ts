import { describe, expect, it } from 'vitest'
import { formatCmyk, mixHex, parseHex, rgbToCmyk, rgbToHsl, shades } from '@/lib/color/color'
import { hexToRgb } from '@/lib/color/color'

describe('couleurs', () => {
  it('normalise le HEX court et long', () => {
    expect(parseHex('fff')).toBe('#FFFFFF')
    expect(parseHex('#92977e')).toBe('#92977E')
    expect(parseHex('rouge')).toBeNull()
    expect(parseHex('#12345')).toBeNull()
  })

  it('décrit le rouge pur en TSL et CMJN', () => {
    const rgb = hexToRgb('#FF0000')
    expect(rgbToHsl(rgb.r, rgb.g, rgb.b)).toEqual({ h: 0, s: 100, l: 50 })
    expect(rgbToCmyk(0, 0, 0)).toEqual({ c: 0, m: 0, y: 0, k: 100 })
    expect(formatCmyk(rgbToCmyk(255, 255, 255))).toBe('C0 M0 J0 N0')
  })

  it('construit une échelle 100 à 900 autour de la teinte', () => {
    const scale = shades('#336699')
    expect(scale[500]).toBe('#336699')
    expect(scale[100]).not.toBe(scale[900])
    expect(mixHex('#000000', '#FFFFFF', 1)).toBe('#FFFFFF')
  })
})
