import { NextRequest, NextResponse } from 'next/server'
import { parseBookOptions } from '@/lib/brand/options'
import { takeToken } from '@/server/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || 'local'
}

export async function GET(request: NextRequest) {
  const limit = takeToken(`pdf:${clientKey(request)}`, 5)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Trop de générations. Réessayez dans quelques secondes.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const options = parseBookOptions({
    template: request.nextUrl.searchParams.get('template') ?? undefined,
    format: request.nextUrl.searchParams.get('format') ?? undefined,
  })
  const configured = process.env.APP_URL?.replace(/\/$/, '')
  const origin = configured || request.nextUrl.origin
  const target = new URL('/charte/apercu', origin)
  target.searchParams.set('template', options.template)
  target.searchParams.set('format', options.format)

  let browser: import('playwright').Browser | undefined
  try {
    const { chromium } = await import('playwright')
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    page.setDefaultTimeout(30_000)
    page.setDefaultNavigationTimeout(30_000)
    await page.goto(target.toString(), { waitUntil: 'load' })
    await page.emulateMedia({ media: 'print' })
    await page.evaluate(async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => {
          setTimeout(resolve, 3000)
        }),
      ])
      await Promise.all(
        Array.from(document.images).map(async (image) => {
          if (image.complete) return
          try {
            await image.decode()
          } catch {
            /* une image manquante ne doit pas bloquer le reste du document */
          }
        }),
      )
    })
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true })
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="velyon-charte-demonstration.pdf"',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    const missingBrowser = error instanceof Error && /executable|browserType|chromium/i.test(error.message)
    const message = missingBrowser
      ? 'Le navigateur de rendu est absent. Exécutez npx playwright install chromium.'
      : 'La génération du PDF a échoué. Réessayez dans un instant.'
    return NextResponse.json({ error: message }, { status: 503 })
  } finally {
    await browser?.close()
  }
}
