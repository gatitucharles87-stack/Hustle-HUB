import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Handshake, Repeat } from 'lucide-react';
import { PublicHeader } from '@/components/layout/public-header';
import Image from 'next/image';
import { ReviewSection } from '@/components/review-section';
import { TypingText } from '@/components/typing-text'; // Import the new TypingText component

const features = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Find Your Fit',
    description: 'Explore thousands of job listings across dozens of categories, from local gigs to remote projects. Our powerful search helps you find the perfect match for your skills.',
    link: '/jobs',
    linkLabel: 'Browse Jobs',
  },
  {
    icon: <Repeat className="h-10 w-10 text-primary" />,
    title: 'Barter Your Skills',
    description: 'No cash? No problem. Trade your professional services with other skilled members of our community. It’s the ultimate way to collaborate and grow.',
    link: '/skill-barter',
    linkLabel: 'Explore Barter Exchange',
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary" />,
    title: 'Hire with Confidence',
    description: 'Access a diverse talent pool of verified professionals. Post jobs, review profiles, and manage applicants all in one place to build your dream team.',
    link: '/hire',
    linkLabel: 'Find Talent',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section - Improved */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-gray-950">
          {/* Subtle background gradient for visual interest, using brand colors */}
          <div className="absolute inset-0 z-0 opacity-20"
               style={{
                 backgroundImage: 'radial-gradient(at 20% 50%, #3498DB40, transparent 50%), radial-gradient(at 80% 80%, #6A0DAD40, transparent 50%)'
               }}
          ></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 xl:gap-32 items-center">
              {/* Text Content */}
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl font-headline text-white leading-tight">
                  Unlock Your Potential. <br className="hidden sm:inline" />
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    <TypingText words={["Find Work.", "Hire Talent."]} />
                  </span>
                </h1>
                <p className="max-w-[700px] text-lg text-gray-300 md:text-xl leading-relaxed">
                  HustleHub connects ambitious freelancers with visionary employers. Build your legacy, find your next project, or assemble your dream team – all in one dynamic marketplace.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-300">
                    <Link href="/signup">
                      Get Started as a Freelancer <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="px-8 py-3 text-lg font-semibold bg-secondary hover:bg-secondary/90 transition-colors duration-300">
                    <Link href="/signup">
                      Post a Job Today <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Image with subtle hover effect */}
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={700}
                  height={500}
                  alt="A dynamic and collaborative workspace"
                  data-ai-hint="team collaborating on project, abstract representation of productivity"
                  className="mx-auto overflow-hidden rounded-xl object-cover shadow-2xl transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Everything You Need to Succeed
              </h2 >
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you're looking for work or searching for talent, our platform is designed to make it happen.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="grid gap-4 text-center">
                   <div className="mx-auto">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Reviews Section (placed near the bottom/footer) */}
        <ReviewSection />

      </main>
      <footer className="flex w-full shrink-0 flex-col items-center justify-between gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 HustleHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="/about" className="text-xs hover:underline underline-offset-4">
                About Us
            </Link>
             <Link href="#" className="text-xs hover:underline underline-offset-4">
                Terms of Service
            </Link>
             <Link href="#" className="text-xs hover:underline underline-offset-4">
                Privacy
            </Link>
        </nav>
      </footer>
    </div>
  );
}
