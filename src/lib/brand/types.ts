import type { SectionId } from '@/lib/brand/catalog'

export const COLOR_ROLES = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text',
  'textSecondary',
  'border',
  'success',
  'error',
  'warning',
] as const

export type StandardColorRole = (typeof COLOR_ROLES)[number]
export type ColorRole = StandardColorRole | 'custom'

export type BrandColor = {
  id: string
  name: string
  role: ColorRole
  hex: string
  usage: string
}

export type FontRole = 'heading' | 'body' | 'mono' | 'fallback'

export type BrandFont = {
  role: FontRole
  family: string
  weights: number[]
  usage: string
}

export type TypeScaleStep = {
  id: string
  label: string
  sizePx: number
  weight: number
  lineHeight: number
  letterSpacingEm: number
  sample: string
  fontRole: 'heading' | 'body' | 'mono'
}

export type BrandGradient = {
  name: string
  css: string
  usage: string
}

export type BrandTemplate = 'classique' | 'editorial' | 'minimal'
export type BrandFormat = 'landscape' | 'portrait'
export type BrandLanguage = 'fr' | 'en'

export type BrandCopy = {
  identity: string
  logo: string
  palette: string
  typography: string
  principles: string[]
}

export type BrandDocument = {
  name: string
  baseline: string
  sector: string
  description: string
  values: string[]
  language: BrandLanguage
  version: string
  dateLabel: string
  logoSrc: string
  logoMarkSrc: string
  logoAlt: string
  logoWidth: number
  logoHeight: number
  markWidth: number
  markHeight: number
  minWidthWithBaselinePx: number
  clearSpaceLabel: string
  colors: BrandColor[]
  gradients: BrandGradient[]
  fonts: BrandFont[]
  typeScale: TypeScaleStep[]
  template: BrandTemplate
  format: BrandFormat
  enabledSections: SectionId[]
  watermark: boolean
  licenseConfirmed: boolean
  copy: BrandCopy
  grid: {
    containerPx: number
    columns: number
    gutterPx: number
    radiusSmPx: number
    radiusMdPx: number
  }
}

export type ResolvedBrand = BrandDocument & {
  colorsByRole: Partial<Record<StandardColorRole, BrandColor>>
  warnings: string[]
  cssVariables: Record<string, string>
}
