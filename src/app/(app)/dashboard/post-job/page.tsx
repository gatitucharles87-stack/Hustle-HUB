import { JobPostForm } from "@/components/job-post-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PostJobPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create a New Job Posting</CardTitle>
          <CardDescription>
            Fill in the details below. Use our AI assistant to generate a compelling title and description for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobPostForm />
        </CardContent>
      </Card>
    </div>
  );
}
