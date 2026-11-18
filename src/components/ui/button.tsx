import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  primary: 'btn btn-primary',
  ai: 'btn btn-ai',
  outline: 'btn btn-outline',
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
}

export function buttonClass(variant: keyof typeof variants = 'primary', className?: string): string {
  return cn(variants[variant], className)
}

export function Button({ variant = 'primary', className, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  )
}
