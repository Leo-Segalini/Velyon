import Image from 'next/image'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto flex max-w-3xl items-center px-4 py-3">
        <Link href="/" className="rounded-sm">
          <Image src="/brand/logo-velyon.png" alt="Velyon" width={851} height={291} priority className="h-9 w-auto" />
        </Link>
      </div>
    </header>
  )
}
