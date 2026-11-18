import { NextResponse } from 'next/server'
import { z } from 'zod'
import { chatSystem, historyText, keepsPrices, planTurn } from '@/lib/ai/chat'
import { speak, writeNarrative } from '@/lib/ai/narrative'
import { buildTexts } from '@/lib/knowledge/documents'
import { takeToken } from '@/server/rate-limit'

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
})

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(30),
}).refine((value) => value.messages.at(-1)?.role === 'user', {
  message: 'Le dernier message doit venir de vous.',
})

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const limit = takeToken(`chat:${ip}`, 20)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Trop de messages. Réessayez dans une minute.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfterSeconds) } },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Le corps de la requête n’est pas un JSON valide.' }, { status: 400 })
  }

  const parsed = RequestSchema.safeParse(payload)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Données invalides.'
    return NextResponse.json({ error: message }, { status: 422 })
  }

  const messages = parsed.data.messages
  const plan = planTurn(messages)
  let message = plan.text
  let source: 'modele' | 'grille' = 'grille'
  let warning: string | null = null

  if (plan.estimate) {
    try {
      const spoken = await speak(chatSystem(plan.estimate), historyText(messages))
      if (spoken && keepsPrices(spoken.text, plan.estimate)) {
        message = spoken.text
        source = 'modele'
      } else if (spoken) {
        warning = 'Un montant hors référence a été écarté. La réponse suit les forfaits déjà pratiqués.'
      }
    } catch {
      warning = 'Le modèle n’a pas répondu. La réponse suit les forfaits déjà pratiqués.'
    }
  }

  let documents: {
    title: string
    cahierDesCharges: string
    propositionTechnique: string
    propositionFinanciere: string
  } | null = null

  if (plan.attachDocuments && plan.request && plan.estimate) {
    const written = await writeNarrative(plan.request, plan.estimate)
    const texts = buildTexts(plan.request, plan.estimate, written.narrative)
    documents = { title: written.narrative.title, ...texts }
    if (written.warning && !warning) warning = written.warning
  }

  return NextResponse.json({ message, source, warning, documents })
}
