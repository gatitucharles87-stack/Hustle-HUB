"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

// Aligned with backend serializers
interface Application {
  id: string;
  post: {
    id: string;
    title: string;
  };
  applicant: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface Offer {
  id: string;
  post: {
    id: string;
    title: string;
    user: {
        id: string;
        full_name: string;
        avatar_url?: string;
    }
  };
  offered_by: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
}

export default function EmployerMyApplicationsPage() {
  const { user } = useUser();
  const [receivedApplications, setReceivedApplications] = useState<Application[]>([]);
  const [sentOffers, setSentOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchApplicationsAndOffers = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [appsResponse, offersResponse] = await Promise.all([
        api.get('/skill-barter-applications/'), // Fetches both sent and received
        api.get('/skill-barter-offers/')      // Fetches both sent and received
      ]);
      
      // Filter for employer context
      const myPostsApplication = appsResponse.data.filter((app: any) => app.post.user.id === user.id);
      const mySentOffers = offersResponse.data.filter((offer: any) => offer.offered_by.id === user.id);
      
      setReceivedApplications(myPostsApplication);
      setSentOffers(mySentOffers);

    } catch (error) {
      console.error("Failed to fetch applications or offers:", error);
      toast({
        title: "Error",
        description: "Could not fetch your applications and offers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchApplicationsAndOffers();
  }, [fetchApplicationsAndOffers]);

  const handleStatusChange = async (type: 'application' | 'offer', id: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    const url = type === 'application' ? `/skill-barter-applications/${id}/` : `/skill-barter-offers/${id}/`;
    
    try {
      await api.patch(url, { status });
      toast({
        title: `Status Updated`,
        description: `The ${type} has been successfully ${status}.`,
      });
      fetchApplicationsAndOffers(); // Refresh data
    } catch (error) {
      console.error(`Failed to update ${type} status:`, error);
      toast({
        title: "Error",
        description: `Could not update the ${type}.`,
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/skill-barter/edit-post/${postId}`);
  };

  const renderSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent><Skeleton className="h-4 w-full" /></CardContent>
          <CardFooter><Skeleton className="h-10 w-24 ml-auto" /></CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Barter Hub</h1>

      <Tabs defaultValue="received-applications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received-applications">Applications on My Posts</TabsTrigger>
          <TabsTrigger value="sent-offers">My Sent Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="received-applications" className="mt-6">
          {loading ? renderSkeleton() : receivedApplications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {receivedApplications.map((app) => (
                <Card key={app.id}>
                    <CardHeader>
                    <CardTitle>{app.post.title}</CardTitle>
                    <CardDescription>
                        From <Link href={`/freelancers/${app.applicant.id}`} className="text-blue-500 hover:underline">{app.applicant.full_name}</Link>
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="line-clamp-3">{app.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                    <Badge variant={app.status === 'pending' ? 'default' : app.status === 'accepted' ? 'secondary' : 'destructive'}>{app.status}</Badge>
                    {app.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleStatusChange('application', app.id, 'accepted')} size="sm">Accept</Button>
                            <Button onClick={() => handleStatusChange('application', app.id, 'rejected')} size="sm" variant="destructive">Reject</Button>
                        </div>
                    )}
                    </CardFooter>
                </Card>
                ))}
            </div>
          ) : <p>No applications received for your posts yet.</p>}
        </TabsContent>
        <TabsContent value="sent-offers" className="mt-6">
          {loading ? renderSkeleton() : sentOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sentOffers.map((offer) => (
                <Card key={offer.id}>
                    <CardHeader>
                    <CardTitle>{offer.post.title}</CardTitle>
                    <CardDescription>
                        To <Link href={`/freelancers/${offer.post.user.id}`} className="text-blue-500 hover:underline">{offer.post.user.full_name}</Link>
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="line-clamp-3">{offer.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Badge variant={offer.status === 'pending' ? 'default' : offer.status === 'accepted' ? 'secondary' : 'destructive'}>{offer.status}</Badge>
                        {offer.status === 'pending' && (
                            <Button onClick={() => handleStatusChange('offer', offer.id, 'cancelled')} size="sm" variant="ghost">Cancel Offer</Button>
                        )}
                    </CardFooter>
                </Card>
                ))}
            </div>
           ) : <p>You haven't sent any offers yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
