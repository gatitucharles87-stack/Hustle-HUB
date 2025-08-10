'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  // Placeholder data using state
  const [settings, setSettings] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    newsletter: false,
  });

  const handleSwitchChange = (id: keyof typeof settings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSaveChanges = () => {
    // In a real app, you would send this data to your backend
    console.log("Saving settings:", settings);
    toast({
      title: "Settings Saved!",
      description: "Your notification settings have been updated successfully.",
    });
  };

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
              <Label htmlFor="jobAlerts" className="font-medium">New Job Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a new job matching your skills is posted.</p>
            </div>
            <Switch id="jobAlerts" checked={settings.jobAlerts} onCheckedChange={(checked) => handleSwitchChange("jobAlerts", checked)} />
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="applicationUpdates" className="font-medium">Application Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when an employer views or updates your application.</p>
            </div>
            <Switch id="applicationUpdates" checked={settings.applicationUpdates} onCheckedChange={(checked) => handleSwitchChange("applicationUpdates", checked)} />
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="newsletter" className="font-medium">HustleHub Newsletter</Label>
              <p className="text-sm text-muted-foreground">Receive occasional updates, news, and tips from our team.</p>
            </div>
            <Switch id="newsletter" checked={settings.newsletter} onCheckedChange={(checked) => handleSwitchChange("newsletter", checked)} />
          </div>
        </CardContent>
         <CardFooter>
            <Button onClick={handleSaveChanges}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
