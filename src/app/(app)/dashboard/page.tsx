import { DashboardCard } from "@/components/dashboard-card";
import { DollarSign, Briefcase, Award, Star } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, User!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your activity on HustleHub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Earnings"
          value="$12,345"
          description="+20.1% from last month"
          icon={DollarSign}
        />
        <DashboardCard
          title="Completed Jobs"
          value="52"
          description="+12 since last month"
          icon={Briefcase}
        />
        <DashboardCard
          title="Loyalty Points"
          value="1,250"
          description="Next reward at 2,000 points"
          icon={Award}
        />
        <DashboardCard
          title="Average Rating"
          value="4.9"
          description="Based on 48 reviews"
          icon={Star}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Placeholder for recent activity or upcoming bookings */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="mt-2 text-sm text-muted-foreground">No recent activity to show.</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold">Upcoming Bookings</h3>
            <p className="mt-2 text-sm text-muted-foreground">You have no upcoming bookings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
