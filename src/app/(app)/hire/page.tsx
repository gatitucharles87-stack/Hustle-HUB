"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, UserRoundSearch, GlobeIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationSelector } from '@/components/location-selector';
import { Label } from '@/components/ui/label';
import * as api from "@/lib/api"; // Import API client
import { useToast } from "@/hooks/use-toast";

interface Freelancer {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  skills: string[];
  service_areas: string[];
  is_remote: boolean;
  average_rating?: number;
}

interface JobCategory {
  id: string;
  name: string;
}

export default function HireFreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [selectedCountyId, setSelectedCountyId] = useState('');
  const [selectedSubCountyId, setSelectedSubCountyId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState('');
  const { toast } = useToast();

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('role', 'freelancer');

      if (keywords) {
        params.append('search', keywords);
      }
      if (category && category !== 'All Categories') {
        params.append('skills', category);
      }
      if (selectedCountyId) {
        params.append('county_id', selectedCountyId);
      }
      if (selectedSubCountyId) {
        params.append('sub_county_id', selectedSubCountyId);
      }
      if (selectedWardId) {
        params.append('ward_id', selectedWardId);
      }
      if (selectedNeighborhoodId) {
        params.append('neighborhood_tag_id', selectedNeighborhoodId);
      }

      const response = await api.getUsers(`?${params.toString()}`);
      setFreelancers(response.data);
    } catch (error: any) { // Explicitly type error as any for safer property access
      console.error("Failed to fetch freelancers:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to load freelancers. Please try again.",
        variant: "destructive",
      });
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  }, [keywords, category, selectedCountyId, selectedSubCountyId, selectedWardId, selectedNeighborhoodId, toast]);

  const fetchJobCategories = useCallback(async () => {
    try {
      const response = await api.getJobCategories();
      setJobCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch job categories:", error);
      toast({
        title: "Error",
        description: "Failed to load job categories.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchJobCategories();
  }, [fetchJobCategories]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const handleLocationChange = (location: { county: string; subCounty: string; ward: string; neighborhood: string; }) => {
    setSelectedCountyId(location.county);
    setSelectedSubCountyId(location.subCounty);
    setSelectedWardId(location.ward);
    setSelectedNeighborhoodId(location.neighborhood);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <UserRoundSearch className="h-6 w-6" /> Find a Freelancer
          </CardTitle>
          <p className="text-muted-foreground">Refine your search to find the perfect professional.</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                        id="keywords"
                        placeholder="e.g., 'React' or 'Plumber'"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Categories">All Categories</SelectItem>
                        {jobCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                 </div>
            </div>
          
            <div className="space-y-2">
                 <Label>Location</Label>
                <LocationSelector
                    onLocationChange={handleLocationChange}
                    initialCountyId={selectedCountyId}
                    initialSubCountyId={selectedSubCountyId}
                    initialWardId={selectedWardId}
                    initialNeighborhoodId={selectedNeighborhoodId}
                />
            </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold font-headline">Available Freelancers ({loading ? '...' : freelancers.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))
        ) : freelancers.length > 0 ? (
          freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="flex flex-col text-center p-4">
                <Avatar className="mb-4 h-24 w-24 mx-auto">
                    <AvatarImage src={freelancer.avatar_url} alt={freelancer.full_name} />
                    <AvatarFallback>{freelancer.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h3 className="text-xl font-semibold">{freelancer.full_name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
                        {freelancer.skills.join(', ')}
                    </p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        {freelancer.is_remote ? (
                        <>
                            <GlobeIcon className="h-4 w-4 mr-1" /> Remote
                        </>
                        ) : (
                        <>
                            <MapPin className="h-4 w-4 mr-1" />
                            {freelancer.service_areas.join(', ')}
                        </>
                        )}
                    </div>
                    <div className="flex items-center justify-center mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">
                        {freelancer.average_rating ? freelancer.average_rating.toFixed(1) : 'N/A'}
                        </span>
                    </div>
                </div>
              <Button size="sm" className="mt-4 w-full" asChild>
                <Link href={`/freelancers/${freelancer.id}`}>View Profile</Link>
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No freelancers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
