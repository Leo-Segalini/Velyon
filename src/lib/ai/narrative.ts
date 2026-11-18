import { z } from 'zod'
import { fallbackNarrative } from '@/lib/knowledge/documents'
import type { DossierRequest, Estimate, Narrative, ProviderName } from '@/lib/knowledge/types'

const NarrativeSchema = z.object({
  title: z.string().trim().min(3).max(140),
  context: z.string().trim().min(40).max(1600),
  objectives: z.array(z.string().trim().min(3).max(280)).min(3).max(6),
  vigilance: z.array(z.string().trim().min(3).max(400)).min(2).max(6),
  functionalScope: z.array(z.object({
    title: z.string().trim().min(3).max(140),
    detail: z.string().trim().min(10).max(600),
  })).min(3).max(8),
  technicalRequirements: z.array(z.string().trim().min(8).max(360)).min(3).max(8),
  method: z.array(z.string().trim().min(8).max(280)).min(3).max(7),
  security: z.array(z.string().trim().min(8).max(280)).min(3).max(6),
})

export type NarrativeResult = {
  narrative: Narrative
  source: 'modele' | 'grille'
  provider: ProviderName | null
  warning: string | null
}

export async function writeNarrative(input: DossierRequest, estimate: Estimate): Promise<NarrativeResult> {
  const fallback = fallbackNarrative(input, estimate)
  const selected = selectProvider()
  if (!selected) {
    return {
      narrative: fallback,
      source: 'grille',
      provider: null,
      warning: 'Aucune clé Gemini, Mistral ou Claude n’est configurée. Le dossier suit la grille et votre description, sans rédaction par un modèle.',
    }
  }

  try {
    const raw = await complete(selected, systemPrompt(estimate), userPrompt(input, estimate), 'json')
    const parsed = NarrativeSchema.parse(extractJson(raw))
    return { narrative: parsed, source: 'modele', provider: selected.name, warning: null }
  } catch {
    return {
      narrative: fallback,
      source: 'grille',
      provider: selected.name,
      warning: `Le modèle ${selected.name} n’a pas renvoyé un texte exploitable. Le dossier suit la grille et votre description. Les montants n’ont pas été inventés.`,
    }
  }
}

function systemPrompt(estimate: Estimate): string {
  const stack = estimate.stack.map((item) => `${item.layer} : ${item.choice}`).join(' ; ')
  return [
    'Tu rédiges un dossier d’avant-vente pour une agence digitale à La Réunion.',
    'Tu réponds uniquement par un objet JSON, sans markdown.',
    'Tu n’inventes aucun prix, aucun délai chiffré, aucun nom de client passé.',
    'Tu ne cites pas de technologie absente de la pile imposée.',
    `Pile imposée : ${stack}.`,
    'Français, vouvoiement, phrases concrètes. Si le besoin est flou, tu le dis dans vigilance.',
    'Clés JSON : title, context, objectives, vigilance, functionalScope (objets title et detail), technicalRequirements, method, security.',
  ].join('\n')
}

function userPrompt(input: DossierRequest, estimate: Estimate): string {
  return [
    `Commanditaire : ${input.clientName || 'non précisé'}.`,
    `Échéance : ${input.deadline || 'non précisée'}.`,
    `Formule déjà chiffrée, à ne pas modifier : ${estimate.formulaName}.`,
    'Besoin :',
    input.brief,
  ].join('\n')
}

type Selected = { name: ProviderName; key: string; model: string }

function selectProvider(): Selected | null {
  const gemini = envKey('GEMINI_API_KEY')
  const mistral = envKey('MISTRAL_API_KEY')
  const anthropic = envKey('ANTHROPIC_API_KEY')
  const asked = process.env.AI_PROVIDER?.trim().toLowerCase()
  const available: Selected[] = []
  if (gemini) available.push({ name: 'gemini', key: gemini, model: process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash' })
  if (mistral) available.push({ name: 'mistral', key: mistral, model: process.env.MISTRAL_MODEL?.trim() || 'mistral-small-latest' })
  if (anthropic) available.push({ name: 'anthropic', key: anthropic, model: process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-5' })
  if (asked === 'gemini' || asked === 'mistral' || asked === 'anthropic') {
    return available.find((item) => item.name === asked) ?? null
  }
  return available[0] ?? null
}

export async function speak(system: string, user: string): Promise<{ text: string; provider: ProviderName } | null> {
  const selected = selectProvider()
  if (!selected) return null
  const text = (await complete(selected, system, user, 'text')).trim()
  if (!text) throw new Error('vide')
  return { text, provider: selected.name }
}

async function complete(selected: Selected, system: string, user: string, mode: 'json' | 'text' = 'json'): Promise<string> {
  const timeout = AbortSignal.timeout(25_000)
  if (selected.name === 'gemini') return completeGemini(selected, system, user, timeout, mode)
  if (selected.name === 'mistral') return completeMistral(selected, system, user, timeout, mode)
  return completeAnthropic(selected, system, user, timeout)
}

async function completeGemini(selected: Selected, system: string, user: string, signal: AbortSignal, mode: 'json' | 'text'): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selected.model)}:generateContent?key=${encodeURIComponent(selected.key)}`
  const response = await fetch(url, {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: mode === 'json'
        ? { temperature: 0.2, responseMimeType: 'application/json' }
        : { temperature: 0.4 },
    }),
  })
  if (!response.ok) throw new Error('gemini')
  const payload = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''
  if (!text) throw new Error('gemini-vide')
  return text
}

async function completeMistral(selected: Selected, system: string, user: string, signal: AbortSignal, mode: 'json' | 'text'): Promise<string> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${selected.key}` },
    body: JSON.stringify({
      model: selected.model,
      temperature: mode === 'json' ? 0.2 : 0.4,
      ...(mode === 'json' ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!response.ok) throw new Error('mistral')
  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  const text = payload.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('mistral-vide')
  return text
}

async function completeAnthropic(selected: Selected, system: string, user: string, signal: AbortSignal): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': selected.key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: selected.model,
      max_tokens: 2500,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!response.ok) throw new Error('anthropic')
  const payload = (await response.json()) as { content?: { text?: string }[] }
  const text = payload.content?.map((block) => block.text ?? '').join('') ?? ''
  if (!text) throw new Error('anthropic-vide')
  return text
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced?.[1] ?? text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('json')
  return JSON.parse(raw.slice(start, end + 1)) as unknown
}

function envKey(name: string): string | null {
  const value = process.env[name]?.trim()
  return value ? value : null
}
