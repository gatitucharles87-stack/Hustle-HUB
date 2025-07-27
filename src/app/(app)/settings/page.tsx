import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings, profile, and notification preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">U</span>
            </div>
            <Button variant="outline">Upload New Photo</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Current User" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled />
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="bio">Profile Bio</Label>
                <Textarea id="bio" placeholder="Tell us a little about yourself" rows={4} defaultValue="Experienced freelancer specializing in web development and design." />
            </div>
        </CardContent>
        <CardFooter>
            <Button>Save Profile</Button>
        </CardFooter>
      </Card>
      
      <Separator />

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

      <Separator />

       <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
            </div>
        </CardContent>
        <CardFooter>
            <Button>Update Password</Button>
        </CardFooter>
      </Card>

    </div>
  );
}
