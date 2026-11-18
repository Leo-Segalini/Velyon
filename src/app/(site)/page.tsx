import type { Metadata } from 'next'
import { ChatStudio } from '@/components/chat/studio'

export const metadata: Metadata = {
  title: 'Discussion',
  description: 'Décrivez un projet. Velyon en discute, puis rédige le cahier des charges et les propositions.',
}

export default function HomePage() {
  return <ChatStudio />
}
