"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CommissionExcuse {
  id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  commission_job_title: string | null;
}

export default function ExcuseHistoryPage() {
  // Placeholder data for excuses
  const excuses: CommissionExcuse[] = [
    {
      id: "1",
      reason: "Due to an unexpected medical emergency, I was unable to complete the payment on time.",
      status: "approved",
      created_at: "2023-07-01T10:00:00Z",
      reviewed_at: "2023-07-03T15:30:00Z",
      commission_job_title: "Website Redesign Project",
    },
    {
      id: "2",
      reason: "There was a significant delay in receiving payment from another client, impacting my ability to pay the commission.",
      status: "pending",
      created_at: "2023-07-10T09:00:00Z",
      reviewed_at: null,
      commission_job_title: "Mobile App Development",
    },
    {
      id: "3",
      reason: "I experienced a technical issue with my bank transfer, which has now been resolved.",
      status: "rejected",
      created_at: "2023-06-20T11:45:00Z",
      reviewed_at: "2023-06-22T10:00:00Z",
      commission_job_title: "Brand Logo Design",
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My Commission Excuses
        </h1>
        <p className="text-muted-foreground">
          Track the status of your submitted commission excuses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Excuse History</CardTitle>
          <CardDescription>All your past and pending excuse submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {excuses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commission Job</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Reviewed On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {excuses.map((excuse) => (
                  <TableRow key={excuse.id}>
                    <TableCell>{excuse.commission_job_title || "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">{excuse.reason}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(excuse.status)}>
                        {excuse.status.charAt(0).toUpperCase() + excuse.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(excuse.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {excuse.reviewed_at
                        ? new Date(excuse.reviewed_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No commission excuses found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
