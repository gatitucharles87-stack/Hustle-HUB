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
import { UserPlus, Info, AlertCircle, XCircle } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface SignupFormProps {
    referralCode?: string | null; // Accept referralCode as a prop
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function SignupForm({ referralCode: initialReferralCode }: SignupFormProps) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("freelancer");
    const [isRemote, setIsRemote] = useState(false);
    const [currentServiceAreaInput, setCurrentServiceAreaInput] = useState("");
    const [serviceAreasString, setServiceAreasString] = useState<string>(""); // Changed to string
    const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
    const [referralCode, setReferralCode] = useState(initialReferralCode || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
    const [serviceAreaError, setServiceAreaError] = useState<string | null>(null);
    
    const debouncedServiceAreaSearchTerm = useDebounce(currentServiceAreaInput, 500);
    const [loadingLocations, setLoadingLocations] = useState(false);

    const router = useRouter();
    const { toast } = useToast();
    const serviceAreaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialReferralCode) {
            setReferralCode(initialReferralCode);
        }
    }, [initialReferralCode]);

    const fetchAllLocations = useCallback(async (searchQuery: string) => {
        if (!searchQuery) {
            setFilteredLocations([]);
            return;
        }

        setLoadingLocations(true);
        try {
            const endpoints = ['counties', 'sub-counties', 'wards', 'neighborhood-tags'];
            const requests = endpoints.map(endpoint => api.get(`${endpoint}/?search=${searchQuery}`));
            const responses = await Promise.all(requests);
            
            const allFetchedLocations = responses.flatMap(response => response.data.map((item: any) => item.name));
            const uniqueLocations = [...new Set(allFetchedLocations)];
            setFilteredLocations(uniqueLocations);

        } catch (error) {
            console.error("Failed to fetch locations:", error);
            toast({
                title: "Error",
                description: "Failed to search locations.",
                variant: "destructive",
            });
        } finally {
            setLoadingLocations(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchAllLocations(debouncedServiceAreaSearchTerm);
    }, [debouncedServiceAreaSearchTerm, fetchAllLocations]);


    const addServiceArea = (area: string) => {
        const currentAreas = serviceAreasString.split(',').map(s => s.trim()).filter(Boolean);
        if (!currentAreas.includes(area)) {
            const newAreas = [...currentAreas, area];
            setServiceAreasString(newAreas.join(', '));
            setCurrentServiceAreaInput(""); // Clear input after adding
            setFilteredLocations([]); // Clear suggestions
            setServiceAreaError(null);
        }
    };

    const removeServiceArea = (areaToRemove: string) => {
        const currentAreas = serviceAreasString.split(',').map(s => s.trim()).filter(Boolean);
        const newAreas = currentAreas.filter(area => area !== areaToRemove);
        setServiceAreasString(newAreas.join(', '));
    };

    const handleServiceAreaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (filteredLocations.length > 0) {
                addServiceArea(filteredLocations[0]);
            } else if (currentServiceAreaInput) {
                setServiceAreaError("Please select a valid location from the suggestions or type a comma-separated list.");
                // Optionally allow adding free text if no suggestions, but prompt user
                // addServiceArea(currentServiceAreaInput); 
            }
        } else if (e.key === 'Backspace' && currentServiceAreaInput === '' && serviceAreasString) {
            // Remove last badge on backspace if input is empty
            e.preventDefault();
            const currentAreas = serviceAreasString.split(',').map(s => s.trim()).filter(Boolean);
            if (currentAreas.length > 0) {
                removeServiceArea(currentAreas[currentAreas.length - 1]);
            }
        }
    };

    const handleSignup = async () => {
        setIsSubmitting(true);
        setUsernameError(null);
        setUsernameSuggestions([]);
        setServiceAreaError(null);

        const payload = {
            full_name: fullName,
            username,
            email,
            password,
            role,
            is_remote_available: role === 'freelancer' ? isRemote : undefined,
            service_areas: role === 'freelancer' ? serviceAreasString : undefined, // Send as string
            referral_code: referralCode || undefined,
        };

        try {
            await api.post('auth/signup/', payload);
            toast({
                title: "Account created!",
                description: "You have successfully signed up.",
            });
            if (role === 'freelancer') {
                router.push('/profile?new_user=true');
            } else {
                router.push('/login');
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData) {
                if (errorData.username) {
                    const usernameErrorInfo = errorData.username[0]; 
                    if (typeof usernameErrorInfo === 'object' && usernameErrorInfo !== null && 'message' in usernameErrorInfo) {
                        setUsernameError(usernameErrorInfo.message);
                        if ('suggestions' in usernameErrorInfo && Array.isArray(usernameErrorInfo.suggestions)) {
                            setUsernameSuggestions(usernameErrorInfo.suggestions);
                        }
                    } else {
                        setUsernameError(Array.isArray(errorData.username) ? errorData.username[0] : errorData.username);
                        setUsernameSuggestions([]);
                    }
                } else if (errorData.service_areas) {
                    setServiceAreaError(Array.isArray(errorData.service_areas) ? errorData.service_areas[0] : errorData.service_areas);
                } else {
                    const errorMessage = errorData.email?.[0] || errorData.full_name?.[0] || errorData.password?.[0] || errorData.detail || "Failed to sign up.";
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

    const handleUsernameSuggestionClick = (suggestion: string) => {
        setUsername(suggestion);
        setUsernameError(null);
        setUsernameSuggestions([]);
    };

    // Derived state for displaying badges
    const displayServiceAreas = serviceAreasString.split(',').map(s => s.trim()).filter(Boolean);

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
                                            onClick={() => handleUsernameSuggestionClick(s)}
                                        >
                                            {s}
                                        </Badge>
                                    ))}\
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
                                        <p>Start typing to see suggestions. Press Enter to add, Backspace to remove last.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input 
                            id="areas" 
                            placeholder="e.g., Nairobi CBD, Westlands" 
                            value={currentServiceAreaInput} 
                            onChange={(e) => setCurrentServiceAreaInput(e.target.value)}
                            onKeyDown={handleServiceAreaInputKeyDown}
                            ref={serviceAreaInputRef}
                            disabled={loadingLocations}
                        />
                         {loadingLocations && <p className="text-sm text-muted-foreground">Searching...</p>}
                        {serviceAreaError && (
                            <p className="text-red-500 text-sm flex items-center gap-2 mt-1">
                                <AlertCircle className="h-4 w-4" /> {serviceAreaError}
                            </p>
                        )}
                        {filteredLocations.length > 0 && !loadingLocations && (
                            <div className="border rounded-md max-h-40 overflow-y-auto mt-1">
                                {filteredLocations.map((location) => (
                                    <div 
                                        key={location} 
                                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => addServiceArea(location)}
                                    >
                                        {location}
                                    </div>
                                ))}
                            </div>
                        )}
                        {displayServiceAreas.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {displayServiceAreas.map((area) => (
                                    <Badge key={area} variant="default" className="flex items-center gap-1 pr-1">
                                        {area}
                                        <XCircle 
                                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-red-500"
                                            onClick={() => removeServiceArea(area)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}
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
