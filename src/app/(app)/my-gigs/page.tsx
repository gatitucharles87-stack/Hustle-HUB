"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, CheckCircle, Clock } from "lucide-react";
import { JobCalendar } from "@/components/job-calendar";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface Job {
  id: string;
  title: string;
  category: { name: string };
  job_type: string;
  location: string;
  tags: string[];
  description: string;
  deadline: string; // Added deadline for employer listings
  employer_name?: string; // Optional employer name, if backend provides it for applications
}

interface JobApplication {
    id: string;
    job: Job; // Use the updated Job interface
    status: string; // e.g., "Pending", "Accepted", "Rejected"
    applied_date: string; // Date string from backend
}

interface CalendarEvent {
    title: string;
    employer: string;
    date: Date;
    status: string;
}

export default function MyGigsPage() {
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [myListings, setMyListings] = useState<Job[]>([]);
  const [upcomingGigs, setUpcomingGigs] = useState<CalendarEvent[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (userLoading) return; // Wait for user data to load

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your gigs.",
          variant: "destructive",
        });
        setLoadingApplications(false);
        setLoadingListings(false);
        setLoadingGigs(false);
        return;
      }

      if (user.role === "freelancer") {
        setLoadingApplications(true);
        try {
          const response = await api.get("/jobs/my-applications/");
          const applications: JobApplication[] = response.data.applications; // Access .applications
          setAppliedJobs(applications);

          const gigs = applications
            .filter(app => app.status === "Accepted" && app.job.deadline)
            .map(app => ({
              title: app.job.title,
              employer: app.job.employer_name || "", 
              date: new Date(app.job.deadline),
              status: app.status,
            }));
          setUpcomingGigs(gigs);

        } catch (error) {
          console.error("Failed to fetch job applications", error);
          toast({
            title: "Error",
            description: "Failed to load job applications. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoadingApplications(false);
          setLoadingGigs(false);
        }
      } else if (user.role === "employer") {
        setLoadingListings(true);
        try {
          const response = await api.get("/jobs/my-listings/");
          const listings: Job[] = response.data.jobs; // Access .jobs
          setMyListings(listings);

          const gigs = listings
            .filter(job => job.deadline)
            .map(job => ({
              title: job.title,
              employer: user.fullName, // Employer is the current user
              date: new Date(job.deadline),
              status: "Listed", // Or a relevant status for employer's jobs
            }));
          setUpcomingGigs(gigs);

        } catch (error) {
          console.error("Failed to fetch job listings", error);
          toast({
            title: "Error",
            description: "Failed to load job listings. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoadingListings(false);
          setLoadingGigs(false);
        }
      }
    };

    fetchData();
  }, [user, userLoading, toast]);

  const isLoading = userLoading || (user?.role === "freelancer" ? loadingApplications : loadingListings);

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Gigs</h1>
            <p className="text-muted-foreground">
                {user?.role === "freelancer" ? "Track your job applications and upcoming gigs." : "Manage your job listings and upcoming events."}
            </p>
        </div>

        {isLoading ? (
            <div className="space-y-8">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        ) : (
            <>
                {user?.role === "freelancer" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> Active Applications</CardTitle>
                            <CardDescription>Your currently active job applications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {appliedJobs.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Date Applied</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {appliedJobs.map((jobApp) => (
                                            <TableRow key={jobApp.id}>
                                                <TableCell className="font-medium">{jobApp.job.title}</TableCell>
                                                <TableCell>{jobApp.job.category.name}</TableCell>
                                                <TableCell>{new Date(jobApp.applied_date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={jobApp.status === 'Pending' ? 'secondary' : 'default'}>
                                                        {jobApp.status === 'Pending' ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                                                        {jobApp.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">No active job applications found.</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {user?.role === "employer" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> My Job Listings</CardTitle>
                            <CardDescription>Your active job postings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {myListings.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Deadline</TableHead>
                                            <TableHead>Job Type</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myListings.map((job) => (
                                            <TableRow key={job.id}>
                                                <TableCell className="font-medium">{job.title}</TableCell>
                                                <TableCell>{job.category.name}</TableCell>
                                                <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={job.job_type === 'Local' ? 'outline' : 'default'}>
                                                        {job.job_type}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">No job listings found.</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> Upcoming Gigs</CardTitle>
                        <CardDescription>Your schedule for accepted jobs or posted jobs. Click a date to see details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingGigs ? (
                            <Skeleton className="h-64 w-full" />
                        ) : upcomingGigs.length > 0 ? (
                            <JobCalendar events={upcomingGigs} />
                        ) : (
                            <p className="text-muted-foreground">No upcoming gigs at the moment.</p>
                        )}
                    </CardContent>
                </Card>
            </>
        )}
    </div>
  );
}
