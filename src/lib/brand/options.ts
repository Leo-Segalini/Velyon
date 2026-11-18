import { z } from 'zod'
import type { BrandFormat, BrandTemplate } from '@/lib/brand/types'

export const templateSchema = z.enum(['classique', 'editorial', 'minimal'])
export const formatSchema = z.enum(['landscape', 'portrait'])

export function parseBookOptions(input: { template?: string; format?: string }): {
  template: BrandTemplate
  format: BrandFormat
} {
  const template = templateSchema.safeParse(input.template)
  const format = formatSchema.safeParse(input.format)
  return {
    template: template.success ? template.data : 'classique',
    format: format.success ? format.data : 'landscape',
  }
}
