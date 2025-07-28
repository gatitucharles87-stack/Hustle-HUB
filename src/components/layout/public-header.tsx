import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '../theme-toggle';

export function PublicHeader() {
  return (
    <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 border-b">
      <Logo />
      <nav className="flex items-center gap-4">
        <Button variant="ghost" asChild>
            <Link href="/about">About Us</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
