"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import Link from "next/link";
import { useParams } from "next/navigation"; // Import useParams

// Placeholder data for freelancer and all their reviews
const freelancer = {
  id: "1",
  fullName: "Alice Johnson",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  rating: 4.9,
  reviewsCount: 23,
};

// Corrected placeholder data for all reviews to match ReviewCardProps
const allReviews = [
  { reviewer_full_name: "Bob Williams", rating: 5, comment: "Alice was amazing! She delivered the project on time and exceeded my expectations. Highly recommend!", job_title: "E-commerce Platform Build", created_at: "2024-07-20T10:00:00Z" },
  { reviewer_full_name: "Charlie Brown", rating: 5, comment: "A true professional. Alice is a great communicator and a very skilled developer.", job_title: "Company Website Redesign", created_at: "2024-07-15T14:30:00Z" },
  { reviewer_full_name: "David Lee", rating: 4, comment: "Good work, but took a little longer than expected. Overall satisfied.", job_title: "Mobile App Development", created_at: "2024-07-10T09:00:00Z" },
  { reviewer_full_name: "Eve Davis", rating: 5, comment: "Excellent service and highly responsive. Will definitely work with Alice again!", job_title: "Backend API Integration", created_at: "2024-07-01T11:45:00Z" },
  { reviewer_full_name: "Frank White", rating: 4, comment: "Delivered as promised. Minor revisions were handled quickly.", job_title: "Consulting Session", created_at: "2024-06-25T16:00:00Z" },
  { reviewer_full_name: "Grace Taylor", rating: 5, comment: "Alice is a brilliant developer. Her code quality is top-notch.", job_title: "Database Optimization", created_at: "2024-06-18T08:30:00Z" },
  { reviewer_full_name: "Harry Wilson", rating: 3, comment: "Communication could be improved, but the final product was acceptable.", job_title: "Small Website Update", created_at: "2024-06-10T13:00:00Z" },
];

export default function FreelancerAllReviewsPage() {
  const params = useParams();
  const freelancerId = params.id as string; // Ensure id is string
  const currentFreelancer = freelancer; // Using placeholder for now

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/freelancers/${freelancerId}`}> 
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to Profile</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Reviews for {currentFreelancer.fullName}</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={currentFreelancer.avatarUrl} alt={currentFreelancer.fullName} />
            <AvatarFallback>{currentFreelancer.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-bold">{currentFreelancer.rating}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>Overall Rating</span>
            </div>
            <p className="text-muted-foreground">Based on {currentFreelancer.reviewsCount} reviews</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allReviews.length > 0 ? (
          allReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No reviews available yet.</p>
        )}
      </div>
    </div>
  );
}
