import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Gift, Star, Users, Share2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const loyaltyHistory = [
    {
        activity: "Referred John Doe",
        date: "2024-05-15",
        status: "Completed",
        points: 100
    },
    {
        activity: "Referred Jane Smith",
        date: "2024-05-20",
        status: "Pending",
        points: 0
    },
     {
        activity: "Completed 10th Job",
        date: "2024-05-22",
        status: "Completed",
        points: 50
    },
    {
        activity: "Referred Peter Jones",
        date: "2024-04-10",
        status: "Completed",
        points: 100
    }
];

export default function LoyaltyPage() {
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
                        <p className="text-3xl font-bold">450</p>
                        <p className="text-sm text-muted-foreground">Available to redeem</p>
                    </CardContent>
                </Card>
                 <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Users /> Successful Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Friends who joined</p>
                    </CardContent>
                </Card>
            </div>
          
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Unique Referral Link</h3>
              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-background">
                <code className="flex-1 text-sm text-muted-foreground">
                  https://hustlehub.app/ref/employer456xyz
                </code>
                <Button variant="outline">Copy Link</Button>
                <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Points Earned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loyaltyHistory.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.activity}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "Completed" ? "default" : "secondary"}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
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
