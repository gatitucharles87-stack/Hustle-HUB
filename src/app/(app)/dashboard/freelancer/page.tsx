import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, BarChart2, Briefcase, FileText, Gift, Lightbulb, UserCheck, ShieldCheck, DollarSign } from "lucide-react";
import Link from "next/link";

export default function FreelancerDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, Freelancer!
        </h1>
        <p className="text-muted-foreground">
          Here are your recommended jobs and account status.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Commission Payment Due!</AlertTitle>
        <AlertDescription>
           You have an outstanding commission of $45.00. This is due within <strong>8 days</strong> to avoid account suspension.
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/commissions">View Commission Details</Link>
            </Button>
            <Button variant="link" size="sm">Submit Excuse</Button>
          </div>
        </AlertDescription>
      </Alert>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommended Jobs</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Based on your skills and location</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Waiting for employer responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Gamification</CardTitle>
            <CardDescription>Track your progress and achievements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>XP Progress</span>
                <span className="text-sm font-medium">1,250 / 2,000 XP</span>
              </div>
              {/* Note: A progress bar component would be ideal here */}
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: "62.5%"}}></div>
              </div>
              <div className="flex items-center gap-4">
                <Award className="text-yellow-500" /> 
                <div>
                    <p className="font-semibold">Top Rated Freelancer</p>
                    <p className="text-sm text-muted-foreground">Achieved last month</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <BarChart2 className="text-green-500" /> 
                <div>
                    <p className="font-semibold">Leaderboard Rank: #12</p>
                    <p className="text-sm text-muted-foreground">Top 10% in your category</p>
                </div>
              </div>
               <Button variant="outline" className="w-full" asChild>
                  <Link href="/skill-barter">Access Skill Barter Exchange</Link>
               </Button>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck /> My Badges</CardTitle>
                <CardDescription>View your collection of earned badges and achievements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/badges">
                        View My Badges
                    </Link>
                </Button>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><DollarSign /> My Commissions</CardTitle>
                <CardDescription>Track your owed commissions and payment history.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/commissions">
                        View My Commissions
                    </Link>
                </Button>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
