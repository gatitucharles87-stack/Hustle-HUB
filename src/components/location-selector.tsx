
"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { counties } from "@/lib/locations";

export function LocationSelector() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="county-selector">County</Label>
                <Select onValueChange={setSelectedCounty}>
                    <SelectTrigger id="county-selector">
                        <SelectValue placeholder="Select County" />
                    </SelectTrigger>
                    <SelectContent>
                        {counties.map(county => (
                            <SelectItem key={county.name} value={county.name}>{county.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subcounty-selector">Sub-county</Label>
                <Select onValueChange={setSelectedSubCounty} disabled={!selectedCounty}>
                    <SelectTrigger id="subcounty-selector">
                        <SelectValue placeholder="Select Sub-county" />
                    </SelectTrigger>
                    <SelectContent>
                        {subCounties.map(sub => (
                            <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="area-selector">Area</Label>
                <Select disabled={!selectedSubCounty}>
                    <SelectTrigger id="area-selector">
                        <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                        {areas.map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
