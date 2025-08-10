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

interface JobApplication {
    id: string;
    job: {
        id: string;
        title: string;
        category: { name: string };
    };
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
  const [upcomingGigs, setUpcomingGigs] = useState<CalendarEvent[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoadingApplications(true);
      try {
        const response = await api.get("/job-applications/");
        const applications: JobApplication[] = response.data;
        setAppliedJobs(applications);

        // Filter for upcoming gigs (accepted applications)
        const gigs = applications
          .filter(app => app.status === "Accepted")
          .map(app => ({
            title: app.job.title,
            employer: "", // Employer name is not directly in application, might need another fetch or join
            date: new Date(app.applied_date), // Use applied_date for now, ideally a specific gig date
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
        setLoadingGigs(false); // Set both to false as they are fetched together
      }
    };

    fetchApplications();
  }, [toast]);

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Gigs</h1>
            <p className="text-muted-foreground">
                Track your job applications and upcoming gigs.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase /> Active Applications</CardTitle>
                <CardDescription>Your currently active job applications.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingApplications ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : appliedJobs.length > 0 ? (
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

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar /> Upcoming Gigs</CardTitle>
                <CardDescription>Your schedule for accepted jobs. Click a date to see details.</CardDescription>
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
    </div>
  );
}
