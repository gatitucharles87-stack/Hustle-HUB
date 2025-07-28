
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Search, UserSearch } from "lucide-react";
import Link from "next/link";
import { LocationSelector } from "@/components/location-selector";

const freelancers = [
  {
    name: "Alex Plumber",
    avatar: "https://placehold.co/80x80.png",
    dataAiHint: "man plumber",
    specialty: "Emergency Plumbing",
    location: "Nairobi, Westlands",
    rating: 4.9,
  },
  {
    name: "Brenda FrontendDev",
    avatar: "https://placehold.co/80x80.png",
    dataAiHint: "woman developer",
    specialty: "React & Next.js",
    location: "Remote",
    rating: 5.0,
  },
  {
    name: "Charles Electrician",
    avatar: "https://placehold.co/80x80.png",
    dataAiHint: "man electrician",
    specialty: "Wiring & Installations",
    location: "Mombasa, Mvita",
    rating: 4.7,
  },
    {
    name: "Diana GraphicDesign",
    avatar: "https://placehold.co/80x80.png",
    dataAiHint: "woman designer",
    specialty: "Logo & Brand Identity",
    location: "Remote",
    rating: 4.8,
  },
];


export default function HirePage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><UserSearch /> Find a Freelancer</CardTitle>
          <CardDescription>Refine your search to find the perfect professional.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="search-keywords">Keywords or Skills</Label>
                  <Input id="search-keywords" placeholder="e.g., 'React' or 'Plumber'" />
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
           </div>
           <LocationSelector />
        </CardContent>
        <CardFooter>
          <Button className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search Freelancers
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">
          Available Freelancers ({freelancers.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {freelancers.map((freelancer, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="items-center text-center">
                 <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} data-ai-hint={freelancer.dataAiHint} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{freelancer.name}</CardTitle>
                <CardDescription className="text-sm text-primary">{freelancer.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{freelancer.location}</span>
                </div>
                 <div className="flex items-center justify-center gap-1 font-bold text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span>{freelancer.rating}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto flex-1" asChild>
                    <Link href="/profile">View Profile</Link>
                </Button>
                <Button className="w-full sm:w-auto flex-1">Hire Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
