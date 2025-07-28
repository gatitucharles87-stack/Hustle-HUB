
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SignupForm() {
    const [role, setRole] = useState("freelancer");
    const router = useRouter();

    const handleSignup = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('userRole', role);
        }
        router.push(`/dashboard/${role}`);
    };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input id="full-name" placeholder="John Doe" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">I am a...</Label>
        <Select onValueChange={setRole} defaultValue="freelancer">
          <SelectTrigger id="role">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freelancer">Freelancer</SelectItem>
            <SelectItem value="employer">Employer</SelectItem>
          </SelectContent>
        </Select>
      </div>
        {role === 'freelancer' && (
            <>
                <div className="grid gap-2 p-4 border rounded-lg">
                    <Label>Availability Settings</Label>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="remote-only" className="font-normal flex items-center gap-2">
                            Do you offer remote services?
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Select if you can work on projects remotely.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Switch id="remote-only" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="areas" className="flex items-center gap-2">
                            Which local areas do you work in?
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Enter a comma-separated list of areas, e.g., Westlands, Embakasi.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input id="areas" placeholder="e.g., Nairobi CBD, Rongai, Kasarani" />
                    </div>
                </div>
            </>
        )}
      <Button type="submit" className="w-full" onClick={handleSignup}>
          <UserPlus className="mr-2 h-4 w-4" /> Sign Up
      </Button>
    </div>
  );
}
