"use client"
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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    referral_code: string;
    xp_points: number;
}

interface ReferralEntry {
    id: string;
    referred_user_email: string;
    created_at: string;
    is_successful: boolean;
    status: string;
}

const placeholderReferralHistory: ReferralEntry[] = [
    { id: "1", referred_user_email: "jane.doe@example.com", created_at: "2024-07-20", is_successful: true, status: "Completed" },
    { id: "2", referred_user_email: "peter.jones@example.com", created_at: "2024-07-18", is_successful: true, status: "Completed" },
    { id: "3", referred_user_email: "susan.smith@example.com", created_at: "2024-07-15", is_successful: false, status: "Pending" },
];

const placeholderUserProfile: UserProfile = {
    id: "user-123",
    email: "current.user@example.com",
    full_name: "Current User",
    role: "freelancer",
    referral_code: "REF123XYZ",
    xp_points: 500,
};

export default function ReferralsPage() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [referralHistory, setReferralHistory] = useState<ReferralEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const referralLink = userProfile ? `https://hustlehub.app/signup?ref=${userProfile.referral_code}` : "";

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUserProfile(placeholderUserProfile);
            setReferralHistory(placeholderReferralHistory);
            setLoading(false);
        }, 1000);
    }, []);

    const successfulReferralsCount = referralHistory.filter(ref => ref.is_successful).length;
    const loyaltyPointsEarned = successfulReferralsCount * 100; 

    const handleCopyLink = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            toast({
                title: "Link Copied!",
                description: "Your referral link has been copied to your clipboard.",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-8">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl">Loading Referrals...</CardTitle></CardHeader>
                    <CardContent>Loading your referral data. Please wait...</CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Gift /> Referrals & Loyalty</CardTitle>
                    <CardDescription>
                        Invite friends and colleagues to HustleHub and earn loyalty points for every successful referral.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Users /> Your Referrals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{successfulReferralsCount}</p>
                                <p className="text-sm text-muted-foreground">Successful referrals made</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Star /> Loyalty Points Earned</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{loyaltyPointsEarned}</p>
                                <p className="text-sm text-muted-foreground">Points earned from referrals</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Your Unique Referral Link</h3>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg bg-background">
                            <code className="flex-1 text-sm text-muted-foreground">
                                {referralLink || "Generating link..."}
                            </code>
                            <Button variant="outline" onClick={handleCopyLink} disabled={!referralLink}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Link
                            </Button>
                            <Button variant="outline" disabled>
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Referral History</h3>
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Referred User Email</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Points Earned</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referralHistory.length > 0 ? (
                                        referralHistory.map((ref) => (
                                            <TableRow key={ref.id}>
                                                <TableCell className="font-medium">{ref.referred_user_email}</TableCell>
                                                <TableCell>{new Date(ref.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={ref.is_successful ? "default" : "secondary"}>
                                                        {ref.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{ref.is_successful ? `+100` : '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                                                No referral history found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
