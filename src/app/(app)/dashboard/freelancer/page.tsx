"use client";

import { useEffect, useState, useCallback } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Award, BarChart2, Briefcase, FileText, Lightbulb, ShieldCheck, DollarSign, AlertTriangleIcon, Book, Star, Zap, TrendingUp, Gem, Repeat, Handshake, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TypingText } from "@/components/typing-text";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

interface BadgeData {
  title: string;
  icon: string;
}

interface DashboardData {
  recommended_jobs_count: number;
  active_applications_count: number;
  completed_jobs_count: number;
  level: number;
  current_xp: number;
  xp_needed_for_next_level: number;
  latest_badges: BadgeData[];
  leaderboard_rank: number;
  commission_due_amount?: number;
  commission_days_left?: number;
  commission_is_suspended?: boolean;
  can_submit_excuse?: boolean; // For commission excuses
  has_portfolio: boolean;
}

const badgeIcons: { [key: string]: React.ReactNode } = {
  "Top Rated Freelancer": <Award className="text-yellow-500" />,
  "Quick Starter": <Zap className="text-blue-500" />,
  "Rising Talent": <TrendingUp className="text-green-500" />,
  "Loyalty King": <Gem className="text-purple-500" />,
  // Add more mappings as needed
  "award": <Award className="text-yellow-500" />,
  "zap": <Zap className="text-blue-500" />,
  "trending_up": <TrendingUp className="text-green-500" />,
  "gem": <Gem className="text-purple-500" />,
};

export default function FreelancerDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [excuseReason, setExcuseReason] = useState("");
  const [isSubmittingExcuse, setIsSubmittingExcuse] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) { // userLoading is handled by the skeleton, only check for user existence for data fetching
      setLoadingDashboard(false);
      return;
    }
    setLoadingDashboard(true);
    try {
      const response = await api.get<DashboardData>(`/xp-logs/me/`); // Changed to /xp-logs/me/ as per API_ENDPOINTS.md
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch freelancer dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, [user, toast]); // Removed userLoading from dependency array

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSubmitExcuse = async () => {
    if (!excuseReason.trim()) {
      toast({ title: "Error", description: "Excuse reason cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmittingExcuse(true);
    try {
      // Assuming an endpoint for submitting excuses for commissions
      const response = await api.post("/commission-excuses/", { // Corrected endpoint to match API_ENDPOINTS.md
        reason: excuseReason,
        user: user?.id, // Send user ID with the excuse
      });
      if (response.status === 200 || response.status === 201) {
        toast({ title: "Success", description: "Your excuse has been submitted successfully." });
        setIsExcuseModalOpen(false);
        setExcuseReason("");
        fetchDashboardData(); // Refresh dashboard data
      } else {
        const errorData = response.data;
        toast({
          title: "Submission Failed",
          description: errorData.detail || "There was an error submitting your excuse.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting excuse:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingExcuse(false);
    }
  };

  const xpProgressPercentage = dashboardData && dashboardData.xp_needed_for_next_level > 0
    ? (dashboardData.current_xp / dashboardData.xp_needed_for_next_level) * 100
    : 0;
  
  const xpAway = dashboardData ? dashboardData.xp_needed_for_next_level - dashboardData.current_xp : 0;
  
  const latestBadges = dashboardData?.latest_badges || [];

  if (userLoading || loadingDashboard) {
    return (
        <div className="flex flex-col gap-8">
             <Card className="col-span-full bg-card shadow-lg border-b-2 border-primary p-6 md:p-8 lg:p-10 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-4 w-2/3 mx-auto mb-8" />
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-12 w-40 rounded-lg" />
                    <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
            </Card>
            <Separator className="my-4" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="h-full">
                        <CardHeader>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3 mt-1" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-12 w-1/4 mx-auto" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-2/3 mx-auto" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                <div className="flex flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-3/4 mt-1" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-10 w-1/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center py-8 text-red-500">Error loading dashboard data.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Integrated Welcome and Call-to-Action Section */}
      <Card className="col-span-full bg-card shadow-lg border-b-2 border-primary p-6 md:p-8 lg:p-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline text-foreground mb-2">
          Welcome back, {user?.fullName || "Freelancer"}! {/* Changed to fullName */}
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto mb-4">
          <TypingText words={["Showcase Your Talent.", "Find Your Next Gig.", "Grow Your Career."]} speed={100} delay={2000} />
        </p>
        <p className="text-md text-muted-foreground max-w-3xl mx-auto mb-8">
          Your personalized hub for job opportunities, skill growth, and community engagement.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button asChild size="lg" className="shadow-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 transform hover:-translate-y-1">
            <Link href="/jobs">
              <Search className="mr-2 h-5 w-5" />
              Find New Jobs
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-xl border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1">
            <Link href="/portfolio-management">
              <Book className="mr-2 h-5 w-5" />
              Manage Portfolio
            </Link>
          </Button>
        </div>
      </Card>

      <Separator className="my-4" />
      
      {dashboardData.commission_due_amount && dashboardData.commission_due_amount > 0 && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Commission Payment Due!</AlertTitle>
          <AlertDescription>
            You have an outstanding commission of ${dashboardData.commission_due_amount.toFixed(2)}. This is due within{" "}
            <strong>{dashboardData.commission_days_left} days</strong> to avoid account suspension.
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/commissions">View Commission Details</Link>
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExcuseModalOpen(true)}
                disabled={!dashboardData.can_submit_excuse || dashboardData.commission_is_suspended}
              >
                Submit Excuse
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!dashboardData.has_portfolio && (
          <Alert className="bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 shadow-md">
              <Book className="h-4 w-4" />
              <AlertTitle>Boost Your Visibility!</AlertTitle>
              <AlertDescription>
                  Employers love to see your past work. Add your best projects to your portfolio to stand out and land more jobs.
                  <div className="mt-2">
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                          <Link href="/portfolio-management">Manage Portfolio</Link>
                      </Button>
                  </div>
              </AlertDescription>
          </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/recommended-jobs" className="block">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommended Jobs</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.recommended_jobs_count}</div>
              <p className="text-xs text-muted-foreground">Tailored to your skills</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/my-gigs" className="block">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.active_applications_count}</div>
              <p className="text-xs text-muted-foreground">Waiting for responses</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/my-gigs" className="block">
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.completed_jobs_count}</div>
              <p className="text-xs text-muted-foreground">Great work!</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Award className="text-yellow-500 h-5 w-5" /> XP & Gamification
            </CardTitle>
            <CardDescription>
              Level up your profile and earn badges for your achievements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-blue-600 flex items-center justify-center gap-2">
                Level {dashboardData.level} <Zap className="h-10 w-10 text-blue-500 animate-pulse" />
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Keep up the great work!</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Your XP Progress</span>
                <span>{dashboardData.current_xp} / {dashboardData.xp_needed_for_next_level} XP</span>
              </div>
              <Progress value={xpProgressPercentage} className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500" />
              <p className="text-sm text-muted-foreground text-center mt-2">
                You are <span className="font-semibold">{xpAway} XP</span> away from the next level!
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Latest Badges Earned:</h3>
              {latestBadges.length > 0 ? (latestBadges.map((badge) => (
                <div key={badge.title} className="flex items-center gap-4 bg-muted/30 p-3 rounded-md">
                  {badgeIcons[badge.icon as keyof typeof badgeIcons] || <Award className="h-6 w-6 text-gray-500" />}
                  <div>
                    <p className="font-semibold text-lg">{badge.title}</p>
                  </div>
                </div>
              ))) : (<p className="text-muted-foreground">No badges earned yet. Keep hustling!</p>)}
              <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-md">
                <BarChart2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold text-lg">Leaderboard Rank: #{dashboardData.leaderboard_rank}</p>
                  <p className="text-sm text-muted-foreground">Strive for the top!</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/badges">View All Badges & Leaderboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Repeat className="h-5 w-5 text-primary" /> Skill Barter Network
              </CardTitle>
              <CardDescription>Barter your skills and get what you need without cash.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Offer your expertise in exchange for services from other talented professionals.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
                        <Link href="/skill-barter">Explore Barter Opportunities <TrendingUp className="ml-2 h-4 w-4 text-accent-foreground" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="shadow-md border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                        <Link href="/skill-barter/my-applications">My Barter Applications <Handshake className="ml-2 h-4 w-4 text-primary" /></Link>
                    </Button>
                </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <DollarSign /> Your Commissions
              </CardTitle>
              <CardDescription>Track your earnings and payment history.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/commissions">View My Commissions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ShieldCheck /> Loyalty Program
              </CardTitle>
              <CardDescription>Earn rewards and exclusive perks.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/loyalty">Discover Loyalty Rewards</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isExcuseModalOpen} onOpenChange={setIsExcuseModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Commission Excuse</DialogTitle>
            <DialogDescription>
              Please provide a detailed reason for requesting an extension or exemption from your commission payment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., medical emergency, unexpected financial hardship, project delay, etc."
                value={excuseReason}
                onChange={(e) => setExcuseReason(e.target.value)}
                rows={5}
                disabled={isSubmittingExcuse}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExcuseModalOpen(false)} disabled={isSubmittingExcuse}>
              Cancel
            </Button>
            <Button onClick={handleSubmitExcuse} disabled={isSubmittingExcuse || !dashboardData?.can_submit_excuse}>
              {isSubmittingExcuse ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>) : "Submit Excuse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
