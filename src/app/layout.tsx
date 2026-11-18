import type { Metadata } from 'next'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/700.css'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Velyon', template: '%s — Velyon' },
  description: 'Décrivez un projet. Velyon en discute, puis rédige le cahier des charges, la proposition technique et la proposition financière.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-canvas font-body text-ink antialiased">{children}</body>
    </html>
  )
}
