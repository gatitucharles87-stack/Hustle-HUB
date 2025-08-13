"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Star, TrendingUp, ChevronRight, Gift, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api"; // Changed to import * as api
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

// Replicate backend LEVEL_THRESHOLDS and BADGE_NAMES for frontend calculation
const LEVEL_THRESHOLDS = [0, 100, 250, 400, 600, 850, 1100, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250, 6000, 6800, 7650, 8550, 9500];
const BADGE_NAMES = [
    'Rookie', 'Hustle Initiate', 'Skill Sprinter', 'Task Tackler', 'Smart Hustler', 
    'Certified Doer', 'Work Warrior', 'Pro Performer', 'Local Legend', 'Trusted Hustler',
    'Efficiency Expert', 'Skill Barter Champ', 'Client Magnet', 'Consistency King/Queen',
    '5-Star Streak', 'Hustle Architect', 'Elite Hustler', 'Hustler Royalty',
    'Hustle Guardian', 'Hustle Legend'
];

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string; 
  badge_type: string; 
}

interface UserBadge {
    id: string;
    badge: BadgeData; // The full badge object as serialized by BadgeSerializer
    user: string;  // ID of the user
    awarded_at: string; // Corrected from unlocked_at to awarded_at
}

// Map icon names to Lucide React components (ensure these icons are consistent with backend data)
const iconMap: { [key: string]: React.ElementType } = (
  {
    "award": Award,
    "check_circle": CheckCircle,
    "star": Star,
    "trending_up": TrendingUp,
    "Award": Award, 
    "CheckCircle": CheckCircle,
    "Star": Star,
    "TrendingUp": TrendingUp,
    "Gift": Gift, // For referral badges perhaps
    "Users": Users, // For community-related badges
    "Zap": Award, // Placeholder for general achievement
    "Globe": Award, // Placeholder for remote work
    "Heart": Award, // Placeholder for good reviews
  });

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
    const [loadingBadges, setLoadingBadges] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadBadgesData = async () => {
            if (userLoading) return; // Wait for user data to load

            if (!user) { // If user is null after loading, stop loading and return
                setLoadingBadges(false);
                return;
            }

            try {
                setLoadingBadges(true);
                const [badgesRes, userBadgesRes] = await Promise.all([
                    api.getBadges(), // Corrected to use named export
                    // For user-specific badges, we might need a dedicated mock or filter existing mocks
                    // Assuming getBadges() can return all badges for now, and we\'ll filter them later if needed.
                    // If backend had /user-badges/ then it should be api.getUserBadges()
                    api.getBadges(), // Placeholder: In a real scenario, this would be an endpoint to get user-specific badges.
                ]);

                setAllBadges(badgesRes.data);
                // This part needs adjustment based on how user-specific badges are mocked/fetched.
                // For now, let\'s assume getBadges() returns *all* possible badges, and userBadgesRes should be a subset
                // that the current user has. Since we don\'t have a separate mock for user badges, 
                // we\'ll simulate it by saying user has the first two badges for demonstration.
                setUserBadges(badgesRes.data.slice(0, 2).map((badge: BadgeData) => ({ 
                    id: `userbadge-${badge.id}`,
                    badge: badge,
                    user: user.id, 
                    awarded_at: new Date().toISOString() 
                })));

            } catch (error) {
                console.error("Failed to fetch badges data", error);
                toast({
                    title: "Error",
                    description: "Failed to load badges data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoadingBadges(false);
            }
        };

        loadBadgesData();
    }, [user, userLoading, toast]); 

    const currentXp = user?.xp_points || 0; 
    const currentLevel = user?.level || 0; 

    // Calculate next level XP based on current level
    let nextLevelXp = 1; // Default to 1 to avoid division by zero
    let xpNeededForNextLevel = 1; // Default value

    if (currentLevel > 0 && currentLevel <= LEVEL_THRESHOLDS.length) {
        nextLevelXp = LEVEL_THRESHOLDS[currentLevel];
        xpNeededForNextLevel = nextLevelXp - currentXp;
    } else if (currentLevel > LEVEL_THRESHOLDS.length) {
        // User is beyond max defined level, set a high target or indicate max level
        nextLevelXp = currentXp + 1; // Arbitrary value if max level reached
        xpNeededForNextLevel = 0; // No more XP needed for next level
    }

    const progressPercentage = (currentXp / nextLevelXp) * 100;

    const progressBarColor = () => {
        if (progressPercentage >= 100) return "bg-green-500"; // Maxed out
        if (progressPercentage > 90) return "bg-lime-500";
        if (progressPercentage > 70) return "bg-emerald-500";
        if (progressPercentage > 50) return "bg-yellow-500";
        return "bg-primary";
    };

    // Combine all badges with user\'s unlocked status
    const combinedBadges = allBadges.map((badge: BadgeData) => ({
        ...badge,
        unlocked: userBadges.some(ub => ub.badge.id === badge.id), 
    }));

    // Filter badges to show only unlocked ones if preferred, or all with status
    // For now, show all with unlocked status

    if (userLoading || loadingBadges) {
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
                    <LevelDisplay level={currentLevel} /> 
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Your XP Progress</span>
                        <span className="text-sm font-bold text-primary">{currentXp} / {nextLevelXp} XP</span>
                    </div>
                    <Progress value={progressPercentage} className="h-4" indicatorClassName={progressBarColor()} />
                    {xpNeededForNextLevel > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            You are <strong>{xpNeededForNextLevel} XP</strong> away from the next level!
                        </p>
                    ) : (
                        <p className="text-sm text-green-600 font-semibold">
                            Congratulations! You\'ve reached the highest level defined or are beyond the next threshold.
                        </p>
                    )}
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
                        {combinedBadges.map((badge: BadgeData & { unlocked: boolean }) => {
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
                                                    badge.unlocked ? "text-yellow-500" : "text-muted-foreground" 
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