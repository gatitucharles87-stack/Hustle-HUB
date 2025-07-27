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

const referralHistory = [
    {
        name: "John Doe",
        date: "2024-05-15",
        status: "Completed Sign Up",
        points: 100
    },
    {
        name: "Jane Smith",
        date: "2024-05-20",
        status: "Pending",
        points: 0
    },
    {
        name: "Peter Jones",
        date: "2024-04-10",
        status: "Completed Sign Up",
        points: 100
    }
];

export default function ReferralsPage() {
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
                        <p className="text-3xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Successful referrals made</p>
                    </CardContent>
                </Card>
                 <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Star /> Loyalty Points Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">300</p>
                        <p className="text-sm text-muted-foreground">Points earned from referrals</p>
                    </CardContent>
                </Card>
            </div>
          
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Unique Referral Link</h3>
              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-background">
                <code className="flex-1 text-sm text-muted-foreground">
                  https://hustlehub.app/ref/user123abc
                </code>
                <Button variant="outline">Copy Link</Button>
                <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
              </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold mb-2">Referral History</h3>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Referred User</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Points Earned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {referralHistory.map((ref, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{ref.name}</TableCell>
                                    <TableCell>{ref.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={ref.status === "Completed Sign Up" ? "default" : "secondary"}>
                                            {ref.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{ref.points > 0 ? `+${ref.points}`: '-'}</TableCell>
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
