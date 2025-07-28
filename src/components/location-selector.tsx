
"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { counties } from "@/lib/locations";
import { Combobox } from "@/components/ui/combobox";

export function LocationSelector() {
    const [selectedCounty, setSelectedCounty] = useState('');
    const [selectedSubCounty, setSelectedSubCounty] = useState('');
    const [selectedArea, setSelectedArea] = useState('');

    const handleCountyChange = (value: string) => {
        setSelectedCounty(value);
        setSelectedSubCounty('');
        setSelectedArea('');
    }

    const handleSubCountyChange = (value: string) => {
        setSelectedSubCounty(value);
        setSelectedArea('');
    }

    const countyOptions = useMemo(() => counties.map(c => ({ label: c.name, value: c.name })), []);

    const subCountyOptions = useMemo(() => {
        if (!selectedCounty) return [];
        const county = counties.find(c => c.name === selectedCounty);
        return county ? county.sub_counties.map(sc => ({ label: sc.name, value: sc.name })) : [];
    }, [selectedCounty]);

    const areaOptions = useMemo(() => {
        if (!selectedCounty || !selectedSubCounty) return [];
        const county = counties.find(c => c.name === selectedCounty);
        const subCounty = county?.sub_counties.find(sc => sc.name === selectedSubCounty);
        return subCounty ? subCounty.areas.map(area => ({ label: area, value: area })) : [];
    }, [selectedCounty, selectedSubCounty]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="county-selector">County</Label>
                <Combobox
                    options={countyOptions}
                    value={selectedCounty}
                    onChange={handleCountyChange}
                    placeholder="Select County"
                    searchPlaceholder="Search county..."
                    emptyPlaceholder="No county found."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subcounty-selector">Sub-county</Label>
                 <Combobox
                    options={subCountyOptions}
                    value={selectedSubCounty}
                    onChange={handleSubCountyChange}
                    placeholder="Select Sub-county"
                    searchPlaceholder="Search sub-county..."
                    emptyPlaceholder="No sub-county found."
                    disabled={!selectedCounty}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="area-selector">Area</Label>
                <Combobox
                    options={areaOptions}
                    value={selectedArea}
                    onChange={setSelectedArea}
                    placeholder="Select Area"
                    searchPlaceholder="Search area..."
                    emptyPlaceholder="No area found."
                    disabled={!selectedSubCounty}
                />
            </div>
        </div>
    )
}
