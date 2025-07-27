import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Repeat, Search, Wand2 } from "lucide-react";
import { BarterPostDialog } from "@/components/barter-post-dialog";

const barterListings = [
  {
    user: "Alice Webdev",
    avatar: "https://placehold.co/40x40.png",
    dataAiHint: "woman smiling",
    offers: "React Frontend Development",
    wants: "Professional Logo Design",
  },
  {
    user: "Bob Plumber",
    avatar: "https://placehold.co/40x40.png",
    dataAiHint: "man construction",
    offers: "Plumbing Services (Fixing leaks, installations)",
    wants: "Photography for my new van",
  },
  {
    user: "Charlie Writer",
    avatar: "https://placehold.co/40x40.png",
    dataAiHint: "man writing",
    offers: "Blog Post and SEO Content Writing",
    wants: "Help setting up a simple booking website",
  },
   {
    user: "Diana Designer",
    avatar: "https://placehold.co/40x40.png",
    dataAiHint: "woman designer",
    offers: "UI/UX Design for Mobile Apps",
    wants: "A certified electrician to check my home office wiring",
  },
];


export default function SkillBarterPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Repeat /> Skill Barter Exchange</CardTitle>
          <CardDescription>Trade your skills and services with other talented professionals in the community. No cash involved!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Input placeholder="Search for skills you need or can offer..." className="flex-1" />
                <Button><Search className="mr-2"/>Search</Button>
                <BarterPostDialog>
                  <Button variant="outline">
                    <Wand2 className="mr-2" />
                    Post a New Barter Offer
                  </Button>
                </BarterPostDialog>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barterListings.map((listing, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                        <AvatarImage src={listing.avatar} alt={listing.user} data-ai-hint={listing.dataAiHint} />
                        <AvatarFallback>{listing.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{listing.user}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-1">I can offer:</h4>
                        <p className="text-muted-foreground text-sm">{listing.offers}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-1">In exchange for:</h4>
                        <p className="text-muted-foreground text-sm">{listing.wants}</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full">Make an Offer</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
