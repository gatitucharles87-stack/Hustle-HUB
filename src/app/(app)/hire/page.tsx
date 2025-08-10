"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Search, UserRoundSearch, GlobeIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationSelector } from '@/components/location-selector';
import { Label } from '@/components/ui/label';

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

const placeholderFreelancers: Freelancer[] = [
    { id: '1', full_name: 'Alice Johnson', email: 'alice@example.com', skills: ['React', 'Node.js', 'TypeScript'], service_areas: ['Nairobi'], is_remote: true, average_rating: 4.9, avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '2', full_name: 'Bob Williams', email: 'bob@example.com', skills: ['Graphic Design', 'Illustration'], service_areas: ['Mombasa'], is_remote: false, average_rating: 4.8, avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { id: '3', full_name: 'Charlie Brown', email: 'charlie@example.com', skills: ['Plumbing', 'General Maintenance'], service_areas: ['Kisumu'], is_remote: false, average_rating: 4.7, avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    { id: '4', full_name: 'Diana Prince', email: 'diana@example.com', skills: ['Content Writing', 'SEO'], service_areas: ['Nakuru'], is_remote: true, average_rating: 4.9, avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
    { id: '5', full_name: 'Ethan Hunt', email: 'ethan@example.com', skills: ['Photography', 'Videography'], service_areas: ['Eldoret'], is_remote: false, average_rating: 4.6, avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
];

export default function HireFreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [county, setCounty] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    setLoading(true);
    // Simulate filtering
    const filteredFreelancers = placeholderFreelancers.filter(f => {
        const keywordMatch = keywords ? f.skills.some(s => s.toLowerCase().includes(keywords.toLowerCase())) || f.full_name.toLowerCase().includes(keywords.toLowerCase()) : true;
        const categoryMatch = category !== 'All Categories' ? f.skills.includes(category) : true; // This is a simplification
        const locationMatch = county ? f.service_areas.includes(county) : true; // This is a simplification
        return keywordMatch && categoryMatch && locationMatch;
    });

    setTimeout(() => {
        setFreelancers(filteredFreelancers);
        setLoading(false);
    }, 500);
  }, [keywords, category, county, subCounty, area]);

  const handleLocationChange = (newCounty: string, newSubCounty: string, newArea: string) => {
    setCounty(newCounty);
    setSubCounty(newSubCounty);
    setArea(newArea);
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
                        <SelectItem value="React">React</SelectItem>
                        <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                        <SelectItem value="Content Writing">Content Writing</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                    </SelectContent>
                    </Select>
                 </div>
            </div>
          
            <div className="space-y-2">
                 <Label>Location</Label>
                <LocationSelector
                    onLocationChange={handleLocationChange}
                    initialCounty={county}
                    initialSubCounty={subCounty}
                    initialArea={area}
                />
            </div>

            {/* The search button is no longer needed as the page updates on filter change */}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold font-headline">Available Freelancers ({freelancers.length})</h2>

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
