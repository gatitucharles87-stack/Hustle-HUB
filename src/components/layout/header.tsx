"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AlignLeft, Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDisplay } from "@/components/notifications-display";
import { UserNav } from "@/components/user-nav"; // Import UserNav
import { useUser } from "@/hooks/use-user"; // Import useUser hook

const navigation: { name: string; href: string }[] = [
  // Add any common navigation links here if needed across user types
];

export default function AppHeader() {
  const { user, loading: userLoading } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const handleUnreadCountChange = (count: number) => {
    setUnreadNotificationCount(count);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="mr-4 md:hidden">
              <AlignLeft className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2">
              {/* Removed HustleHub text from mobile header */}
            </Link>
            <div className="h-full overflow-y-auto py-4">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            {/* Removed HustleHub text from desktop header */}
          </Link>
          <div className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                  <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                      {item.name}
                  </Link>
              ))}
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications Icon */}
            {!userLoading && user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            )}

            {/* User Navigation (Profile, Logout, etc.) */}
            {!userLoading && (user ? <UserNav /> : <Button asChild><Link href="/login">Login</Link></Button>)}
            <ThemeToggle />
          </div>
        </div>
      </div>
      <NotificationsDisplay
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onUnreadCountChange={handleUnreadCountChange}
      />
    </header>
  );
}
