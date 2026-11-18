import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const tones = {
  gold: 'badge badge-gold',
  custard: 'badge badge-custard',
  ink: 'badge badge-ink',
} as const

export function Badge({ tone = 'gold', children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return <span className={cn(tones[tone], className)}>{children}</span>
}
