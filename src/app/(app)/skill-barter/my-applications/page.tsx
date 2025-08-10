'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast'; // Corrected import
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  id: string;
  username: string; // Keep as string for routing
  fullName: string; // Changed from full_name
  profilePictureUrl: string; // Changed from profile_picture_url
}

interface ReceivedApplication {
  id: string;
  skill_barter_post: {
    id: string;
    title: string;
    user: UserProfile; // The owner of the post
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
    user: UserProfile; // The owner of the post
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
  const { toast } = useToast(); // Corrected destructuring
  const { user, loading: userLoading } = useUser();

  const fetchReceivedApplications = async () => {
    if (!user) return;
    setLoadingReceived(true);
    try {
      // Fetch applications where the logged-in user is the owner of the barter post
      const response = await api.get(`/skill-barter-applications/?post_owner_id=${user.id}`);
      setReceivedApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch received applications", error);
      toast({
        title: "Error",
        description: "Failed to load received applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingReceived(false);
    }
  };

  const fetchSentOffers = async () => {
    if (!user) return;
    setLoadingSent(true);
    try {
      // Fetch offers made by the logged-in user
      const response = await api.get(`/skill-barter-offers/?user_id=${user.id}`);
      setSentOffers(response.data);
    } catch (error) {
      console.error("Failed to fetch sent offers", error);
      toast({
        title: "Error",
        description: "Failed to load sent offers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSent(false);
    }
  };

  useEffect(() => {
    if (user && !userLoading) {
      fetchReceivedApplications();
      fetchSentOffers();
    }
  }, [user, userLoading]);

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await api.patch(`/skill-barter-applications/${applicationId}/`, { status: 'accepted' });
      toast({
        title: "Application Accepted!",
        description: "The barter application has been accepted.",
        duration: 3000,
      });
      fetchReceivedApplications(); // Refresh the list
    } catch (error: any) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to accept application.",
        variant: "destructive",
      });
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await api.patch(`/skill-barter-applications/${applicationId}/`, { status: 'rejected' });
      toast({
        title: "Application Rejected!",
        description: "The barter application has been rejected.",
        duration: 3000,
      });
      fetchReceivedApplications(); // Refresh the list
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to reject application.",
        variant: "destructive",
      });
    }
  };

  const handleCancelOffer = async (offerId: string) => {
    try {
      await api.patch(`/skill-barter-offers/${offerId}/`, { status: 'cancelled' });
      toast({
        title: "Offer Cancelled!",
        description: "Your barter offer has been cancelled.",
        duration: 3000,
      });
      fetchSentOffers(); // Refresh the list
    } catch (error: any) {
      console.error("Error cancelling offer:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to cancel offer.",
        variant: "destructive",
      });
    }
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
            ) : receivedApplications.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No applications received yet.</p>
            ) : (
              receivedApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <CardTitle>{application.skill_barter_post.title}</CardTitle>
                    <CardDescription>
                      Application from <Link href={`/freelancers/${application.applicant.username}`} className="text-blue-600 hover:underline">
                        {application.applicant.fullName} {/* Changed to fullName */}
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={application.applicant.profilePictureUrl} /> {/* Changed to profilePictureUrl */}
                        <AvatarFallback>{application.applicant.fullName.charAt(0)}</AvatarFallback> {/* Changed to fullName */}
                      </Avatar>
                      <div>
                        <Link href={`/freelancers/${application.applicant.username}`} className="font-semibold text-blue-600 hover:underline">
                          {application.applicant.fullName} {/* Changed to fullName */}
                        </Link>
                        <p className="text-sm text-gray-500">{new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{application.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {application.status === 'pending' ? (
                      <>
                        <Button onClick={() => handleAcceptApplication(application.id)} size="sm">Accept</Button>
                        <Button onClick={() => handleRejectApplication(application.id)} size="sm" variant="destructive">Reject</Button>
                      </>
                    ) : (
                      <Badge variant="outline">{application.status}</Badge>
                    )}
                  </CardFooter>
                </Card>
              ))
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
            ) : sentOffers.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No offers sent yet.</p>
            ) : (
              sentOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <CardTitle>Offer for: {offer.skill_barter_post.title}</CardTitle>
                    <CardDescription>
                      To <Link href={`/freelancers/${offer.skill_barter_post.user.username}`} className="text-blue-600 hover:underline">
                        {offer.skill_barter_post.user.fullName} {/* Changed to fullName */}
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={offer.skill_barter_post.user.profilePictureUrl} /> {/* Changed to profilePictureUrl */}
                        <AvatarFallback>{offer.skill_barter_post.user.fullName.charAt(0)}</AvatarFallback> {/* Changed to fullName */}
                      </Avatar>
                      <div>
                        <Link href={`/freelancers/${offer.skill_barter_post.user.username}`} className="font-semibold text-blue-600 hover:underline">
                          {offer.skill_barter_post.user.fullName} {/* Changed to fullName */}
                        </Link>
                        <p className="text-sm text-gray-500">{new Date(offer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{offer.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {offer.status === 'pending' ? (
                      <>
                        <Button onClick={() => handleEditAssociatedPost(offer.skill_barter_post.id)} size="sm" variant="outline">View Post</Button>
                        <Button onClick={() => handleCancelOffer(offer.id)} size="sm" variant="destructive">Cancel Offer</Button>
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
