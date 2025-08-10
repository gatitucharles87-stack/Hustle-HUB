
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
import { UserPlus, Info, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export function SignupForm() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("freelancer");
    const [isRemote, setIsRemote] = useState(false);
    const [serviceAreas, setServiceAreas] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

    const router = useRouter();
    const { toast } = useToast();

    const handleSignup = async () => {
        setIsSubmitting(true);
        setUsernameError(null);
        setUsernameSuggestions([]);

        const payload = {
            full_name: fullName,
            username,
            email,
            password,
            user_type: role,
            is_remote: role === 'freelancer' ? isRemote : undefined,
            service_areas: role === 'freelancer' ? serviceAreas.split(',').map(s => s.trim()).filter(Boolean) : undefined,
            referral_code: referralCode || undefined,
        };

        try {
            await api.post('/users/', payload);
            toast({
                title: "Account created!",
                description: "You have successfully signed up. Please log in.",
            });
            router.push('/login');
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData) {
                if (errorData.username && Array.isArray(errorData.username) && errorData.username.length > 1) {
                    setUsernameError(errorData.username[0]);
                    setUsernameSuggestions(errorData.username[1].suggestions || []);
                } else {
                    const errorMessage = errorData.email?.[0] || errorData.username?.[0] || errorData.detail || "Failed to sign up.";
                     toast({
                        title: "Signup Failed",
                        description: errorMessage,
                        variant: "destructive",
                    });
                }
            } else {
                 toast({
                    title: "Signup Failed",
                    description: "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setUsername(suggestion);
        setUsernameError(null);
        setUsernameSuggestions([]);
    };

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe" required value={username} onChange={(e) => setUsername(e.target.value)} />
                {usernameError && (
                    <div className="text-red-500 text-sm flex items-center gap-2 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <div>
                            {usernameError}
                            {usernameSuggestions.length > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-semibold">Try:</span>
                                    {usernameSuggestions.map(s => (
                                        <Badge
                                            key={s}
                                            variant="secondary"
                                            className="cursor-pointer"
                                            onClick={() => handleSuggestionClick(s)}
                                        >
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
                        <Switch id="remote-only" checked={isRemote} onCheckedChange={setIsRemote} />
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
                        <Input id="areas" placeholder="e.g., Nairobi CBD, Rongai, Kasarani" value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} />
                    </div>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                <Input id="referral-code" placeholder="Enter code" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
            </div>
            <Button type="button" className="w-full" onClick={handleSignup} disabled={isSubmitting}>
                {isSubmitting ? 'Signing Up...' : <><UserPlus className="mr-2 h-4 w-4" /> Sign Up</>}
            </Button>
        </div>
    );
}
