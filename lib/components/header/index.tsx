import Link from 'next/link'
import { Logo } from '@lib/components/logo'
import { ThemeToggle } from '@lib/components/theme-toggle'

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 w-full shrink-0 items-center border-b px-4 backdrop-blur transition-[width,height] ease-linear">
      <Link aria-label="Home" href="/">
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
