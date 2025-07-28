
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and security settings.
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
            <CardTitle>Availability & Service Areas</CardTitle>
            <CardDescription>Set your work availability and the local areas you serve.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                <Label htmlFor="remote-available" className="font-medium">Available for Remote Work</Label>
                <p className="text-sm text-muted-foreground">Can you work on projects without being on-site?</p>
                </div>
                <Switch id="remote-available" defaultChecked />
            </div>
            <div className="space-y-2">
                <Label htmlFor="service-areas">Service Areas</Label>
                <Textarea id="service-areas" placeholder="Enter a comma-separated list of areas you serve, e.g., Westlands, Embakasi, South B" rows={3} defaultValue="Nairobi CBD, Rongai, Kasarani" />
            </div>
        </CardContent>
         <CardFooter>
            <Button>Update Availability</Button>
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
