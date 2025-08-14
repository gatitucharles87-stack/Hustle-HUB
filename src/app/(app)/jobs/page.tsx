"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Search } from "lucide-react";
import { LocationSelector } from "@/components/location-selector";
import Link from "next/link";
import * as api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Job {
  id: string;
  title: string;
  category: { name: string };
  job_type: string;
  location: string;
  tags: string[];
  description: string;
  matched_skills?: string[]; // Add matched_skills to the interface
}

interface JobCategory {
  id: string;
  name: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    county: "",
    subCounty: "", 
    area: "",       
  });

  useEffect(() => {
    const fetchJobsAndCategories = async () => {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          api.getJobs(),
          api.getJobCategories(),
        ]);
        setJobs(jobsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch jobs or categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndCategories();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const handleLocationChange = (location: { county: string; subCounty: string; ward: string; neighborhood: string; }) => {
    setFilters((prev) => ({
      ...prev,
      county: location.county,
      subCounty: location.subCounty,
      area: location.neighborhood,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.getJobs({ params: filters });
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to search jobs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Search /> Find a Job</CardTitle>
          <CardDescription>Refine your search to find the perfect gig.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="search-keywords">Keywords or Skills</Label>
                  <Input id="search-keywords" placeholder="e.g., 'React' or 'Plumber'" onChange={(e) => handleFilterChange("search", e.target.value)} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="search-category">Category</Label>
                  <Select onValueChange={(value) => handleFilterChange("category", value)}>
                      <SelectTrigger id="search-category">
                          <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
           </div>
           <LocationSelector onLocationChange={handleLocationChange} />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">
          Available Jobs ({jobs.length})
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <Badge variant={job.job_type === 'Local' ? 'outline' : 'default'}>
                          {job.job_type}
                      </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                   {job.matched_skills && job.matched_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-1">Matched Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.matched_skills.map((skill: string) => (
                            <Badge key={skill} variant="success">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  <div className="flex gap-2">
                    {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button asChild>
                    <Link href={`/jobs/${job.id}`}>View Job</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
