import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Define the RecommendedJob interface
export interface RecommendedJob {
    id: string;
    title: string;
    description: string;
    budget_type: string;
    budget_amount: string;
    category: {
        id: string;
        name: string;
    } | null;
    status: string;
    created_at: string;
    // Add any other fields that a recommended job might have
}

interface RecommendedJobCardProps {
    job: RecommendedJob;
}

export function RecommendedJobCard({ job }: RecommendedJobCardProps) {
    // TODO: Implement the actual RecommendedJobCard component based on design and functionality.
    // This is a placeholder to resolve the import error.
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">{job.title}</CardTitle>
                {job.category && (
                    <Badge variant="secondary" className="mt-2 w-fit">
                        <Briefcase className="h-3 w-3 mr-1" />{job.category.name}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground line-clamp-3 mb-4">
                    {job.description || "No description provided."}
                </CardDescription>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    Budget: {job.budget_type === 'fixed' ? `$${job.budget_amount}` : `${job.budget_amount}/hr`}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                    Status: <Badge variant="outline" className="ml-1">{job.status}</Badge>
                </div>
            </CardContent>
            <CardFooter className="pt-4">
                <Button asChild className="w-full">
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
