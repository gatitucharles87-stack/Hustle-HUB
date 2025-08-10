"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Application {
  id: string;
  postId: string;
  postTitle: string;
  applicant: User;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

interface Offer {
  id: string;
  applicationId: string;
  applicationTitle: string;
  offerer: User;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  timestamp: Date;
}

export default function EmployerMyApplicationsPage() {
  const [receivedApplications, setReceivedApplications] = useState<Application[]>([]);
  const [sentOffers, setSentOffers] = useState<Offer[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for received applications for employer's barter posts
    const mockReceived: Application[] = [
      {
        id: "app-emp-1",
        postId: "post-emp-1",
        postTitle: "Need SEO Expertise for My E-commerce Site",
        applicant: { id: "user-freelancer-1", name: "Alice SEO Expert", avatar: "https://placehold.co/40x40.png" },
        message: "I can help you rank your e-commerce site on the first page.",
        status: "pending",
        timestamp: new Date(),
      },
    ];
    setReceivedApplications(mockReceived);

    // Mock data for offers sent by employer
    const mockSent: Offer[] = [
      {
        id: "offer-emp-1",
        applicationId: "app-freelancer-2",
        applicationTitle: "Web Dev for Photography Services",
        offerer: { id: "user-photographer-1", name: "Bob Photography", avatar: "https://placehold.co/40x40.png" },
        message: "I'm interested in your photography services. I can build you a professional portfolio website.",
        status: "accepted",
        timestamp: new Date(),
      },
    ];
    setSentOffers(mockSent);
  }, []);

  const handleStatusChange = (setter: Function, id: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    setter((prevItems: any[]) =>
      prevItems.map((item) => (item.id === id ? { ...item, status } : item))
    );
    toast({
      title: `Offer ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `The offer has been successfully ${status}.`,
    });
  };

  const handleEditPost = (postId: string) => {
    router.push(`/skill-barter/edit-post/${postId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Barter Applications</h1>

      <Tabs defaultValue="received-applications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received-applications">Received Applications</TabsTrigger>
          <TabsTrigger value="sent-offers">Sent Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="received-applications" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {receivedApplications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle>{app.postTitle}</CardTitle>
                  <CardDescription>
                    from <Link href={`/freelancers/${app.applicant.id}`} className="text-blue-500 hover:underline">{app.applicant.name}</Link>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{app.message}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {app.status === 'pending' && (
                    <>
                      <Button onClick={() => handleStatusChange(setReceivedApplications, app.id, 'accepted')} size="sm">Accept</Button>
                      <Button onClick={() => handleStatusChange(setReceivedApplications, app.id, 'rejected')} size="sm" variant="destructive">Reject</Button>
                    </>
                  )}
                  {app.status !== 'pending' && <Badge>{app.status}</Badge>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="sent-offers" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sentOffers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <CardTitle>{offer.applicationTitle}</CardTitle>
                  <CardDescription>
                    to <Link href={`/freelancers/${offer.offerer.id}`} className="text-blue-500 hover:underline">{offer.offerer.name}</Link>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{offer.message}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {offer.status === 'pending' && (
                    <>
                      <Button onClick={() => handleEditPost(offer.applicationId)} size="sm" variant="outline">Edit Post</Button>
                      <Button onClick={() => handleStatusChange(setSentOffers, offer.id, 'cancelled')} size="sm" variant="destructive">Cancel</Button>
                    </>
                  )}
                  {offer.status !== 'pending' && <Badge>{offer.status}</Badge>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
