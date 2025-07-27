import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PenSquare, Users, Briefcase, CheckCircle, Map, Star, Gift } from "lucide-react";
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

export default function EmployerDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome, Employer!
          </h1>
          <p className="text-muted-foreground">
            Manage your job postings and applicants.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/post-job">
            <PenSquare className="mr-2" />
            Post a New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Currently open for applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+15 in the last day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Successfully filled positions</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">Earned from referrals & activity</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Job Listings</CardTitle>
            <CardDescription>An overview of all your posted jobs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Plumber for Leaky Faucet</TableCell>
                  <TableCell><Badge variant="outline">Open</Badge></TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">View Applicants</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Frontend Developer (React)</TableCell>
                  <TableCell><Badge>In Progress</Badge></TableCell>
                  <TableCell>1 (Selected)</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">View Applicant</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Graphic Designer for Logo</TableCell>
                  <TableCell><Badge variant="destructive">Closed</Badge></TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" disabled>View Applicants</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Map /> Find Freelancers Nearby</CardTitle>
                <CardDescription>Use our map to discover and hire skilled freelancers in your area.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/map">
                        Open Map View
                    </Link>
                </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Gift /> Referrals & Loyalty</CardTitle>
                <CardDescription>Earn loyalty points by referring new users to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/referrals">
                        Go to Referrals Page
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
