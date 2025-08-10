"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast"; // Corrected import path
import { formatDistanceToNow } from "date-fns"; // Assuming date-fns is installed for time formatting

// Mock data for user's skill barter posts and offers received
// In a real application, this data would be fetched from the backend API
const myBarterPosts = [
  {
    id: "post-1",
    title: "React Frontend Development for Logo Design",
    status: "active",
    offersReceived: 3,
    description: "I offer expert React frontend development in exchange for professional logo design for my startup."
  },
  {
    id: "post-2",
    title: "Plumbing Services for Photography",
    status: "inactive",
    offersReceived: 1,
    description: "Need a photographer for my new van. I can offer plumbing services in return."
  },
];

const offersReceived = [
  {
    id: "offer-1",
    postId: "post-1",
    postTitle: "React Frontend Development for Logo Design",
    offerer: {
      id: "user-a",
      name: "John Doe",
      avatar: "https://placehold.co/40x40.png",
    },
    message: "Hi, I'm a graphic designer and love your idea! I can create a modern logo for you. Let's connect!",
    status: "pending", // pending, accepted, rejected
    timestamp: new Date(Date.now() - 3600 * 1000 * 5), // 5 hours ago
  },
  {
    id: "offer-2",
    postId: "post-1",
    postTitle: "React Frontend Development for Logo Design",
    offerer: {
      id: "user-b",
      name: "Jane Smith",
      avatar: "https://placehold.co/40x40.png",
    },
    message: "I specialize in minimalist logo design. Interested in discussing your React project. Here's my portfolio: [link]",
    status: "pending",
    timestamp: new Date(Date.now() - 3600 * 1000 * 24 * 2), // 2 days ago
  },
  {
    id: "offer-3",
    postId: "post-2",
    postTitle: "Plumbing Services for Photography",
    offerer: {
      id: "user-c",
      name: "Mike Photography",
      avatar: "https://placehold.co/40x40.png",
    },
    message: "I'm a professional photographer, I can shoot your van. What kind of plumbing services do you offer?",
    status: "pending",
    timestamp: new Date(Date.now() - 3600 * 1000 * 24 * 7), // 7 days ago
  },
];

export default function MyBarterPostsPage() {
  const { toast } = useToast(); // Initialize useToast hook
  // TODO: Implement SWR or React Query for fetching data from /api/skill-barter-posts/ (filtered by user) and /api/skill-barter-offers/

  const handleAcceptOffer = async (offerId: string) => {
    // Mocking the action for now
    toast({
      title: "Offer Accepted! (Mock)",
      description: `Offer ${offerId} has been accepted. (Backend integration needed)`,
    });
    // TODO: Implement actual PUT request to /api/skill-barter-offers/<offer_pk>/accept/ (or similar)
    // You might need to refetch offers after this action
  };

  const handleRejectOffer = async (offerId: string) => {
    // Mocking the action for now
    toast({
      title: "Offer Rejected! (Mock)",
      description: `Offer ${offerId} has been rejected. (Backend integration needed)`,
      variant: "destructive"
    });
    // TODO: Implement actual PUT request to /api/skill-barter-offers/<offer_pk>/reject/ (or similar)
    // You might need to refetch offers after this action
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">My Skill Barter Posts & Offers</h1>

      <Tabs defaultValue="my-posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          <TabsTrigger value="offers-received">Offers Received</TabsTrigger>
        </TabsList>
        <TabsContent value="my-posts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBarterPosts.length === 0 ? (
              <p className="text-muted-foreground col-span-full">You haven't created any skill barter posts yet.</p>
            ) : (
              myBarterPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <Badge variant={post.status === 'active' ? 'default' : 'outline'}>
                        {post.status}
                      </Badge>
                    </div>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Offers Received: <strong>{post.offersReceived}</strong></p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm">View Offers</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="offers-received" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offersReceived.length === 0 ? (
              <p className="text-muted-foreground col-span-full">No offers have been received on your posts yet.</p>
            ) : (
              offersReceived.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={offer.offerer.avatar} alt={offer.offerer.name} />
                      <AvatarFallback>{offer.offerer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Offer from {offer.offerer.name}</CardTitle>
                      <CardDescription className="text-sm">For your post: "{offer.postTitle}"</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-2">{offer.message}</p>
                    <p className="text-xs text-muted-foreground">Received {formatDistanceToNow(offer.timestamp, { addSuffix: true })}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {offer.status === 'pending' ? (
                      <>
                        <Button onClick={() => handleAcceptOffer(offer.id)} size="sm">Accept</Button>
                        <Button onClick={() => handleRejectOffer(offer.id)} size="sm" variant="destructive">Reject</Button>
                      </>
                    ) : (
                      <Badge variant="outline">{offer.status}</Badge>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}