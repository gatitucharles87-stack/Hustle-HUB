import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Star, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const badges = [
    {
        icon: Star,
        title: "Top Rated Freelancer",
        description: "Maintain a 5-star rating across 10+ jobs.",
        unlocked: true,
        color: "text-yellow-500",
    },
    {
        icon: CheckCircle,
        title: "Job Completionist",
        description: "Successfully complete 25 jobs.",
        unlocked: true,
        color: "text-green-500",
    },
    {
        icon: TrendingUp,
        title: "Category Expert",
        description: "Complete 10 jobs in the same category.",
        unlocked: false,
        color: "text-blue-500",
    },
     {
        icon: Award,
        title: "Community Helper",
        description: "Receive 5 'Helpful' votes in the Skill Barter exchange.",
        unlocked: false,
        color: "text-indigo-500",
    },
]

export default function BadgesPage() {
  const currentXp = 1250;
  const nextLevelXp = 2000;
  const progressPercentage = (currentXp / nextLevelXp) * 100;

  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">XP & Gamification</CardTitle>
          <CardDescription>
            Earn Experience Points (XP) by completing jobs and participating in the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Your XP Progress</span>
            <span className="text-sm font-bold text-primary">{currentXp} / {nextLevelXp} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-4" />
           <p className="text-sm text-muted-foreground">
            You are <strong>{nextLevelXp - currentXp} XP</strong> away from the next level!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Award /> My Badges</CardTitle>
          <CardDescription>
            Here is your collection of earned badges. Keep up the great work to unlock more!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
                <Card key={index} className={`transition-all duration-300 flex flex-col ${badge.unlocked ? 'border-primary shadow-lg' : 'opacity-60 bg-muted/50'}`}>
                    <CardHeader className="flex-grow">
                        <div className="flex items-center gap-4">
                            <badge.icon className={`h-12 w-12 p-2 rounded-lg bg-background ${badge.unlocked ? badge.color : 'text-muted-foreground'}`} />
                            <div>
                                <CardTitle className="text-lg">{badge.title}</CardTitle>
                                <CardDescription>{badge.description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         {badge.unlocked ? (
                            <div className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle size={16} /> Unlocked</div>
                         ) : (
                            <div className="text-sm font-semibold text-muted-foreground">Locked</div>
                         )}
                    </CardContent>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
