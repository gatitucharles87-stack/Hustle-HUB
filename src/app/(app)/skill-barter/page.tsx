"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Repeat, Search, Wand2 } from "lucide-react";
import { BarterPostDialog } from "@/components/barter-post-dialog";
import { MakeOfferDialog } from "@/components/make-offer-dialog";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface BarterPost {
  id: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    profile_picture_url: string;
  };
  offers_description: string;
  wants_description: string;
}

export default function SkillBarterPage() {
  const [barterListings, setBarterListings] = useState<BarterPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBarterPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/skill-barter-posts/", {
        params: { search: searchTerm },
      });
      setBarterListings(response.data);
    } catch (error) {
      console.error("Failed to fetch barter posts", error);
      toast({
        title: "Error",
        description: "Failed to load skill barter posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarterPosts();
  }, []); // Initial fetch on component mount

  const handleSearch = () => {
    fetchBarterPosts(); // Re-fetch with current search term
  };

  const handleMakeOfferClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsOfferModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Repeat /> Skill Barter Exchange</CardTitle>
          <CardDescription>Trade your skills and services with other talented professionals in the community. No cash involved!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Input placeholder="Search for skills you need or can offer..." className="flex-1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Button onClick={handleSearch}><Search className="mr-2"/>Search</Button>
                <BarterPostDialog onPostCreated={fetchBarterPosts}> {/* Pass a callback to refresh posts */}
                  <Button variant="outline">
                    <Wand2 className="mr-2" />
                    Post a New Barter Offer
                  </Button>
                </BarterPostDialog>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : barterListings.length > 0 ? (
              barterListings.map((listing) => (
                <Card key={listing.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                          <AvatarImage src={listing.user.profile_picture_url} alt={listing.user.full_name} />
                          <AvatarFallback>{listing.user.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{listing.user.full_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <div className="mb-4">
                          <h4 className="font-semibold text-sm mb-1">I can offer:</h4>
                          <p className="text-muted-foreground text-sm">{listing.offers_description}</p>
                      </div>
                       <div>
                          <h4 className="font-semibold text-sm mb-1">In exchange for:</h4>
                          <p className="text-muted-foreground text-sm">{listing.wants_description}</p>
                      </div>
                  </CardContent>
                   <CardFooter>
                      <Button className="w-full" onClick={() => handleMakeOfferClick(listing.id)}>Make an Offer</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No skill barter posts found. Be the first to post!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPostId && (
        <MakeOfferDialog
          postId={selectedPostId}
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
        />
      )}
    </div>
  );
}
