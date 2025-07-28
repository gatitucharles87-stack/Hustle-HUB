
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Search } from "lucide-react";

const jobListings = [
  {
    title: "Urgent: Fix Leaky Kitchen Sink",
    category: "Home Services",
    type: "Local",
    location: "Nairobi, Kenya",
    tags: ["Urgent", "Plumbing"],
    description: "Water is dripping from under the sink. Need an experienced plumber to fix it today.",
  },
  {
    title: "Build a Responsive React Landing Page",
    category: "Tech",
    type: "Remote",
    location: "Remote",
    tags: ["React", "Web Development"],
    description: "Looking for a skilled frontend developer to create a modern and fast landing page for our new product.",
  },
  {
    title: "Professional Headshots for Corporate Team",
    category: "Photography",
    type: "Local",
    location: "Mombasa, Kenya",
    tags: ["Photography", "Corporate"],
    description: "We need a photographer for a team of 15 people. Must have a portfolio.",
  },
    {
    title: "Design a new Logo for a Startup",
    category: "Design",
    type: "Remote",
    location: "Remote",
    tags: ["Logo Design", "Branding"],
    description: "We are a new tech startup and need a modern and memorable logo.",
  },
];


export default function JobsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Search /> Filter Jobs</CardTitle>
            <CardDescription>Refine your search to find the perfect gig.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="search-area">Area or Neighborhood</Label>
                <Input id="search-area" placeholder="e.g., 'South B' or 'Utawala'" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="search-job-type">Job Type</Label>
                <Select>
                    <SelectTrigger id="search-job-type">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="search-category">Category</Label>
                <Select>
                    <SelectTrigger id="search-category">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="home-services">Home Services</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Apply Filters</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">
          Available Jobs ({jobListings.length})
        </h1>
        <div className="space-y-4">
          {jobListings.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{job.title}</CardTitle>
                    <Badge variant={job.type === 'Local' ? 'outline' : 'default'}>
                        {job.type}
                    </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.category}</span>
                    </div>
                     <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{job.description}</p>
                <div className="flex gap-2">
                  {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
