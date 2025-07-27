import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";


const commissionHistory = [
    {
        jobTitle: "Frontend Developer (React)",
        completionDate: "2024-05-20",
        earnings: 500,
        commission: 100,
        status: "Paid",
    },
    {
        jobTitle: "Graphic Designer for Logo",
        completionDate: "2024-05-15",
        earnings: 250,
        commission: 50,
        status: "Paid",
    },
    {
        jobTitle: "Plumber for Leaky Faucet",
        completionDate: "2024-06-01",
        earnings: 225,
        commission: 45,
        status: "Due in 8 days",
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function CommissionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><DollarSign /> My Commissions</CardTitle>
          <CardDescription>
            Track your job earnings and the 20% platform commission for each completed project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Your Earnings</TableHead>
                        <TableHead>Commission (20%)</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {commissionHistory.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.jobTitle}</TableCell>
                            <TableCell>{item.completionDate}</TableCell>
                            <TableCell>{formatCurrency(item.earnings)}</TableCell>
                            <TableCell className="font-medium text-destructive">{formatCurrency(item.commission)}</TableCell>
                            <TableCell>
                                <Badge variant={item.status === 'Paid' ? 'default' : 'destructive'}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
