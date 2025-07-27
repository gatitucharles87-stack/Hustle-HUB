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

const totalEarnings = commissionHistory.reduce((acc, job) => acc + job.earnings, 0);
const totalCommissions = commissionHistory.reduce((acc, job) => acc + job.commission, 0);
const netEarnings = totalEarnings - totalCommissions;


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function CommissionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Commissions & Earnings</h1>
        <p className="text-muted-foreground">
            Track your earnings and platform commissions.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalEarnings)}</p>
                </div>
                 <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Commissions Paid</h3>
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(totalCommissions)}</p>
                </div>
                 <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Net Earnings</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(netEarnings)}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2"><DollarSign /> Commission History</CardTitle>
          <CardDescription>
            A detailed history of your job earnings and the 20% platform commission for each completed project.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}