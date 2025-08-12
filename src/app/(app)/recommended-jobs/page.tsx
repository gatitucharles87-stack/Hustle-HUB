"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useUser } from "@/hooks/use-user";
import api, { getRecommendedJobs, getJobCategories } from "@/lib/api"; // Corrected api import, and added named imports
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Zap, Sparkles, AlertCircle, UserCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RecommendedJobCard, RecommendedJob } from "@/components/recommended-job-card"; // Changed back to alias-based import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 


interface JobCategory {
    id: string;
    name: string;
}

// The main page component
export default function RecommendedJobsPage() {
  const { user, loading: userLoading } = useUser(); // Removed token from destructuring
  const [allJobs, setAllJobs] = useState<RecommendedJob[]>([]); // To store all fetched jobs
  const [filteredJobs, setFilteredJobs] = useState<RecommendedJob[]>([]); // For filtered display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<JobCategory[]>([]); // For job categories
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // For category filter
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch jobs if we have a user and they are not loading
    if (user && !userLoading) {
      // Ensure the user is a freelancer before fetching
      if (user.role !== 'freelancer') {
        setError("Only freelancers can see job recommendations.");
        setLoading(false);
        return;
      }
      
      // Ensure user profile is complete
      if (!user.bio || !user.skills || user.skills.length === 0) { 
          setError("Your profile is incomplete. Please add a bio and some skills to receive personalized job recommendations.");
          setLoading(false);
          return;
      }

      const fetchJobsAndCategories = async () => {
        setLoading(true);
        setError(null);
        try {
          const [jobsResponse, categoriesResponse] = await Promise.all([
            getRecommendedJobs(), // Use the imported function
            getJobCategories() // Use the imported function
          ]);
          setAllJobs(jobsResponse.data); // Extract data from AxiosResponse
          setFilteredJobs(jobsResponse.data); // Initially display all jobs
          setCategories(categoriesResponse.data); // Extract data from AxiosResponse
        } catch (err: any) {
          console.error("Failed to fetch data for recommended jobs:", err);
          setError("We couldn't load your recommendations right now. Please try again later.");
          toast({
            title: "Error",
            description: "Failed to fetch recommended jobs or categories.",
            variant: "destructive"
          });
        }
       finally {
          setLoading(false);
        }
      };

      fetchJobsAndCategories();
    } else if (!userLoading) {
        setLoading(false);
        setError("You must be logged in to view job recommendations.");
    }
  }, [user, userLoading, toast]); 

  // Filter jobs based on selected category whenever allJobs or selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredJobs(allJobs);
    } else {
      setFilteredJobs(allJobs.filter(job => job.category?.id === selectedCategory)); // Added optional chaining for job.category
    }
  }, [selectedCategory, allJobs]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const renderContent = () => {
    // Show skeleton loaders while user or job data is loading
    if (userLoading || loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      );
    }
    
    // Display any errors that occurred during the process
    if (error) {
      const isProfileIncomplete = error.includes("profile is incomplete");
      return (
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-300 text-yellow-800">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="font-bold">{isProfileIncomplete ? "Complete Your Profile" : "An Error Occurred"}</AlertTitle>
          <AlertDescription>
            {error}
            {isProfileIncomplete && (
                <Button asChild className="mt-4">
                    <Link href="/profile">Go to Profile</Link>
                </Button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    // Handle the case where the user is a freelancer but no jobs were recommended
    if (filteredJobs.length === 0) {
      return (
        <Alert className="bg-green-50 border-green-300 text-green-800">
            <UserCheck className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-bold">You're All Caught Up!</AlertTitle>
            <AlertDescription>
                Our AI couldn't find any new job matches for you at the moment or for the selected category. Your profile is ready to go!
                <div className="mt-4">
                    <Button asChild>
                        <Link href="/jobs">Browse All Available Jobs</Link>
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
      );
    }

    // Display the list of recommended jobs
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job: RecommendedJob) => (
          <RecommendedJobCard key={job.id} job={job} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline flex items-center">
          <Sparkles className="h-8 w-8 mr-3 text-primary animate-pulse" />
          Your AI-Powered Job Recommendations
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Here are the top jobs our AI has matched specifically for you based on your skills and profile.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="category-filter" className="text-sm font-medium">Filter by Category:</label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={loading}>
          <SelectTrigger id="category-filter" className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category: JobCategory) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderContent()}
    </div>
  );
}
