"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export function LoginForm() {
  const [role, setRole] = useState("freelancer");

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input id="password" type="password" required />
      </div>
       <div className="grid gap-2">
        <Label>Select your role to login</Label>
        <RadioGroup defaultValue="freelancer" onValueChange={setRole} className="flex gap-4">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="r-freelancer" />
                <Label htmlFor="r-freelancer">Freelancer</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer" id="r-employer" />
                <Label htmlFor="r-employer">Employer</Label>
            </div>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full" asChild>
        <Link href={`/dashboard/${role}`}>
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Link>
      </Button>
    </div>
  );
}
