"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"; // Corrected import path

export default function ResetPasswordConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const [uidb64, setUidb64] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast(); // Initialize useToast hook

  useEffect(() => {
    if (params.uidb64 && typeof params.uidb64 === 'string') {
      setUidb64(params.uidb64);
    }
    if (params.token && typeof params.token === 'string') {
      setToken(params.token);
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!uidb64 || !token) {
      setMessage("Invalid password reset link.");
      toast({
        title: "Error",
        description: "Invalid password reset link. Missing UID or token.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/password-reset-confirm/${uidb64}/${token}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
        setMessage("Your password has been reset successfully. You can now log in with your new password.");
        toast({
          title: "Success",
          description: "Password reset successful!",
        });
        // Optionally redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.detail || "Failed to reset password. Please check the link or try again.");
        toast({
          title: "Error",
          description: errorData.detail || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
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
          <CardTitle className="text-2xl font-bold font-headline">Set New Password</CardTitle>
          <CardDescription>
            Enter and confirm your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !uidb64 || !token}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
            {message && (
              <p className="text-center text-sm font-medium mt-4" style={{ color: message.includes("Success") || message.includes("reset successfully") ? "green" : "red" }}>
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
