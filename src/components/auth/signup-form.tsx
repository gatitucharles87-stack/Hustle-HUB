
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
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { counties } from "@/lib/locations";

export function SignupForm() {
    const [role, setRole] = useState("freelancer");
    const [selectedCounty, setSelectedCounty] = useState('');
    const [selectedSubCounty, setSelectedSubCounty] = useState('');

    const subCounties = useMemo(() => {
        if (!selectedCounty) return [];
        const county = counties.find(c => c.name === selectedCounty);
        return county ? county.sub_counties : [];
    }, [selectedCounty]);

    const areas = useMemo(() => {
        if (!selectedSubCounty) return [];
        const subCounty = subCounties.find(sc => sc.name === selectedSubCounty);
        return subCounty ? subCounty.areas : [];
    }, [selectedSubCounty, subCounties]);


  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input id="full-name" placeholder="John Doe" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
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
            <>
                <div className="grid gap-2">
                    <Label htmlFor="county">County</Label>
                    <Select onValueChange={setSelectedCounty}>
                        <SelectTrigger id="county">
                            <SelectValue placeholder="Select your county" />
                        </SelectTrigger>
                        <SelectContent>
                            {counties.map(county => (
                                <SelectItem key={county.name} value={county.name}>{county.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 {selectedCounty && (
                    <div className="grid gap-2">
                        <Label htmlFor="sub-county">Sub-county / Region</Label>
                        <Select onValueChange={setSelectedSubCounty}>
                            <SelectTrigger id="sub-county">
                                <SelectValue placeholder="Select your sub-county" />
                            </SelectTrigger>
                            <SelectContent>
                                {subCounties.map(sub => (
                                    <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 )}
                 {selectedSubCounty && (
                     <div className="grid gap-2">
                        <Label htmlFor="area">Area</Label>
                        <Select>
                            <SelectTrigger id="area">
                                <SelectValue placeholder="Select your specific area" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map(area => (
                                    <SelectItem key={area} value={area}>{area}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 )}
            </>
        )}
      <Button type="submit" className="w-full" asChild>
        <Link href={`/dashboard/${role}`}>
          <UserPlus className="mr-2 h-4 w-4" /> Sign Up
        </Link>
      </Button>
    </div>
  );
}
