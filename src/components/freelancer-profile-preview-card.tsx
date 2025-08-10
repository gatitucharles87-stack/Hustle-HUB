"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FreelancerProfilePreviewCardProps {
  freelancer: {
    id: string;
    fullName: string;
    profilePictureUrl?: string;
    skills: string[];
    serviceArea: string;
    email?: string;
    phone?: string;
  };
  isHired: boolean;
}

export function FreelancerProfilePreviewCard({
  freelancer,
  isHired,
}: FreelancerProfilePreviewCardProps) {
  const handleContactNow = () => {
    if (isHired) {
      if (freelancer.email) {
        window.location.href = `mailto:${freelancer.email}`;
      }
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={freelancer.profilePictureUrl} alt={freelancer.fullName} />
          <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{freelancer.fullName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {freelancer.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Area</h3>
          <p>{freelancer.serviceArea}</p>
        </div>
        {isHired && (
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Info</h3>
                <p>Email: {freelancer.email || "Not provided"}</p>
                <p>Phone: {freelancer.phone || "Not provided"}</p>
            </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleContactNow} disabled={!isHired} className="flex-1">
            {isHired ? "Contact Now" : "Hire to View Contact"}
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={`/freelancers/${freelancer.id}/reviews`}>View Full Profile</a>
          </Button>
        </div>
        {!isHired && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Contact details will be available once the freelancer is hired.
            </p>
        )}
      </CardContent>
    </Card>
  );
}
