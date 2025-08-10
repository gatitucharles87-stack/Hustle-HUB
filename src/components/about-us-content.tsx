
'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BarChart, Handshake, Bot, ShieldCheck, Users } from "lucide-react";
// import Image from "next/image"; // No longer needed for hero background
import Link from "next/link";
import { useEffect, useState } from "react";

const teamMembers = [
  { name: "Alice Johnson", role: "Founder & CEO", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { name: "Bob Williams", role: "Head of Product", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { name: "Charlie Brown", role: "Lead Engineer", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
];

const testimonials = [
    { quote: "HustleHub made it easy to find a skilled professional for my project. The process was seamless and secure.", name: "Jane Doe", role: "Small Business Owner" },
    { quote: "As a freelancer, the Skill Barter feature is a game-changer. I've been able to trade my design skills for legal advice.", name: "John Smith", role: "Graphic Designer" },
    { quote: "The gamified career growth system kept me motivated. I've unlocked new badges and my reputation has soared!", name: "Emily White", role: "Web Developer" },
];

const features = [
    { title: "Skill Barter Exchange", description: "Trade your services with other professionals without exchanging money.", icon: <Handshake className="h-10 w-10 text-primary" /> },
    { title: "AI Job Matching", description: "Our smart algorithm connects you with the most relevant jobs or freelancers.", icon: <Bot className="h-10 w-10 text-primary" /> },
    { title: "Secure Smart Contract Payments", description: "Funds are held in escrow and released only when work is approved, ensuring trust.", icon: <ShieldCheck className="h-10 w-10 text-primary" /> },
    { title: "Gamified Career Growth", description: "Earn badges, level up your profile, and build your reputation on the platform.", icon: <BarChart className="h-10 w-10 text-primary" /> },
]

export function AboutUsContent() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // This will only run on the client side
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const getCtaButton = () => {
    switch (userRole) {
      case 'employer':
        return <Button asChild size="lg"><Link href="/dashboard/post-job">Post a Job Now</Link></Button>;
      case 'freelancer':
        return <Button asChild size="lg"><Link href="/jobs">Find Your Next Gig</Link></Button>;
      default:
        return <Button asChild size="lg"><Link href="/signup">Join HustleHub Today</Link></Button>;
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative h-[60vh] flex items-center justify-center text-center text-white bg-gray-800 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1487528278747-ef376f0c2918?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)` }}
        >
          {/* Overlay for text readability - equivalent to previous opacity-40 on Image */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Connecting Talent & Opportunity in a Smarter Way
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl">
              HustleHub is a revolutionary platform designed to bridge the gap between skilled freelancers and innovative employers through a fair, efficient, and empowering marketplace.
            </p>
          </div>
        </section>

        {/* Our Mission & Vision */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-background">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                To democratize access to opportunities by creating an inclusive ecosystem where skills are the primary currency. We champion skill barter and empower professionals to build sustainable, independent careers.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
              <p className="text-muted-foreground text-lg">
                To revolutionize freelancing with a secure, gamified, and AI-powered platform that fosters trust, encourages growth, and makes professional connections more meaningful and productive.
              </p>
            </div>
          </div>
        </section>
        
        {/* Platform Features Overview */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/40">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">A Platform Built for the Future of Work</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Discover the features that make HustleHub the best place for your professional life.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map(feature => (
                        <Card key={feature.title} className="text-center p-6">
                           <div className="flex justify-center mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Our Impact */}
        <section className="py-12 md:py-20 px-4 md:px-6">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Impact in Numbers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="p-6 bg-muted/40 rounded-lg">
                        <p className="text-4xl font-bold text-primary">+5,000</p>
                        <p className="text-muted-foreground mt-2">Jobs Matched</p>
                    </div>
                    <div className="p-6 bg-muted/40 rounded-lg">
                        <p className="text-4xl font-bold text-primary">+2,000</p>
                        <p className="text-muted-foreground mt-2">Freelancers Empowered</p>
                    </div>
                    <div className="p-6 bg-muted/40 rounded-lg">
                        <p className="text-4xl font-bold text-primary">85%</p>
                        <p className="text-muted-foreground mt-2">Positive Client Feedback</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/40">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What Our Community Says</h2>
                </div>
                <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex flex-col items-center text-center aspect-square justify-center p-6">
                                        <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-primary">{testimonial.role}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>

        {/* Meet the Team */}
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} /> 
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-20 px-4 md:px-6 text-center bg-gray-800 text-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="mt-4 max-w-xl mx-auto text-lg">
              Whether you're looking to hire, work, or trade skills, your next opportunity is just a click away.
            </p>
            <div className="mt-8">
              {getCtaButton()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
