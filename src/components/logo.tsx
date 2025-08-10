import { Briefcase } from 'lucide-react';

export function Logo() {
  return (
    <> {/* Removed Link component */}
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        HustleHub
      </span>
    </>
  );
}
