
"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { counties } from "@/lib/locations";
import { Combobox } from "@/components/ui/combobox";

export function LocationSelector() {
    const [selectedCounty, setSelectedCounty] = useState('');
    const [selectedSubCounty, setSelectedSubCounty] = useState('');
    const [selectedArea, setSelectedArea] = useState('');

    const countyOptions = useMemo(() => counties.map(c => ({ label: c.name, value: c.name })), []);

    const subCountyOptions = useMemo(() => {
        return counties.flatMap(county => 
            county.sub_counties.map(sc => ({
                label: `${sc.name}, ${county.name}`,
                value: sc.name,
            }))
        );
    }, []);

    const areaOptions = useMemo(() => {
        return counties.flatMap(county => 
            county.sub_counties.flatMap(sc => 
                sc.areas.map(area => ({
                    label: `${area}, ${sc.name}`,
                    value: area,
                }))
            )
        );
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="county-selector">County</Label>
                <Combobox
                    options={countyOptions}
                    value={selectedCounty}
                    onChange={setSelectedCounty}
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
                    onChange={setSelectedSubCounty}
                    placeholder="Select Sub-county"
                    searchPlaceholder="Search sub-county..."
                    emptyPlaceholder="No sub-county found."
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
                />
            </div>
        </div>
    )
}
