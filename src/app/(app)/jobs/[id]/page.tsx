"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock, CalendarDays, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ApplyJobDialog } from "@/components/apply-job-dialog";
import * as api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface JobDetails {
  id: string;
  title: string;
  category: { name: string }; // Updated to match backend structure
  job_type: 'Local' | 'Remote' | 'Hybrid'; // Updated to match backend structure
  location: string;
  tags: string[];
  description: string;
  budget: string;
  duration: string;
  deadline: string;
  experience_level: string;
  posted_by?: {
    id: string;
    username: string;
    full_name: string;
    profile_picture_url: string;
  }; // Made optional
  matched_skills?: string[];
}

export default function JobDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const jobId = params.id as string;
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getJobById(jobId);
        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job details", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again later.",
          variant: "destructive",
        });
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle><div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div></CardTitle>
            <CardDescription><div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="h-10 bg-blue-500 rounded w-24 animate-pulse"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Job not found.</h2>
        <p className="text-muted-foreground">Please check the URL or browse other jobs.</p>
        <Button asChild className="mt-4">
          <Link href="/jobs">Browse All Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">{job.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" /> <span>{job.category.name}</span>
            <MapPin className="h-4 w-4" /> <span>{job.location} ({job.job_type})</span>
          </CardDescription>
          <div className="flex items-center gap-4 text-sm mt-2">
            <div className="flex items-center gap-1 text-gray-700">
              <DollarSign className="h-4 w-4" /> <span>{job.budget}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Clock className="h-4 w-4" /> <span>{job.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <CalendarDays className="h-4 w-4" /> <span>Deadline: {job.deadline}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <BarChart2 className="h-4 w-4" /> <span>{job.experience_level}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-semibold">Description:</p>
          <p className="text-muted-foreground">{job.description}</p>

          <div className="space-y-2">
            <p className="text-lg font-semibold">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          </div>
          
          {job.matched_skills && job.matched_skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-lg font-semibold">Matched Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.matched_skills.map((skill: string) => <Badge key={skill} variant="success">{skill}</Badge>)}
              </div>
            </div>
          )}

          {job.posted_by && ( // Conditional rendering for posted_by
            <div className="space-y-2">
              <p className="text-lg font-semibold">Posted By:</p>
              <div className="flex items-center space-x-3">
                {/* <Avatar> */}
                  {/* <AvatarImage src={job.posted_by.profile_picture_url} alt={job.posted_by.full_name} /> */}
                  {/* <AvatarFallback>{job.posted_by.full_name[0]}</AvatarFallback> */}
                {/* </Avatar> */}
                <div>
                  <Link href={`/freelancers/${job.posted_by.username}`} className="font-semibold text-blue-600 hover:underline">
                    {job.posted_by.full_name}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => setIsApplyModalOpen(true)}>
            Apply for this Job
          </Button>
        </CardFooter>
      </Card>
      {job && (
       <ApplyJobDialog
       jobId={job.id}
       isOpen={isApplyModalOpen}
       onOpenChange={setIsApplyModalOpen}
       onApplicationSubmit={() => {
         // you can add a toast notification here
       }}
     />
      )}
    </div>
  );
}
