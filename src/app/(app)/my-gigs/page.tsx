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

const appliedJobs = [
    {
        title: "Build a Responsive React Landing Page",
        category: "Tech",
        status: "Pending",
        date: "2024-06-05",
    },
    {
        title: "Professional Headshots for Corporate Team",
        category: "Photography",
        status: "Viewed",
        date: "2024-06-02",
    },
];

const upcomingGigs = [
    {
        title: "Plumber for Leaky Faucet",
        employer: "John Doe",
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: "Accepted",
    },
     {
        title: "Frontend Developer (React)",
        employer: "Jane Smith",
        date: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: "Accepted",
    }
];

export default function MyGigsPage() {
  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Gigs</h1>
            <p className="text-muted-foreground">
                Track your job applications and upcoming gigs.
            </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase /> Active Applications</CardTitle>
                        <CardDescription>Your currently active job applications.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                {appliedJobs.map((job, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell>{job.category}</TableCell>
                                        <TableCell>{job.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={job.status === 'Pending' ? 'secondary' : 'default'}>
                                                {job.status === 'Pending' ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                                                {job.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="xl:col-span-1">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> Upcoming Gigs</CardTitle>
                        <CardDescription>Your schedule for accepted jobs. Click a date to see details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <JobCalendar events={upcomingGigs} />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
