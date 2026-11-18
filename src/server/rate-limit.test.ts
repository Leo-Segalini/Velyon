import { describe, expect, it } from 'vitest'
import { resetRateLimit, takeToken } from '@/server/rate-limit'

describe('limite de débit', () => {
  it('bloque au-delà du quota sur la même clé', () => {
    resetRateLimit()
    const now = 1_700_000_000_000
    expect(takeToken('pdf-test', 2, now).ok).toBe(true)
    expect(takeToken('pdf-test', 2, now + 10).ok).toBe(true)
    expect(takeToken('pdf-test', 2, now + 20).ok).toBe(false)
    expect(takeToken('autre', 2, now + 20).ok).toBe(true)
  })
})
