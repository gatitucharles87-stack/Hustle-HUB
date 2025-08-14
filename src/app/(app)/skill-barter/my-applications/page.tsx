'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  profilePictureUrl: string;
}

interface ReceivedApplication {
  id: string;
  skill_barter_post: {
    id: string;
    title: string;
    user: UserProfile;
  };
  applicant: UserProfile;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface SentOffer {
  id: string;
  skill_barter_post: {
    id: string;
    title: string;
    user: UserProfile;
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
}

export default function MyApplicationsPage() {
  const [receivedApplications, setReceivedApplications] = useState<ReceivedApplication[]>([]);
  const [sentOffers, setSentOffers] = useState<SentOffer[]>([]);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  // Disable direct API calls as endpoints are not available
  const fetchReceivedApplications = async () => {
    setLoadingReceived(false);
    // setReceivedApplications([]); // Keep it empty as no data can be fetched
  };

  // Disable direct API calls as endpoints are not available
  const fetchSentOffers = async () => {
    setLoadingSent(false);
    // setSentOffers([]); // Keep it empty as no data can be fetched
  };

  useEffect(() => {
    // These functions will now just set loading to false immediately
    fetchReceivedApplications();
    fetchSentOffers();
  }, [user, userLoading]);

  // Keep these handlers, they will not be called as no data is fetched
  const handleAcceptApplication = async (applicationId: string) => {
    toast({
        title: "Feature Unavailable",
        description: "Accepting applications is not available without backend API.",
        variant: "destructive",
    });
  };

  const handleRejectApplication = async (applicationId: string) => {
    toast({
        title: "Feature Unavailable",
        description: "Rejecting applications is not available without backend API.",
        variant: "destructive",
    });
  };

  const handleCancelOffer = async (offerId: string) => {
    toast({
        title: "Feature Unavailable",
        description: "Cancelling offers is not available without backend API.",
        variant: "destructive",
    });
  };

  const handleEditAssociatedPost = (postId: string) => {
    router.push(`/skill-barter/edit-post/${postId}`);
    toast({
      title: "Redirecting to Edit Post",
      description: `Navigating to edit post ID: ${postId}`,
      duration: 3000,
    });
  };

  if (userLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Barter Applications & Offers</h1>

      <Tabs defaultValue="received-applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received-applications">Received Applications</TabsTrigger>
          <TabsTrigger value="sent-offers">Sent Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="received-applications" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loadingReceived ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No applications received yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent-offers" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loadingSent ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No offers sent yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
