const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000

export function takeToken(key: string, limit: number, now = Date.now()): { ok: boolean; retryAfterSeconds: number } {
  if (hits.size > 5_000) hits.clear()
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS)
  const oldest = recent[0]
  if (recent.length >= limit && oldest !== undefined) {
    hits.set(key, recent)
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)) }
  }
  recent.push(now)
  hits.set(key, recent)
  return { ok: true, retryAfterSeconds: 0 }
}

export function resetRateLimit(): void {
  hits.clear()
}
