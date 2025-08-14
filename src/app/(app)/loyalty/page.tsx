"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Gift, Star, Users, Share2, Copy } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface LoyaltyLog {
    id: string;
    source: string; // e.g., 'referral', 'job_completion'
    points: number;
    created_at: string;
}

interface Referral {
    id: string;
    referred_user: {
        full_name: string;
    };
    is_successful: boolean;
    created_at: string;
}

export default function LoyaltyPage() {
    const { user, loading: userLoading } = useUser();
    const { toast } = useToast();
    const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyLog[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoadingData(true);
        try {
            // TODO: The /referrals/ endpoint is not yet available in the api.ts file.
            // const [loyaltyResponse, referralsResponse] = await Promise.all([
            //     api.getLoyaltyPoints(),
            //     api.getReferrals()
            // ]);
            const loyaltyResponse = await api.getLoyaltyPoints();
            setLoyaltyHistory(loyaltyResponse.data);
            // setReferrals(referralsResponse.data);
        } catch (error) {
            console.error("Failed to fetch loyalty data:", error);
            toast({
                title: "Error",
                description: "Failed to load loyalty program data.",
                variant: "destructive",
            });
        } finally {
            setLoadingData(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);
    
    const totalPoints = loyaltyHistory.reduce((sum, log) => sum + log.points, 0);
    const successfulReferrals = referrals.filter(r => r.is_successful).length;

    const referralLink = user ? `${window.location.origin}/signup?ref=${user.referral_code}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        toast({ title: "Copied!", description: "Referral link copied to clipboard." });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on HustleHub!',
                text: `I'm inviting you to join HustleHub, a platform for freelancers and employers. Sign up using my link:`,
                url: referralLink,
            }).catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            handleCopy();
            toast({ title: "Share this link", description: "Your referral link has been copied to the clipboard. Share it with your friends!" });
        }
    };
    
    if (userLoading || loadingData) {
        return (
            <div className="flex flex-col gap-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Gift /> Loyalty Program</CardTitle>
          <CardDescription>
            Earn loyalty points for referrals and platform activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Star /> Your Loyalty Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalPoints}</p>
                        <p className="text-sm text-muted-foreground">Available to redeem</p>
                    </CardContent>
                </Card>
                 <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Users /> Successful Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{successfulReferrals}</p>
                        <p className="text-sm text-muted-foreground">Friends who joined</p>
                    </CardContent>
                </Card>
            </div>
          
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Unique Referral Link</h3>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 p-4 border rounded-lg bg-background">
                <code className="flex-1 text-sm text-muted-foreground overflow-x-auto">
                  {referralLink}
                </code>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                  <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                </div>
              </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold mb-2">Loyalty History</h3>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Points Earned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loyaltyHistory.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium capitalize">{item.source.replace(/_/g, ' ')}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right font-medium">{item.points > 0 ? `+${item.points}`: '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </Card>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
