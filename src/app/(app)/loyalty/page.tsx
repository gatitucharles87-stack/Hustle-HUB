"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Users, DollarSign, Gift, LinkIcon, Zap, Star } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import * as api from "@/lib/api";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'; // Added import for Badge

interface LoyaltyLog {
    id: string;
    points: number;
    source: string;
    created_at: string;
}

interface Referral {
    id: string;
    referrer: string; // User ID of the referrer
    referred_user: { // User object of the referred user
        id: string;
        full_name: string;
        username: string;
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
            const [loyaltyResponse, referralsResponse] = await Promise.all([
                api.getLoyaltyPoints(), // Use specific API function
                api.getReferrals() // Use specific API function (assuming it exists or is added)
            ]);

            // Safely access data, assuming mock functions might return arrays directly or { data: [...]} or {data: {...}}
            const loyaltyData = loyaltyResponse.data;
            const referralData = referralsResponse.data;

            setLoyaltyHistory(loyaltyData);
            setReferrals(referralData);
        } catch (error: any) {
            console.error("Failed to fetch loyalty data:", error);
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to load loyalty program data.",
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

    if (userLoading || loadingData) {
        return (
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-4 w-3/4 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Your Loyalty & Referrals</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Loyalty Points</CardTitle>
                        <Gift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPoints}</div>
                        <p className="text-xs text-muted-foreground">Points earned so far</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{successfulReferrals}</div>
                        <p className="text-xs text-muted-foreground">Friends who joined through your link</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Referral Commission</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5%</div>
                        <p className="text-xs text-muted-foreground">On first job completion of referred users</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Share Your Referral Link</CardTitle>
                    <CardDescription>Invite friends and earn rewards!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-grow w-full">
                        <Input
                            readOnly
                            value={referralLink}
                            className="pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-full rounded-l-none"
                            onClick={handleCopy}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button onClick={handleCopy} className="w-full sm:w-auto">Copy Link</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Loyalty Points History</CardTitle>
                    <CardDescription>A log of all your earned and spent loyalty points.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loyaltyHistory.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No loyalty point history yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {loyaltyHistory.map((log) => (
                                <div key={log.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                    <div>
                                        <p className="font-medium">{log.source}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <Badge className="text-lg font-semibold">+{log.points}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
