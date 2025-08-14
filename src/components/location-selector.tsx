"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as api from "@/lib/api";

interface LocationSelectorProps {
  onLocationChange: (location: {
    county: string;
    subCounty: string;
    ward: string;
    neighborhood: string;
  }) => void;
  initialCountyId?: string;
  initialSubCountyId?: string;
  initialWardId?: string;
  initialNeighborhoodId?: string;
}

export function LocationSelector({
  onLocationChange,
  initialCountyId = "",
  initialSubCountyId = "",
  initialWardId = "",
  initialNeighborhoodId = "",
}: LocationSelectorProps) {
  const [counties, setCounties] = useState([]);
  const [subCounties, setSubCounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  const [selectedCounty, setSelectedCounty] = useState(initialCountyId);
  const [selectedSubCounty, setSelectedSubCounty] = useState(initialSubCountyId);
  const [selectedWard, setSelectedWard] = useState(initialWardId);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialNeighborhoodId);

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await api.getCounties();
        setCounties(response.data);
      } catch (error) {
        console.error("Failed to fetch counties", error);
      }
    };
    fetchCounties();
  }, []);

  useEffect(() => {
    if (selectedCounty) {
      const fetchSubCounties = async () => {
        try {
          const response = await api.getSubCounties(selectedCounty);
          setSubCounties(response.data);
          // Reset dependent selections if parent changes
          setSelectedSubCounty("");
          setSelectedWard("");
          setSelectedNeighborhood("");
        } catch (error) {
          console.error("Failed to fetch sub-counties", error);
        }
      };
      fetchSubCounties();
    } else {
      setSubCounties([]);
      setWards([]);
      setNeighborhoods([]);
      setSelectedSubCounty("");
      setSelectedWard("");
      setSelectedNeighborhood("");
    }
  }, [selectedCounty]);

  useEffect(() => {
    if (selectedSubCounty) {
      const fetchWards = async () => {
        try {
          const response = await api.getWards(selectedSubCounty);
          setWards(response.data);
          // Reset dependent selections if parent changes
          setSelectedWard("");
          setSelectedNeighborhood("");
        } catch (error) {
          console.error("Failed to fetch wards", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setNeighborhoods([]);
      setSelectedWard("");
      setSelectedNeighborhood("");
    }
  }, [selectedSubCounty]);

  useEffect(() => {
    if (selectedWard) {
      const fetchNeighborhoods = async () => {
        try {
          const response = await api.getNeighborhoods(selectedWard);
          setNeighborhoods(response.data);
          setSelectedNeighborhood("");
        } catch (error) {
          console.error("Failed to fetch neighborhoods", error);
        }
      };
      fetchNeighborhoods();
    } else {
      setNeighborhoods([]);
      setSelectedNeighborhood("");
    }
  }, [selectedWard]);

  useEffect(() => {
    onLocationChange({
      county: selectedCounty,
      subCounty: selectedSubCounty,
      ward: selectedWard,
      neighborhood: selectedNeighborhood,
    });
  }, [selectedCounty, selectedSubCounty, selectedWard, selectedNeighborhood, onLocationChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Select onValueChange={setSelectedCounty} value={selectedCounty}>
        <SelectTrigger>
          <SelectValue placeholder="Select County" />
        </SelectTrigger>
        <SelectContent>
          {counties.map((county: { id: string; name: string }) => (
            <SelectItem key={county.id} value={county.id}>
              {county.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={setSelectedSubCounty}
        value={selectedSubCounty}
        disabled={!selectedCounty}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Sub-County" />
        </SelectTrigger>
        <SelectContent>
          {subCounties.map((subCounty: { id: string; name: string }) => (
            <SelectItem key={subCounty.id} value={subCounty.id}>
              {subCounty.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={setSelectedWard}
        value={selectedWard}
        disabled={!selectedSubCounty}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Ward" />
        </SelectTrigger>
        <SelectContent>
          {wards.map((ward: { id: string; name: string }) => (
            <SelectItem key={ward.id} value={ward.id}>
              {ward.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={setSelectedNeighborhood}
        value={selectedNeighborhood}
        disabled={!selectedWard}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Neighborhood" />
        </SelectTrigger>
        <SelectContent>
          {neighborhoods.map((neighborhood: { id: string; name: string }) => (
            <SelectItem key={neighborhood.id} value={neighborhood.id}>
              {neighborhood.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
