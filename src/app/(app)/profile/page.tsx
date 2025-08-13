"use client";

import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/lib/api"; // Corrected import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Edit, User, Mail, Briefcase, Info, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Debounce hook
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


export default function ProfilePage() {
  const { user, loading, mutateUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const isNewUser = searchParams.get("new_user") === "true";

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // New states for service area search
  const [currentServiceAreaInput, setCurrentServiceAreaInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [serviceAreaError, setServiceAreaError] = useState<string | null>(null);
  
  const debouncedServiceAreaSearchTerm = useDebounce(currentServiceAreaInput, 500);
  const serviceAreaInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setServiceAreas(
          Array.isArray(user.service_areas)
              ? user.service_areas
              : (typeof user.service_areas === 'string' && user.service_areas)
                  ? user.service_areas.split(',').map((s: string) => s.trim()).filter(Boolean)
                  : []
      );
      setBio(user.bio || "");
      setSkills(user.skills || []);
    }
    if (isNewUser && user && (!user.bio || user.skills?.length === 0)) {
        setIsEditing(true);
    }
  }, [user, isNewUser]);

    const fetchAllLocations = useCallback(async (searchQuery: string) => {
        if (!searchQuery) {
            setFilteredLocations([]);
            return;
        }

        setLoadingLocations(true);
        try {
            const endpoints = ['counties', 'sub-counties', 'wards', 'neighborhood-tags'];
            const requests = endpoints.map(endpoint => fetch(`http://localhost:8000/api/${endpoint}/?search=${searchQuery}`).then(res => res.json())); // Direct fetch
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


  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedSkill = skillInput.trim().toLowerCase();
      if (trimmedSkill && !skills.map(s => s.toLowerCase()).includes(trimmedSkill)) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addServiceArea = (area: string) => {
      const trimmedArea = area.trim();
      if (trimmedArea && !serviceAreas.includes(trimmedArea)) {
          setServiceAreas([...serviceAreas, trimmedArea]);
          setCurrentServiceAreaInput("");
          setFilteredLocations([]);
          setServiceAreaError(null);
      }
  };

  const removeServiceArea = (areaToRemove: string) => {
      setServiceAreas(serviceAreas.filter(area => area !== areaToRemove));
  };

  const handleServiceAreaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredLocations.length > 0) {
              addServiceArea(filteredLocations[0]);
          } else if (currentServiceAreaInput) {
              setServiceAreaError("Please select a valid location from the suggestions or type a comma-separated list.");
          }
      } else if (e.key === 'Backspace' && currentServiceAreaInput === '' && serviceAreas.length > 0) {
          e.preventDefault();
          removeServiceArea(serviceAreas[serviceAreas.length - 1]);
      }
  };


  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        username,
        email,
        service_areas: serviceAreas.join(', '),
        bio,
        skills
      };
      const { data } = await updateUserProfile(payload); // Changed to updateUserProfile
      mutateUser(data, false);
      setIsEditing(false);

      toast({
        title: "Profile Updated!",
        description: "Your professional details have been saved successfully.",
      });

      if (isNewUser) {
        toast({
          title: "Next Step: Portfolio",
          description: "Let's set up your portfolio to showcase your work.",
        });
        router.push("/portfolio-management");
      }
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      const errorMessages = error.response?.data ? Object.values(error.response.data).flat().join(' ') : "There was an error saving your profile.";
      toast({
        title: "Update Failed",
        description: errorMessages,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
        setUsername(user.username || "");
        setEmail(user.email || "");
        setServiceAreas(
            Array.isArray(user.service_areas)
                ? user.service_areas
                : (typeof user.service_areas === 'string' && user.service_areas)
                    ? user.service_areas.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : []
        );
        setBio(user.bio || "");
        setSkills(user.skills || []);
        setCurrentServiceAreaInput("");
        setFilteredLocations([]);
        setServiceAreaError(null);
    }
    setIsEditing(false);
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
              <CardContent><Skeleton className="h-24 w-full" /></CardContent>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
              <CardContent><Skeleton className="h-16 w-full" /></CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = user.role === 'freelancer' && (!user.bio || user.skills?.length === 0);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {isNewUser && isProfileIncomplete && (
        <Alert className="mb-6 border-primary text-primary-foreground bg-primary/90">
            <Info className="h-4 w-4 !text-primary-foreground" />
            <AlertTitle className="font-bold">Welcome to HustleHub!</AlertTitle>
            <AlertDescription>
                Complete your profile by adding a bio and some skills to start getting job recommendations.
            </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: User Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center text-center p-8">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              {isEditing ? (
                 <Input className="mt-2 text-center" value={username} onChange={(e) => setUsername(e.target.value)} />
              ) : (
                <p className="text-muted-foreground">@{user.username}</p>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground"/>
                    {isEditing ? <Input value={email} onChange={(e) => setEmail(e.target.value)} /> : <span>{user.email}</span>}
                </div>
                <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-muted-foreground"/>
                    <span className="capitalize">{user.role}</span>
                </div>
                 <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-3 text-muted-foreground"/>
                    <span>XP: {user.xp_points}</span>
                </div>
            </CardContent>
          </Card>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="w-full">
                <Edit className="h-4 w-4 mr-2"/>
                Edit Profile
            </Button>
          )}
        </div>

        {/* Right Column: Bio and Skills */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>
                This is your professional bio. It helps clients understand your background and expertise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  id="bio"
                  placeholder="Tell us about your professional background, experience, and what makes you stand out..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[150px] text-base"
                />
              ) : (
                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 whitespace-pre-wrap min-h-[150px]">
                  {user.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Add skills relevant to your services. This is crucial for job matching.
              </CardDescription>
            </CardHeader>
            <CardContent>
            {isEditing ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-base py-1 px-3">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 rounded-full hover:bg-destructive/20 p-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </Badge>
                    ))}
                </div>
                <Input
                    id="skills"
                    placeholder="Type a skill and press Enter to add"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                />
              </>
              ) : (
                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700 min-h-[40px] flex gap-2 flex-wrap items-center">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-800 dark:text-gray-200">No skills added yet. Click 'Edit Profile' to add some!</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Service Areas</CardTitle>
                <CardDescription>Let clients know where you are available to work.</CardDescription>
            </CardHeader>
            <CardContent>
                {isEditing ? (
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
                            id="serviceAreas" 
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
                        {serviceAreas.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {serviceAreas.map((area) => (
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
                ) : (
                    <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700 min-h-[40px] flex gap-2 flex-wrap items-center">
                        {user.service_areas && user.service_areas.length > 0 ? (
                            (Array.isArray(user.service_areas) ? user.service_areas : (user.service_areas as string).split(',')).map((area: string) => (
                                <Badge key={area.trim()}>{area.trim()}</Badge>
                            ))
                        ) : (
                            <span className="text-gray-800 dark:text-gray-200">No service areas added yet. Click 'Edit Profile' to add some!</span>
                        )}
                    </div>
                )}
            </CardContent>
          </Card>
           {isEditing && (
            <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                      <XCircle className="h-4 w-4 mr-2"/>
                      Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4 mr-2"/>}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
