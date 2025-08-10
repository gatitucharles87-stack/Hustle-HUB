"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Phone, Mail, MapPin, Briefcase, Award, CheckCircle, TrendingUp, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ReviewCard } from "@/components/review-card";
import { useParams } from "next/navigation"; // Import useParams
import { Progress } from "@/components/ui/progress"; // Import Progress component
import { cn } from "@/lib/utils"; // Import cn utility

// Placeholder data for a single freelancer.
const freelancer = {
  id: "1",
  fullName: "Alice Johnson",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  bio: "I am a passionate and experienced full-stack developer with over 5 years of experience in creating beautiful, functional, and user-friendly web applications. My expertise lies in the MERN stack (MongoDB, Express, React, Node.js), and I am always eager to learn new technologies and take on challenging projects. I am a great communicator and a team player, and I am confident that I can deliver high-quality work that meets your expectations.",
  skills: ["React", "Node.js", "TypeScript", "JavaScript", "MongoDB", "Express.js"],
  serviceAreas: ["Nairobi", "Remote"],
  rating: 4.9,
  reviewsCount: 23,
  phone: "+1234567890",
  email: "alice.johnson@example.com",
};

// Mock gamification data for the freelancer
const freelancerGamificationData = {
  current_xp: 1250,
  xp_needed: 2000,
  level: 8,
  badges: [
    { name: "Beginner", unlocked: true, icon: "Award", description: "Reached Level 1" },
    { name: "Rising Talent", unlocked: true, icon: "TrendingUp", description: "Reached Level 5" },
    { name: "Pro Freelancer", unlocked: false, icon: "Star", description: "Reached Level 10" },
    { name: "Job Completionist", unlocked: false, icon: "CheckCircle", description: "Completed 25 jobs" },
  ],
};

// Map icon names to Lucide React components
const iconMap = {
    Award: Award,
    CheckCircle: CheckCircle,
    Star: Star,
    TrendingUp: TrendingUp,
};

// Level Display Component (reused from badges page for consistency)
function LevelDisplay({ level }: { level: number }) {
    const levelColors = [
        "text-gray-500", // Level 1-2
        "text-green-500", // Level 3-5
        "text-blue-500", // Level 6-9
        "text-purple-500", // Level 10-14
        "text-yellow-500", // Level 15-19
        "text-red-500", // Level 20+
    ];

    const getLevelColor = (lvl: number) => {
        if (lvl >= 20) return levelColors[5];
        if (lvl >= 15) return levelColors[4];
        if (lvl >= 10) return levelColors[3];
        if (lvl >= 6) return levelColors[2];
        if (lvl >= 3) return levelColors[1];
        return levelColors[0];
    };

    return (
        <div className="flex items-center gap-2">
            <span className={cn("font-bold text-2xl", getLevelColor(level))}>Level {level}</span>
            <Award className={cn("h-6 w-6", getLevelColor(level))} />
        </div>
    );
}

// Corrected placeholder data for reviews to match ReviewCardProps
const recentReviews = [
    { reviewer_full_name: "Bob Williams", rating: 5, comment: "Alice was amazing! She delivered the project on time and exceeded my expectations. Highly recommend!", job_title: "E-commerce Platform Build", created_at: "2024-07-20T10:00:00Z" },
    { reviewer_full_name: "Charlie Brown", rating: 5, comment: "A true professional. Alice is a great communicator and a very skilled developer.", job_title: "Company Website Redesign", created_at: "2024-07-15T14:30:00Z" },
];

const portfolioItems = [
    { id: 'pitem-1', type: 'image', title: 'E-commerce Website Design', url: 'https://placehold.co/600x400.png', description: 'A modern and clean design for a fashion e-commerce store.' },
    { id: 'pitem-2', type: 'link', title: 'Personal Blog', url: 'https://example.com', description: 'My personal blog where I write about web development.' },
    { id: 'pitem-3', type: 'document', title: 'Case Study: Project Alpha', url: '/path/to/document.pdf', description: 'A detailed case study of a recent project.' },
];

const renderPortfolioItem = (item: any) => {
    const Icon = item.type === 'image' ? ImageIcon : item.type === 'link' ? ExternalLink : FileText;
    return (
        <Card key={item.id}> 
            <CardContent className="p-4">
                {item.type === 'image' && <img src={item.url} alt={item.title} className="rounded-md mb-4" />}
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                        View {item.type === 'document' ? 'Document' : 'Project'}
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function FreelancerProfilePage() {
  const params = useParams();
  const freelancerId = params.id as string; 

  const handleCall = () => {
    window.location.href = `tel:${freelancer.phone}`;
  };

  const { current_xp, xp_needed, level, badges } = freelancerGamificationData;
  const progressPercentage = (current_xp / xp_needed) * 100;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src={freelancer.avatarUrl} alt={freelancer.fullName} />
              <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-headline">{freelancer.fullName}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{freelancer.rating}</span>
                <span>({freelancer.reviewsCount} reviews)</span>
              </div>
              {/* Gamification Data */}
              <div className="mt-4 space-y-2">
                <LevelDisplay level={level} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">XP Progress</span>
                  <span className="text-xs font-bold text-primary">{current_xp} / {xp_needed} XP</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <Button onClick={handleCall} size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={`mailto:${freelancer.email}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between font-headline">
                        <div className="flex items-center gap-2"><Briefcase /> Recent Work</div>
                        <Button variant="secondary" asChild>
                            <Link href={`/freelancers/${freelancerId}/portfolio`}>View All Work</Link>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.slice(0, 2).map(renderPortfolioItem)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between font-headline">
                        <div className="flex items-center gap-2"><Star /> Recent Reviews</div>
                        <Button variant="secondary" asChild>
                            <Link href={`/freelancers/${freelancerId}/reviews`}>View All Reviews</Link>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recentReviews.map((review, index) => (
                        <ReviewCard key={index} review={review} /> 
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><Briefcase /> Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {freelancer.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><Award /> Badges</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {badges.map((badge: any, index: number) => {
                const IconComponent = iconMap[badge.icon as keyof typeof iconMap];
                return (
                  <div key={index} className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border",
                    badge.unlocked ? "border-primary shadow-sm" : "opacity-50"
                  )} title={badge.unlocked ? badge.description : `Locked: ${badge.description}`}>
                    {IconComponent && (
                      <IconComponent className={cn(
                        "h-8 w-8",
                        badge.unlocked ? "text-yellow-500" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="text-xs font-medium text-center">{badge.name}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><MapPin /> Service Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {freelancer.serviceAreas.map(area => (
                <div key={area} className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{area}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
