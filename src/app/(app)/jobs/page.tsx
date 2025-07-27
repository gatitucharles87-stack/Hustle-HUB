import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function JobsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Find Jobs</CardTitle>
          <CardDescription>Browse and filter job listings to find your next opportunity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Job listings will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
