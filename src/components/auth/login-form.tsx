
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api"; // Corrected import
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [role, setRole] = useState("freelancer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const response = await loginUser({ // Use the new function
        email,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userRole', role);
      }
      router.push(`/dashboard/${role}`);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
      <Button type="submit" className="w-full" onClick={handleLogin}>
          <LogIn className="mr-2 h-4 w-4" /> Login
      </Button>
    </div>
  );
}
