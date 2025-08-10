"use client";

import { BarterPostDialog } from "@/components/barter-post-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MakeOfferDialog } from "@/components/make-offer-dialog";
import { useToast } from "@/hooks/use-toast";

interface BarterPost {
    id: string;
    title: string;
    author: string;
    skillsOffered: string[];
    skillsSought: string[];
    postedDate: string;
}

export default function EmployerSkillBarterPage() {
    const [posts, setPosts] = useState<BarterPost[]>([]);
    const [isMakeOfferDialogOpen, setIsMakeOfferDialogOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Simulate fetching data
        const fetchPosts = async () => {
            // In a real application, you would fetch from an API
            const mockBarterPosts: BarterPost[] = [
                {
                    id: "bp-1",
                    title: "Offering Web Dev for SEO Services",
                    author: "John Doe",
                    skillsOffered: ["React", "Next.js", "Node.js"],
                    skillsSought: ["SEO", "Content Strategy"],
                    postedDate: "2024-07-29",
                },
                {
                    id: "bp-2",
                    title: "Graphic Design for Social Media Management",
                    author: "Jane Smith",
                    skillsOffered: ["Logo Design", "Illustration"],
                    skillsSought: ["Social Media Marketing"],
                    postedDate: "2024-07-28",
                },
            ];
            setPosts(mockBarterPosts);
        };

        fetchPosts();
    }, []);

    const handleMakeOfferClick = (postId: string) => {
        setSelectedPostId(postId);
        setIsMakeOfferDialogOpen(true);
    };

    const handleCloseMakeOfferDialog = () => {
        setIsMakeOfferDialogOpen(false);
        setSelectedPostId(null);
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
                    <BarterPostDialog>
                        <Button>Create New Barter Post</Button>
                    </BarterPostDialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>by {post.author} - Posted on {post.postedDate}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <h4 className="font-semibold mb-2">Skills Offered:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {post.skillsOffered.map(skill => <Badge key={skill}>{skill}</Badge>)}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Skills Sought:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {post.skillsSought.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
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
                />
            )}
        </div>
    );
}
