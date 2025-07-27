import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                Find Your Next Gig on HustleHub
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The ultimate marketplace connecting skilled freelancers with employers. Your next opportunity is just a search away.
              </p>
              <div className="w-full max-w-lg space-y-2">
                <form className="flex space-x-2">
                  <Input
                    type="search"
                    placeholder="Search for jobs, freelancers, services..."
                    className="flex-1"
                  />
                  <Button type="submit" variant="default">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Search by tag, location, service category, price, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                A World of Opportunity Awaits
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you're looking for tech wizards, home service heroes, or beauty gurus, find the perfect match for your project.
              </p>
            </div>
            <div className="mx-auto w-full max-w-5xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
                  <h3 className="text-lg font-bold">Tech</h3>
                  <p className="text-sm text-muted-foreground">Web dev, mobile, AI &amp; more.</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
                  <h3 className="text-lg font-bold">Home Services</h3>
                  <p className="text-sm text-muted-foreground">Plumbing, cleaning, repairs.</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
                  <h3 className="text-lg font-bold">Beauty</h3>
                  <p className="text-sm text-muted-foreground">Hair, makeup, wellness.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 HustleHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
