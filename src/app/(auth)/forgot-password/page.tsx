"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // This is a placeholder for your backend API call
      // In a real application, this would send an email with a reset link
      const response = { ok: true }; // Simulate success
      // const response = await fetch("http://localhost:8000/api/password-reset/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email }),
      // });

      if (response.ok) {
        setMessage("If an account with that email exists, a password reset link has been sent to your email address. Please check your inbox (and spam folder).");
        toast({
          title: "Success",
          description: "Password reset email sent. Check your inbox.",
        });
        setEmail("");
      } else {
        // const errorData = await response.json();
        const errorData = { detail: "Failed to send password reset email. Please try again." }; // Simulate error
        setMessage(errorData.detail || "Failed to send password reset email. Please try again.");
        toast({
          title: "Error",
          description: errorData.detail || "Failed to send password reset email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      setMessage("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-headline">Forgot Your Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
            {message && (
              <p className="text-center text-sm font-medium mt-4" style={{ color: message.includes("Success") ? "green" : "red" }}>
                {message}
              </p>
            )}
            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
