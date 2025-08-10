"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PortfolioItemCard } from "@/components/portfolio-item-card";

// Define the type for a portfolio item to ensure type safety
interface PortfolioItem {
  id: string;
  type: 'image' | 'document';
  title: string;
  filePath: string;
  description: string;
}

// Placeholder data for a single freelancer's portfolio.
const freelancer = {
  id: "1",
  fullName: "Alice Johnson",
};

// Explicitly type the array to match the PortfolioItem interface
const allPortfolioItems: PortfolioItem[] = [
    { id: 'pitem-1', type: 'image', title: 'E-commerce Website Design', filePath: 'https://placehold.co/600x400.png', description: 'A modern and clean design for a fashion e-commerce store, focusing on user experience and mobile responsiveness.' },
    { id: 'pitem-3', type: 'document', title: 'Case Study: SaaS Dashboard', filePath: 'https://www.africau.edu/images/default/sample.pdf', description: 'Detailed case study on designing and implementing a SaaS analytical dashboard, highlighting challenges and solutions.' },
    { id: 'pitem-4', type: 'image', title: 'Mobile App UI/UX Redesign', filePath: 'https://placehold.co/600x400/FF5733/FFFFFF?text=App+Redesign', description: 'Complete UI/UX overhaul for an existing mobile application to improve usability and visual appeal.' },
    { id: 'pitem-6', type: 'document', title: 'Technical Whitepaper: Blockchain Integration', filePath: 'https://www.africau.edu/images/default/sample.pdf', description: 'A whitepaper detailing the technical aspects and benefits of integrating blockchain technology into web applications.' },
    { id: 'pitem-7', type: 'image', title: 'Brand Identity Development', filePath: 'https://placehold.co/600x400/33FF57/FFFFFF?text=Brand+Identity', description: 'Comprehensive brand identity development for a new startup, including logo, color palette, and typography guidelines.' },
];

export default function FreelancerAllPortfolioPage() {
  const params = useParams();
  const freelancerId = params.id as string;
  const currentFreelancer = freelancer;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/freelancers/${freelancerId}`}>
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to Profile</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Portfolio of {currentFreelancer.fullName}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPortfolioItems.length > 0 ? (
          allPortfolioItems.map((item) => (
            <PortfolioItemCard key={item.id} item={item} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No portfolio items available yet.</p>
        )}
      </div>
    </div>
  );
}
