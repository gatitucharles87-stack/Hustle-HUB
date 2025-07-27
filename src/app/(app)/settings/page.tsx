import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage how you receive notifications from HustleHub.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications from HustleHub.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="job-alerts" className="font-medium">New Job Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a new job matching your skills is posted.</p>
            </div>
            <Switch id="job-alerts" defaultChecked />
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="application-updates" className="font-medium">Application Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when an employer views or updates your application.</p>
            </div>
            <Switch id="application-updates" defaultChecked />
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="newsletter" className="font-medium">HustleHub Newsletter</Label>
              <p className="text-sm text-muted-foreground">Receive occasional updates, news, and tips from our team.</p>
            </div>
            <Switch id="newsletter" />
          </div>
        </CardContent>
         <CardFooter>
            <Button>Save Notifications</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
