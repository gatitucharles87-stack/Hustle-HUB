"use client";

import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PenSquare, Repeat, Users, Rocket, TrendingUp, Handshake, Briefcase, PlusCircle, Search, DollarSign } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/review-form";
import { TypingText } from "@/components/typing-text";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api"; // Import API client
import { useUser } from "@/hooks/use-user"; // Import useUser hook
import { Skeleton } from "@/components/ui/skeleton";

// Define the structure of a Job object (aligned with backend response)
interface Job {
  id: string;
  title: string;
  job_type: 'remote' | 'local' | 'hybrid';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'pending_review' | 'rejected';
  accepted_applicant?: {
    id: string;
    full_name: string;
    username: string;
  } | null;
}

// Define the structure of a CommissionLog object (aligned with backend response)
interface CommissionLog {
  id: string;
  amount: string; // Amount can be decimal, so string or number
  currency: string;
  status: 'paid' | 'due' | 'overdue' | 'waived';
  due_date: string;
  job_title: string;
}

export default function EmployerDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [commissionLogs, setCommissionLogs] = useState<CommissionLog[]>([]);
  const [loadingCommissions, setLoadingCommissions] = useState(true);
  const { toast } = useToast();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState<Job | null>(null);

  const fetchEmployerData = useCallback(async () => {
    if (!user) {
      setLoadingJobs(false);
      setLoadingCommissions(false);
      return;
    }

    // Fetch Jobs
    setLoadingJobs(true);
    try {
      const jobsResponse = await api.get(`/jobs/?employer=${user.id}`);
      setJobs(jobsResponse.data);
    } catch (error) {
      console.error("Failed to fetch jobs for employer:", error);
      toast({
        title: "Error",
        description: "Failed to load your job listings.",
        variant: "destructive",
      });
    } finally {
      setLoadingJobs(false);
    }

    // Fetch Commission Logs
    setLoadingCommissions(true);
    try {
      const commissionsResponse = await api.get(`/commission-logs/?employer=${user.id}`);
      setCommissionLogs(commissionsResponse.data);
    } catch (error) {
      console.error("Failed to fetch commission logs:", error);
      toast({
        title: "Error",
        description: "Failed to load your commission logs.",
        variant: "destructive",
      });
    } finally {
      setLoadingCommissions(false);
    }
  }, [user, toast]); // user is in dependency array

  useEffect(() => {
    fetchEmployerData();
  }, [fetchEmployerData]); // Depend on the memoized callback

  const handleOpenReviewModal = (job: Job) => {
    setSelectedJobForReview(job);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    setIsReviewModalOpen(false);
    setSelectedJobForReview(null);
    toast({
        title: "Review Submitted",
        description: "Your review has been successfully submitted.",
    });
    fetchEmployerData(); // Refresh data after review submission
  };

  const dueCommissions = commissionLogs.filter((log: CommissionLog) => log.status === 'due' || log.status === 'overdue');
  const hasDueCommissions = dueCommissions.length > 0;

  if (userLoading) {
    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="flex justify-center flex-wrap gap-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-48" />
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-4 w-3/4 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Integrated Welcome and Call-to-action Section */}
      <Card className="col-span-full bg-card shadow-lg border-b-2 border-primary p-6 md:p-8 lg:p-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline text-foreground mb-2">
          Welcome, {user?.fullName || "Employer"}! {/* Changed to fullName */}
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto mb-4">
          <TypingText words={["Find Your Next Talent.", "Post Your Perfect Job.", "Fostering Your Team's Growth."]} speed={100} delay={2000} />
        </p>
        <p className="text-md text-muted-foreground max-w-3xl mx-auto mb-8">
          Your central hub to connect with top-tier talent, manage your projects, and foster growth.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button asChild size="lg" className="shadow-xl bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:-translate-y-1">
            <Link href="/dashboard/post-job">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post a New Opportunity
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-xl border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-300 transform hover:-translate-y-1">
            <Link href="/hire">
              <Search className="mr-2 h-5 w-5" />
              Explore Freelancers
            </Link>
          </Button>
        </div>
      </Card>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Job Postings Card */}
        <Link href="/dashboard/employer/applicants" className="block">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingJobs ? <Skeleton className="h-8 w-16" /> : jobs.filter((job: Job) => job.status === 'open' || job.status === 'in_progress').length}</div>
              <p className="text-xs text-muted-foreground">Currently seeking talent</p>
            </CardContent>
          </Card>
        </Link>

        {/* Applicants to Review Card */}
        <Link href="/dashboard/employer/applicants" className="block">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applicants to Review</CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* This count needs a backend endpoint for applicants per employer's open jobs */}
              <div className="text-2xl font-bold">{loadingJobs ? <Skeleton className="h-8 w-16" /> : jobs.filter((job: Job) => job.status === 'open').length}</div> {/* Placeholder: count open jobs, ideally count actual applications for open jobs */}
              <p className="text-xs text-muted-foreground">New applications received</p>
            </CardContent>
          </Card>
        </Link>

        {/* Completed Projects Card */}
        <Link href="/dashboard/employer" className="block"> {/* Linking to main dashboard as a fallback */}
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingJobs ? <Skeleton className="h-8 w-16" /> : jobs.filter((job: Job) => job.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">Successful collaborations</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Your Recent Job Listings</CardTitle>
            <CardDescription>Keep track of your active and past job postings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingJobs ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4"><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ) : (
                  jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        No job listings found. <Link href="/dashboard/post-job" className="text-blue-500 hover:underline">Post your first job!</Link>
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job: Job) => (
                      <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell><Badge variant="secondary">{job.job_type}</Badge></TableCell>
                        <TableCell><Badge className={job.status === 'open' ? 'bg-green-500 text-white' : job.status === 'in_progress' ? 'bg-blue-500 text-white' : ''}>{job.status.replace(/_/g, ' ')}</Badge></TableCell>
                        <TableCell className="space-x-2">
                          {job.status === 'completed' && job.accepted_applicant ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReviewModal(job)}
                            >
                              Leave a Review
                            </Button>
                          ) : (job.status === 'open' || job.status === 'in_progress' || job.status === 'pending_review') ? (
                            <Button variant="secondary" size="sm" asChild>
                              <Link href={`/dashboard/employer/applicants/${job.id}`}>View Applicants</Link>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>No Action</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-primary" /> Skill Barter Zone
                </CardTitle>
                <CardDescription>
                    Exchange your services with other skilled professionals. Find what you need, offer what you have.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Looking for a specific skill but prefer to exchange services rather than pay? Explore our vibrant skill barter community.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
                        <Link href="/skill-barter/employer">Browse Barter Posts <TrendingUp className="ml-2 h-4 w-4 text-accent-foreground" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="shadow-md border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                        <Link href="/skill-barter/employer/my-applications">My Barter Applications <Handshake className="ml-2 h-4 w-4 text-primary" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Commissions Card - Moved out of the grid to be more prominent or flexible */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" /> Outstanding Commissions
          </CardTitle>
          <CardDescription>
            Track commissions due to HustleHub for completed projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCommissions ? (
            <Skeleton className="h-20 w-full" />
          ) : dueCommissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dueCommissions.map((log) => (
                  <TableRow key={log.id} className={log.status === 'overdue' ? 'bg-red-100 dark:bg-red-900' : ''}>
                    <TableCell className="font-medium">{log.job_title}</TableCell>
                    <TableCell>{log.amount} {log.currency}</TableCell>
                    <TableCell>{new Date(log.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'overdue' ? 'destructive' : 'default'}>
                        {log.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No outstanding commissions at the moment. Well done!</p>
          )}
        </CardContent>
      </Card>

      {selectedJobForReview && (
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Leave a Review for {selectedJobForReview.accepted_applicant?.full_name}</DialogTitle>
              <CardDescription>
                Job: <span className="font-medium">{selectedJobForReview.title}</span>
              </CardDescription>
            </DialogHeader>
            <ReviewForm
              jobId={selectedJobForReview.id}
              revieweeId={selectedJobForReview.accepted_applicant?.id!}
              revieweeType="freelancer"
              onReviewSubmitted={handleReviewSubmitted}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
