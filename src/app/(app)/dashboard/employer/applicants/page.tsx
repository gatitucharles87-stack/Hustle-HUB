import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Check, User, X } from "lucide-react";
import Link from "next/link";


const applicants = [
    {
        name: "Brenda FrontendDev",
        avatar: "https://placehold.co/80x80.png",
        dataAiHint: "woman developer",
        date: "2024-06-10",
        profileLink: "/profile",
    },
    {
        name: "Alex Plumber",
        avatar: "https://placehold.co/80x80.png",
        dataAiHint: "man plumber",
        date: "2024-06-11",
        profileLink: "/profile",
    }
]

export default function ViewApplicantsPage() {
    return (
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Applicants for "Plumber for Leaky Faucet"</CardTitle>
            <CardDescription>
              Review the profiles of freelancers who have applied for your job.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint={applicant.dataAiHint} />
                          <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{applicant.name}</p>
                           <Button variant="link" asChild className="p-0 h-auto">
                            <Link href={applicant.profileLink}>View Profile</Link>
                           </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{applicant.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-green-100 text-green-800 hover:bg-green-200">
                          <Check className="mr-2" /> Accept
                        </Button>
                        <Button variant="outline" size="sm" className="bg-red-100 text-red-800 hover:bg-red-200">
                           <X className="mr-2" /> Reject
                        </Button>
                      </div>
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
  