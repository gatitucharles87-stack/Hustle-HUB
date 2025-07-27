import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Handshake, Target } from "lucide-react";
import type { Metadata } from 'next';
import Image from "next/image";

export const metadata: Metadata = {
  title: 'About HustleHub | Connecting Freelancers & Employers',
  description: "Learn about HustleHub's mission to create a fair, efficient, and empowering marketplace for skilled freelancers and innovative employers. Join our community today.",
  keywords: ['freelance marketplace', 'about us', 'HustleHub mission', 'hire freelancers', 'find freelance jobs'],
};

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man ceo",
  },
  {
    name: "Maria Garcia",
    role: "Head of Product",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman product",
  },
  {
    name: "Sam Chen",
    role: "Lead Engineer",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man engineer",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
        <section className="text-center bg-muted/50 py-16 px-4 rounded-lg">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">About HustleHub</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                We are dedicated to building a fair, efficient, and empowering marketplace that connects skilled freelancers with innovative employers.
            </p>
        </section>

        <section>
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-headline mb-4 flex items-center gap-2"><Target /> Our Mission</h2>
                        <p className="text-muted-foreground mb-4">
                            Our mission is to democratize opportunity. We believe that talent is universal, but opportunity is not. HustleHub was created to bridge that gap, providing a platform where skill, dedication, and creativity are the currencies that matter most. We strive to create a transparent and trustworthy environment where freelancers can build sustainable careers and employers can find the perfect talent to bring their visions to life.
                        </p>
                         <p className="text-muted-foreground">
                           Whether it's a local plumbing job, a remote web development project, or a creative design task, our goal is to make the connection seamless and successful for both parties.
                        </p>
                    </div>
                    <div className="relative h-80 w-full">
                        <Image 
                            src="https://placehold.co/600x400.png" 
                            alt="Team collaborating in an office" 
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            data-ai-hint="collaboration office"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section>
             <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative h-80 w-full order-last md:order-first">
                        <Image 
                            src="https://placehold.co/600x400.png" 
                            alt="A single person working on a laptop" 
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            data-ai-hint="freelancer working"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold font-headline mb-4">Our Story</h2>
                        <p className="text-muted-foreground mb-4">
                           HustleHub started with a simple idea: what if finding work or hiring talent could be as easy as a tap of a button, but with the trust and community of a local neighborhood? Frustrated by the complexities and impersonal nature of existing platforms, our founders—a mix of freelancers and small business owners—set out to build something better.
                        </p>
                         <p className="text-muted-foreground">
                           Launched in 2023, HustleHub has quickly grown into a vibrant ecosystem of professionals from all walks of life, all driven by a shared passion for their craft.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="text-center">
            <h2 className="text-3xl font-bold font-headline mb-8">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
                <div key={member.name} className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary">{member.role}</p>
                </div>
            ))}
            </div>
        </section>

        <section>
             <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Why Choose HustleHub?</CardTitle>
                    <CardDescription>Our core values set us apart.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <Briefcase className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-xl mb-2">Empowerment</h3>
                        <p className="text-muted-foreground">We provide the tools and resources for freelancers to take control of their careers and for employers to build their dream teams.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-xl mb-2">Community</h3>
                        <p className="text-muted-foreground">We foster a supportive community through features like our Skill Barter exchange and a focus on local connections.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Handshake className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-xl mb-2">Trust</h3>
                        <p className="text-muted-foreground">From transparent commission structures to user verification, we prioritize creating a secure and reliable platform for everyone.</p>
                    </div>
                </CardContent>
            </Card>
        </section>

    </div>
  );
}
