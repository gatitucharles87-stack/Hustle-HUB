import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Star, TrendingUp } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-8">
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
                <Card key={index} className={`transition-opacity ${badge.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <badge.icon className={`h-10 w-10 ${badge.color}`} />
                        <div>
                            <CardTitle className="text-lg">{badge.title}</CardTitle>
                            <CardDescription>{badge.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                         {badge.unlocked ? (
                            <div className="text-sm font-semibold text-green-600">Unlocked</div>
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
