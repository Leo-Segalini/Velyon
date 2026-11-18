/** Retire tout caractère qui pourrait casser une déclaration CSS. */
export function safeFamily(family: string): string {
  const cleaned = family.replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, ' ').trim()
  return cleaned.slice(0, 80)
}

export function loadedFamily(family: string, generic: string): string {
  const safe = safeFamily(family)
  return `"${safe || generic}", ${generic}`
}

export function fontOverridesFor(fonts: { role: string; family: string }[]): Record<string, string> {
  const family = (role: string, generic: string) =>
    loadedFamily(fonts.find((font) => font.role === role)?.family ?? generic, generic)
  return {
    '--brand-font-heading': family('heading', 'sans-serif'),
    '--brand-font-body': family('body', 'sans-serif'),
    '--brand-font-mono': family('mono', 'monospace'),
  }
}
