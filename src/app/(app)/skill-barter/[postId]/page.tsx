"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Repeat, User2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { MakeOfferDialog } from "@/components/make-offer-dialog";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SkillBarterPostDetails {
  id: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    profile_picture_url: string;
  };
  offers_description: string;
  wants_description: string;
  title: string;
  description: string;
  created_at: string;
}

export default function SkillBarterPostDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const postId = params.postId as string;
  const [post, setPost] = useState<SkillBarterPostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const fetchPostDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/skill-barter-posts/${postId}/`);
      setPost(response.data);
    } catch (error) {
      console.error("Failed to fetch skill barter post details", error);
      toast({
        title: "Error",
        description: "Failed to load skill barter post details. Please try again later.",
        variant: "destructive",
      });
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId, toast]); // Dependencies for useCallback

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId, fetchPostDetails]); // Add fetchPostDetails as a dependency

  const handleOfferSubmitted = () => {
    // Re-fetch post details or update UI after an offer is submitted
    fetchPostDetails(); 
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle><div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div></CardTitle>
            <CardDescription><div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="h-10 bg-blue-500 rounded w-24 animate-pulse"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Skill Barter Post not found.</h2>
        <p className="text-muted-foreground">Please check the URL or browse other posts.</p>
        <Button asChild className="mt-4">
          <Link href="/skill-barter">Browse All Skill Barter Posts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <Repeat className="h-4 w-4" /> <span>Skill Barter Offer</span>
            <span className="mx-2">•</span>
            <User2 className="h-4 w-4" /> 
            <Link href={`/freelancers/${post.user.username}`} className="hover:underline">
              {post.user.full_name}
            </Link>
            <span className="mx-2">•</span>
            <span>Posted: {new Date(post.created_at).toLocaleDateString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.user.profile_picture_url} alt={post.user.full_name} />
              <AvatarFallback>{post.user.full_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.user.full_name}</p>
              <p className="text-sm text-muted-foreground">@{post.user.username}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2"><MessageSquare /> I can offer:</h3>
            <p className="text-muted-foreground">{post.offers_description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2"><MessageSquare /> In exchange for:</h3>
            <p className="text-muted-foreground">{post.wants_description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Full Description:</h3>
            <p className="text-muted-foreground">{post.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => setIsOfferModalOpen(true)}>
            Make an Offer
          </Button>
        </CardFooter>
      </Card>
      {post && (
        <MakeOfferDialog
          postId={post.id}
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          onOfferSubmitted={handleOfferSubmitted} // Added the missing prop
        />
      )}
    </div>
  );
}
