import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Handshake, Repeat, Star } from 'lucide-react';
import { PublicHeader } from '@/components/layout/public-header';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

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

const testimonials = [
  {
    name: "Aisha Mwangi",
    role: "Freelance Developer",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman developer",
    quote: "HustleHub has been a game-changer for my freelance career. I've found incredible projects and the Skill Barter feature is pure genius!",
  },
  {
    name: "David Chen",
    role: "Small Business Owner",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man business",
    quote: "Finding a reliable plumber for my cafe used to be a nightmare. With HustleHub, I hired a local professional in under an hour. Highly recommended!",
  },
];


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                  Your Next Opportunity is Here.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  HustleHub connects you with a vibrant community of skilled freelancers and innovative employers. Stop searching, start doing.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      Find Work <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/signup">
                      Hire Talent <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="collaboration team"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
              />
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
              </h2>
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
        
        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
           <div className="container px-4 md:px-6">
               <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                   <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                       Loved by Professionals Worldwide
                   </h2>
                   <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                       Hear what our community members have to say about their experience on HustleHub.
                   </p>
               </div>
               <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                   {testimonials.map((testimonial) => (
                       <Card key={testimonial.name}>
                           <CardContent className="p-6">
                               <div className="space-y-4">
                                   <div className="flex items-center gap-4">
                                       <Avatar>
                                           <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                                           <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                       </Avatar>
                                       <div>
                                           <p className="font-semibold">{testimonial.name}</p>
                                           <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-0.5">
                                       <Star className="w-5 h-5 fill-primary text-primary" />
                                       <Star className="w-5 h-5 fill-primary text-primary" />
                                       <Star className="w-5 h-5 fill-primary text-primary" />
                                       <Star className="w-5 h-5 fill-primary text-primary" />
                                       <Star className="w-5 h-5 fill-primary text-primary" />
                                   </div>
                                   <blockquote className="text-lg leading-relaxed">
                                       "{testimonial.quote}"
                                   </blockquote>
                               </div>
                           </CardContent>
                       </Card>
                   ))}
               </div>
           </div>
        </section>

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
