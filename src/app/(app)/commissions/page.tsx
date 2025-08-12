"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user";
import { getCommissionHistory } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
import { DollarSign, Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CommissionItem {
    id: string;
    job_title: string; // Corresponds to SerializerMethodField
    completion_date: string;
    earnings: number; // Corresponds to freelancer_earning in backend
    commission_amount: number;
    status: string;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function CommissionsPage() {
  const { user, loading: userLoading } = useUser();
  const [commissionHistory, setCommissionHistory] = useState<CommissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && !userLoading) {
      const fetchCommissions = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getCommissionHistory();
          setCommissionHistory(response.data); // Extract data from AxiosResponse
        } catch (err: any) {
          console.error("Failed to fetch commission history:", err);
          setError("Failed to load commission history. Please try again later.");
          // Do not toast here if it's causing infinite loop. The error state will be rendered.
        } finally {
          setLoading(false);
        }
      };
      fetchCommissions();
    } else if (!user && !userLoading) {
      setLoading(false);
      setError("You must be logged in to view your commissions.");
    }
  }, [user, userLoading]); // Removed toast from dependencies

  const totalEarnings = commissionHistory.reduce((acc, item) => acc + item.earnings, 0);
  const totalCommissions = commissionHistory.reduce((acc, item) => acc + item.commission_amount, 0);
  const netEarnings = totalEarnings - totalCommissions;

  const renderContent = () => {
    if (userLoading || loading) {
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="bg-red-50 border-red-300 text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (commissionHistory.length === 0) {
      return (
        <Alert className="bg-blue-50 border-blue-300 text-blue-800">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <AlertTitle className="font-bold">No Commission History Yet!</AlertTitle>
          <AlertDescription>
            It looks like you haven't completed any jobs with commissions yet. Once you do, your commission details will appear here.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
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
                {commissionHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.job_title}</TableCell>
                    <TableCell>{item.completion_date}</TableCell>
                    <TableCell>{formatCurrency(item.earnings)}</TableCell>
                    <TableCell className="font-medium text-destructive">{formatCurrency(item.commission_amount)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'paid' ? 'default' : 'destructive'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Commissions & Earnings</h1>
        <p className="text-muted-foreground">
          Track your earnings and platform commissions.
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
