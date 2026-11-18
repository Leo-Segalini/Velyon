import { SiteHeader } from '@/components/layout/site-header'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <SiteHeader />
      <main id="contenu" className="min-h-0 flex-1">{children}</main>
    </div>
  )
}
