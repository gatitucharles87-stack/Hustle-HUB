
"use client";

import { useState, useEffect } from "react";
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

    const [loadingCounties, setLoadingCounties] = useState(false);
    const [loadingSubCounties, setLoadingSubCounties] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

    const { toast } = useToast();

    // Fetch Counties
    useEffect(() => {
        const fetchCounties = async () => {
            setLoadingCounties(true);
            try {
                const response = await api.get("/counties/");
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
        };
        fetchCounties();
    }, [toast]);

    // Fetch Sub-counties based on selectedCountyId
    useEffect(() => {
        const fetchSubCounties = async () => {
            if (!selectedCountyId) {
                setSubCounties([]);
                setSelectedSubCountyId('');
                setSelectedWardId('');
                setSelectedNeighborhoodId('');
                return;
            }
            setLoadingSubCounties(true);
            try {
                const response = await api.get(`/sub-counties/?county_id=${selectedCountyId}`);
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
        };
        fetchSubCounties();
    }, [selectedCountyId, toast]);

    // Fetch Wards based on selectedSubCountyId
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedSubCountyId) {
                setWards([]);
                setSelectedWardId('');
                setSelectedNeighborhoodId('');
                return;
            }
            setLoadingWards(true);
            try {
                const response = await api.get(`/wards/?sub_county_id=${selectedSubCountyId}`);
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
        };
        fetchWards();
    }, [selectedSubCountyId, toast]);

    // Fetch Neighborhoods based on selectedWardId (if applicable) or independently
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            // The API description says GET /api/neighborhood-tags/ without specific filters
            // If neighborhoods are dependent on ward, the backend API needs to support it
            // For now, assuming it fetches all or is filtered by ward if implemented later
            setLoadingNeighborhoods(true);
            try {
                const response = await api.get("/neighborhood-tags/");
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
        };
        fetchNeighborhoods();
    }, [toast]); // This should probably depend on selectedWardId if filtering

    // Propagate changes up to the parent component
    useEffect(() => {
        onLocationChange(selectedCountyId, selectedSubCountyId, selectedWardId, selectedNeighborhoodId);
    }, [selectedCountyId, selectedSubCountyId, selectedWardId, selectedNeighborhoodId, onLocationChange]);

    const handleCountyChange = (value: string) => {
        setSelectedCountyId(value);
        setSelectedSubCountyId(''); // Reset dependent fields
        setSelectedWardId('');
        setSelectedNeighborhoodId('');
    };

    const handleSubCountyChange = (value: string) => {
        setSelectedSubCountyId(value);
        setSelectedWardId(''); // Reset dependent fields
        setSelectedNeighborhoodId('');
    };

    const handleWardChange = (value: string) => {
        setSelectedWardId(value);
        setSelectedNeighborhoodId(''); // Reset dependent fields
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
                    placeholder={loadingNeighborhoods ? "Loading..." : "Select Neighborhood"}
                    searchPlaceholder="Search neighborhood..."
                    emptyPlaceholder="No neighborhood found."
                    disabled={!selectedWardId || loadingNeighborhoods} // Enable only if ward is selected
                />
            </div>
        </div>
    );
}
