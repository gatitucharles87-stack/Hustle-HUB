"use client";

import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface LocationOption {
    label: string;
    value: string; // This will be the ID from the backend
}

interface LocationSelectorProps {
    onLocationChange: (countyId: string, subCountyId: string, wardId: string, neighborhoodId: string) => void;
    initialCountyId?: string;
    initialSubCountyId?: string;
    initialWardId?: string;
    initialNeighborhoodId?: string;
}

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

export function LocationSelector({
    onLocationChange,
    initialCountyId,
    initialSubCountyId,
    initialWardId,
    initialNeighborhoodId,
}: LocationSelectorProps) {
    const [counties, setCounties] = useState<LocationOption[]>([]);
    const [subCounties, setSubCounties] = useState<LocationOption[]>([]);
    const [wards, setWards] = useState<LocationOption[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<LocationOption[]>([]);

    const [selectedCountyId, setSelectedCountyId] = useState(initialCountyId || '');
    const [selectedSubCountyId, setSelectedSubCountyId] = useState(initialSubCountyId || '');
    const [selectedWardId, setSelectedWardId] = useState(initialWardId || '');
    const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState(initialNeighborhoodId || '');

    const [countySearchTerm, setCountySearchTerm] = useState('');
    const [subCountySearchTerm, setSubCountySearchTerm] = useState('');
    const [wardSearchTerm, setWardSearchTerm] = useState('');
    const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState('');

    const debouncedCountySearchTerm = useDebounce(countySearchTerm, 500);
    const debouncedSubCountySearchTerm = useDebounce(subCountySearchTerm, 500);
    const debouncedWardSearchTerm = useDebounce(wardSearchTerm, 500);
    const debouncedNeighborhoodSearchTerm = useDebounce(neighborhoodSearchTerm, 500);

    const [loadingCounties, setLoadingCounties] = useState(false);
    const [loadingSubCounties, setLoadingSubCounties] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

    const { toast } = useToast();

    // Fetch Counties
    const fetchCounties = useCallback(async (searchQuery: string = '') => {
        setLoadingCounties(true);
        try {
            const response = await api.get(`counties/?search=${searchQuery}`);
            setCounties(response.data.map((item: any) => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error("Failed to fetch counties:", error);
            toast({
                title: "Error",
                description: "Failed to load counties.",
                variant: "destructive",
            });
        } finally {
            setLoadingCounties(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchCounties(debouncedCountySearchTerm);
    }, [fetchCounties, debouncedCountySearchTerm]);

    // Fetch Sub-counties based on selectedCountyId and search term
    const fetchSubCounties = useCallback(async (searchQuery: string = '') => {
        if (!selectedCountyId) {
            setSubCounties([]); // Ensure subCounties are cleared if no county is selected
            return;
        }
        setLoadingSubCounties(true);
        try {
            const response = await api.get(`sub-counties/?county_id=${selectedCountyId}&search=${searchQuery}`);
            setSubCounties(response.data.map((item: any) => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error("Failed to fetch sub-counties:", error);
            toast({
                title: "Error",
                description: "Failed to load sub-counties.",
                variant: "destructive",
            });
        } finally {
            setLoadingSubCounties(false);
        }
    }, [selectedCountyId, toast]);

    useEffect(() => {
        fetchSubCounties(debouncedSubCountySearchTerm);
    }, [fetchSubCounties, debouncedSubCountySearchTerm]);

    // Fetch Wards based on selectedSubCountyId and search term
    const fetchWards = useCallback(async (searchQuery: string = '') => {
        if (!selectedSubCountyId) {
            setWards([]); // Ensure wards are cleared if no sub-county is selected
            return;
        }
        setLoadingWards(true);
        try {
            const response = await api.get(`wards/?sub_county_id=${selectedSubCountyId}&search=${searchQuery}`);
            setWards(response.data.map((item: any) => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error("Failed to fetch wards:", error);
            toast({
                title: "Error",
                description: "Failed to load wards.",
                variant: "destructive",
            });
        } finally {
            setLoadingWards(false);
        }
    }, [selectedSubCountyId, toast]);

    useEffect(() => {
        fetchWards(debouncedWardSearchTerm);
    }, [fetchWards, debouncedWardSearchTerm]);

    // Fetch Neighborhoods based on selectedWardId and search term
    const fetchNeighborhoods = useCallback(async (searchQuery: string = '') => {
        if (!selectedWardId) {
            setNeighborhoods([]); // Ensure neighborhoods are cleared if no ward is selected
            return;
        }
        setLoadingNeighborhoods(true);
        try {
            const response = await api.get(`neighborhood-tags/?search=${searchQuery}`); // Assuming this endpoint handles filtering by search term only
            setNeighborhoods(response.data.map((item: any) => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error("Failed to fetch neighborhoods:", error);
            toast({
                title: "Error",
                description: "Failed to load neighborhoods.",
                variant: "destructive",
            });
        } finally {
            setLoadingNeighborhoods(false);
        }
    }, [selectedWardId, toast]); // Now also depends on selectedWardId

    useEffect(() => {
        fetchNeighborhoods(debouncedNeighborhoodSearchTerm);
    }, [fetchNeighborhoods, debouncedNeighborhoodSearchTerm]);

    // Propagate changes up to the parent component
    useEffect(() => {
        onLocationChange(selectedCountyId, selectedSubCountyId, selectedWardId, selectedNeighborhoodId);
    }, [selectedCountyId, selectedSubCountyId, selectedWardId, selectedNeighborhoodId, onLocationChange]);

    const handleCountyChange = (value: string) => {
        setSelectedCountyId(value);
        setSelectedSubCountyId(''); // Reset dependent fields
        setSelectedWardId('');
        setSelectedNeighborhoodId('');
        setSubCountySearchTerm(''); // Clear search terms for dependent fields
        setWardSearchTerm('');
        setNeighborhoodSearchTerm('');
        setSubCounties([]); // Clear options
        setWards([]); // Clear options
        setNeighborhoods([]); // Clear options
    };

    const handleSubCountyChange = (value: string) => {
        setSelectedSubCountyId(value);
        setSelectedWardId(''); // Reset dependent fields
        setSelectedNeighborhoodId('');
        setWardSearchTerm('');
        setNeighborhoodSearchTerm('');
        setWards([]); // Clear options
        setNeighborhoods([]); // Clear options
    };

    const handleWardChange = (value: string) => {
        setSelectedWardId(value);
        setSelectedNeighborhoodId(''); // Reset dependent fields
        setNeighborhoodSearchTerm('');
        setNeighborhoods([]); // Clear options
    };

    const handleNeighborhoodChange = (value: string) => {
        setSelectedNeighborhoodId(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
                <Label htmlFor="county-selector">County</Label>
                <Combobox
                    options={counties}
                    value={selectedCountyId}
                    onChange={handleCountyChange}
                    onSearchChange={setCountySearchTerm} // Pass search term handler
                    placeholder={loadingCounties ? "Loading..." : "Select County"}
                    searchPlaceholder="Search county..."
                    emptyPlaceholder="No county found."
                    disabled={loadingCounties}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subcounty-selector">Sub-county</Label>
                 <Combobox
                    options={subCounties}
                    value={selectedSubCountyId}
                    onChange={handleSubCountyChange}
                    onSearchChange={setSubCountySearchTerm} // Pass search term handler
                    placeholder={loadingSubCounties ? "Loading..." : "Select Sub-county"}
                    searchPlaceholder="Search sub-county..."
                    emptyPlaceholder="No sub-county found."
                    disabled={!selectedCountyId || loadingSubCounties}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="ward-selector">Ward</Label>
                <Combobox
                    options={wards}
                    value={selectedWardId}
                    onChange={handleWardChange}
                    onSearchChange={setWardSearchTerm} // Pass search term handler
                    placeholder={loadingWards ? "Loading..." : "Select Ward"}
                    searchPlaceholder="Search ward..."
                    emptyPlaceholder="No ward found."
                    disabled={!selectedSubCountyId || loadingWards}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="neighborhood-selector">Neighborhood</Label>
                <Combobox
                    options={neighborhoods}
                    value={selectedNeighborhoodId}
                    onChange={handleNeighborhoodChange}
                    onSearchChange={setNeighborhoodSearchTerm} // Pass search term handler
                    placeholder={loadingNeighborhoods ? "Loading..." : "Select Neighborhood"}
                    searchPlaceholder="Search neighborhood..."
                    emptyPlaceholder="No neighborhood found."
                    disabled={!selectedWardId || loadingNeighborhoods} // Enable only if ward is selected
                />
            </div>
        </div>
    );
}
