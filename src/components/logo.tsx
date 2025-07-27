import { Briefcase } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="HustleHub">
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        HustleHub
      </span>
    </Link>
  );
}
