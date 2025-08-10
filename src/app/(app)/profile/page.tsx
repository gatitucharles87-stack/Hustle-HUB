
"use client";

import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, loading, logout } = useUser();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
        <Button disabled>Logout</Button>
      </div>
    );
  }

  if (!user) {
    return <div>Failed to load user data.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profilePictureUrl} alt={user.username || "user avatar"} /> {/* Changed to profilePictureUrl, added fallback for alt */}
            <AvatarFallback>{user.username?.charAt(0).toUpperCase() || user.fullName.charAt(0).toUpperCase()}</AvatarFallback> {/* Added optional chaining and fallback to fullName */}
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.fullName}</p> {/* Changed to fullName */}
            {user.username && <p className="text-muted-foreground">@{user.username}</p>} {/* Conditionally render if username exists */}
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
