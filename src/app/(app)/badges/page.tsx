"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Star, TrendingUp, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string; // This should match a key in iconMap
  badge_type: string; // e.g., "LEVEL", "COMPLETION"
}

interface UserBadge {
    id: string;
    badge: string; // ID of the badge
    user: string;  // ID of the user
    unlocked_at: string;
}

interface GamificationData {
    currentXp: number; // Corrected from current_xp
    nextLevelXp: number; // Corrected from xp_needed_for_next_level
    currentLevel: number; // Added as per backend
}

// Map icon names to Lucide React components (ensure these icons are consistent with backend data)
const iconMap: { [key: string]: React.ElementType } = {
    "award": Award,
    "check_circle": CheckCircle,
    "star": Star,
    "trending_up": TrendingUp,
    // Add more mappings as needed based on backend 'icon' field values
    "Award": Award, // Keeping for backward compatibility if backend uses PascalCase
    "CheckCircle": CheckCircle,
    "Star": Star,
    "TrendingUp": TrendingUp,
};

// Level Display Component
function LevelDisplay({ level }: { level: number }) {
    const levelColors = [
        "text-gray-500", // Level 1-2
        "text-green-500", // Level 3-5
        "text-blue-500", // Level 6-9
        "text-purple-500", // Level 10-14
        "text-yellow-500", // Level 15-19
        "text-red-500", // Level 20+
    ];

    const getLevelColor = (lvl: number) => {
        if (lvl >= 20) return levelColors[5];
        if (lvl >= 15) return levelColors[4];
        if (lvl >= 10) return levelColors[3];
        if (lvl >= 6) return levelColors[2];
        if (lvl >= 3) return levelColors[1];
        return levelColors[0];
    };

    return (
        <div className="flex items-center gap-2">
            <span className={cn("font-bold text-4xl", getLevelColor(level))}>Level {level}</span>
            <Award className={cn("h-8 w-8", getLevelColor(level))} />
        </div>
    );
}

export default function BadgesPage() {
    const { user, loading: userLoading } = useUser();
    const [allBadges, setAllBadges] = useState<BadgeData[]>([]);
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
    const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadGamificationData = async () => {
            if (!user || userLoading) {
                setLoading(false); // Ensure loading is false if user is not available
                return;
            }

            try {
                setLoading(true);
                // user is guaranteed to be non-null here due to the check above
                const [badgesRes, userBadgesRes, xpLogsRes] = await Promise.all([
                    api.get<BadgeData[]>("/badges/"),
                    api.get<UserBadge[]>(`/user-badges/?user_id=${user.id}`),
                    api.get<GamificationData>("/xp-logs/me/"),
                ]);

                setAllBadges(badgesRes.data);
                setUserBadges(userBadgesRes.data);
                setGamificationData(xpLogsRes.data);
            } catch (error) {
                console.error("Failed to fetch gamification data", error);
                toast({
                    title: "Error",
                    description: "Failed to load gamification data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadGamificationData();
    }, [user, userLoading, toast]); // Rerun when user or userLoading changes

    const combinedBadges = allBadges.map(badge => ({
        ...badge,
        unlocked: userBadges.some(ub => ub.badge === badge.id), // Assuming badge.id is the common key
    }));

    const currentXp = gamificationData?.currentXp || 0; // Corrected variable name
    const nextLevelXp = gamificationData?.nextLevelXp || 1; // Corrected variable name
    const currentLevel = gamificationData?.currentLevel || 0; // Corrected variable name

    const progressPercentage = (currentXp / nextLevelXp) * 100;

    const progressBarColor = () => {
        if (progressPercentage > 90) return "bg-green-500";
        if (progressPercentage > 50) return "bg-yellow-500";
        return "bg-primary";
    };

    if (loading || userLoading) {
        return (
            <div className="flex flex-col gap-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-1/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="flex flex-col">
                                    <CardHeader className="flex-grow">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-12 w-12 rounded-lg" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-4 w-20" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Award /> XP & Gamification
                    </CardTitle>
                    <CardDescription>
                        Earn Experience Points (XP) by completing jobs and participating in the community.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LevelDisplay level={currentLevel} /> {/* Corrected to currentLevel */}
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Your XP Progress</span>
                        <span className="text-sm font-bold text-primary">{currentXp} / {nextLevelXp} XP</span> {/* Corrected variables */}
                    </div>
                    <Progress value={progressPercentage} className="h-4" indicatorClassName={progressBarColor()} />
                    <p className="text-sm text-muted-foreground">
                        You are <strong>{nextLevelXp - currentXp} XP</strong> away from the next level!
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Award /> My Badges
                    </CardTitle>
                    <CardDescription>
                        Here is your collection of earned badges. Keep up the great work to unlock more!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {combinedBadges.map((badge, index: number) => {
                            const IconComponent = iconMap[badge.icon as keyof typeof iconMap];
                            return (
                                <Card key={badge.id} className={cn(
                                    "transition-all duration-300 flex flex-col",
                                    badge.unlocked ? "border-primary shadow-lg" : "opacity-60 bg-muted/50"
                                )}>
                                    <CardHeader className="flex-grow">
                                        <div className="flex items-center gap-4">
                                            {IconComponent && (
                                                <IconComponent className={cn(
                                                    "h-12 w-12 p-2 rounded-lg bg-background",
                                                    badge.unlocked ? "text-yellow-500" : "text-muted-foreground" // Example color for badges
                                                )} />
                                            )}
                                            <div>
                                                <CardTitle className="text-lg">{badge.name}</CardTitle>
                                                <CardDescription>{badge.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {badge.unlocked ? (
                                            <div className="text-sm font-bold text-green-600 flex items-center gap-2">
                                                <CheckCircle size={16} /> Unlocked
                                            </div>
                                        ) : (
                                            <div className="text-sm font-semibold text-muted-foreground">Locked</div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}