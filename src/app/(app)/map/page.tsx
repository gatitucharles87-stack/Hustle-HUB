import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Map View</CardTitle>
          <CardDescription>Visualize freelancers and jobs in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">The interactive map will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
