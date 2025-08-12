"use client";

import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

export default function SignupPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref'); // Get the referral code from the URL

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Logo />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Create your account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm referralCode={referralCode} />{/* Pass referralCode to SignupForm */}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
