"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api"; // Import the centralized API client
import { useUser } from "@/hooks/use-user"; // Import useUser hook
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedJob {
  id: string;
  title: string;
  category: { name: string }; // Assuming category is an object with a name property
  job_type: 'Local' | 'Remote' | 'Hybrid';
  location: string;
  tags: string[];
  description: string;
  matched_skills: string[];
}

export default function RecommendedJobsPage() {
  const [allJobs, setAllJobs] = useState<RecommendedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser(); // Get user context

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!user || userLoading) return; // Wait for user to be loaded

      setLoading(true);
      try {
        const response = await api.get<RecommendedJob[]>(`/jobs/recommended/`); // User context is sent via token
        setAllJobs(response.data);
        setFilteredJobs(response.data); // Initially show all recommended jobs
        if (response.data.length === 0) {
          toast({
            title: "No Recommendations Yet",
            description: "No new job recommendations based on your profile at this moment. Check back later!",
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Failed to fetch recommended jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load recommended jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [user, userLoading, toast]);

  // Get unique categories for the filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allJobs.forEach(job => uniqueCategories.add(job.category.name));
    return ["all", ...Array.from(uniqueCategories)].sort();
  }, [allJobs]);

  // Filter jobs based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredJobs(allJobs);
    } else {
      setFilteredJobs(allJobs.filter(job => job.category.name === selectedCategory));
    }
  }, [selectedCategory, allJobs]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  if (userLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          <Sparkles className="inline-block mr-2 text-primary" />
          Recommended Jobs
        </h1>
        <p className="text-muted-foreground">
          Jobs matched for you by our AI, updated daily.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="category-filter" className="text-sm font-medium">Filter by Category:</label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={loading}>
          <SelectTrigger id="category-filter" className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardTitle className="text-xl font-headline mb-2">No Recommended Jobs</CardTitle>
          <CardDescription>Our AI is constantly working to find the best matches for you. Please check back later!</CardDescription>
          <Button asChild className="mt-4">
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <Badge variant={job.job_type === 'Local' ? 'outline' : 'default'}>
                        {job.job_type}
                    </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.category.name}</span>
                    </div>
                     <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="font-medium text-sm">Matched Skills:</span>
                    {job.matched_skills.map(skill => <Badge key={skill} variant="success">{skill}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button asChild>
                  <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
