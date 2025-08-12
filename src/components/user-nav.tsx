"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreditCard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export function UserNav() {
  const { user, loading: userLoading, logout } = useUser();

  if (userLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }
  
  // Determine the billing link based on user's role
  const billingLink = user?.role === 'employer' ? '/billing' : '/commissions';

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.profilePictureUrl || undefined}
                  alt={user.fullName || "User Avatar"}
                />
                <AvatarFallback>
                  {user.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
}
