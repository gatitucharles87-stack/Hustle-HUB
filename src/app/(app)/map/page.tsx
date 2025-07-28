
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Filter, MapPin, User } from "lucide-react";
import Image from "next/image";

const mapData = [
    { type: 'freelancer', name: 'Alex Plumber', x: '20%', y: '30%' },
    { type: 'freelancer', name: 'Brenda FrontendDev', x: '60%', y: '45%' },
    { type: 'job', title: 'Fix Leaky Kitchen Sink', x: '22%', y: '35%' },
    { type: 'job', title: 'Build React Landing Page', x: '58%', y: '50%' },
    { type: 'freelancer', name: 'Charles Electrician', x: '75%', y: '60%' },
];


export default function MapPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Filter /> Map Filters</CardTitle>
            <CardDescription>Refine your search on the map.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
             <div className="space-y-2">
                <Label>Show on map</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox id="show-freelancers" defaultChecked />
                    <Label htmlFor="show-freelancers">Freelancers</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="show-jobs" defaultChecked />
                    <Label htmlFor="show-jobs">Jobs</Label>
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="map-category">Category</Label>
                <Select>
                    <SelectTrigger id="map-category">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="home-services">Home Services</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="map-radius">Search Radius</Label>
                <Select>
                    <SelectTrigger id="map-radius">
                        <SelectValue placeholder="5 km" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="25">25 km</SelectItem>
                        <SelectItem value="50">50 km</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Apply Filters</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-3 h-full">
         <Card className="h-full">
            <CardContent className="p-2 h-full">
                <div className="relative w-full h-full rounded-md overflow-hidden">
                    <Image 
                        src="https://placehold.co/1200x800.png" 
                        alt="Map of the local area" 
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="abstract map"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    {mapData.map((item, index) => (
                        <div key={index} className="absolute group" style={{ left: item.x, top: item.y }}>
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center 
                                ${item.type === 'freelancer' ? 'bg-primary' : 'bg-accent'} 
                                text-white shadow-lg cursor-pointer transform transition-transform group-hover:scale-110`
                            }>
                                {item.type === 'freelancer' ? <User size={16} /> : <Briefcase size={16} />}
                            </div>
                            <div className="
                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                bg-background text-foreground text-xs font-semibold
                                px-2 py-1 rounded-md shadow-md whitespace-nowrap
                                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            >
                                {item.type === 'freelancer' ? item.name : item.title}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
