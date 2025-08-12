"use client";

import { BarterPostDialog } from "@/components/barter-post-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { MakeOfferDialog } from "@/components/make-offer-dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface BarterPost {
    id: string;
    title: string;
    user: { // Updated to match UserSerializer structure
        id: string;
        full_name: string;
        // Add other user fields if needed for display, e.g., avatar_url
    };
    description: string; // Add description
    skills_offered: string[]; // Renamed to match backend
    skills_wanted: string[]; // Renamed to match backend
    created_at: string; // Renamed to match backend
    is_active: boolean; // Add is_active field
}

export default function EmployerSkillBarterPage() {
    const [posts, setPosts] = useState<BarterPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMakeOfferDialogOpen, setIsMakeOfferDialogOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchBarterPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/skill-barter-posts/');
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch barter posts:", error);
            toast({
                title: "Error",
                description: "Failed to load skill barter posts.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchBarterPosts();
    }, [fetchBarterPosts]);

    const handleMakeOfferClick = (postId: string) => {
        setSelectedPostId(postId);
        setIsMakeOfferDialogOpen(true);
    };

    const handleCloseMakeOfferDialog = () => {
        setIsMakeOfferDialogOpen(false);
        setSelectedPostId(null);
    };

    const handleOfferSubmitted = () => {
        handleCloseMakeOfferDialog();
        toast({
            title: "Offer Sent",
            description: "Your offer has been successfully sent!",
        });
        fetchBarterPosts(); // Refresh posts after an offer is made
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Skill Barter Exchange</h1>
                    <p className="text-muted-foreground">Exchange your services with other skilled professionals.</p>
                </div>
                <div className="space-x-4">
                    <Button asChild variant="outline">
                        <Link href="/skill-barter/employer/my-applications">My Barter Applications</Link>
                    </Button>
                    <BarterPostDialog onPostCreated={fetchBarterPosts}> {/* Pass callback here */}
                        <Button>Create New Barter Post</Button>
                    </BarterPostDialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4 mt-4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>by {post.user.full_name} - Posted on {new Date(post.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.description}</p>
                                <div>
                                    <h4 className="font-semibold mb-2">Skills Offered:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {post.skills_offered.map(skill => <Badge key={skill}>{skill}</Badge>)}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Skills Sought:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {post.skills_wanted.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleMakeOfferClick(post.id)}>Make an Offer</Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-center text-muted-foreground">No barter posts available.</p>
                )}
            </div>

            {selectedPostId && (
                <MakeOfferDialog
                    postId={selectedPostId}
                    isOpen={isMakeOfferDialogOpen}
                    onClose={handleCloseMakeOfferDialog}
                    onOfferSubmitted={handleOfferSubmitted} // Pass callback to refresh posts
                />
            )}
        </div>
    );
}
