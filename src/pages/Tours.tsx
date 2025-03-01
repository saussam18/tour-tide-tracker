
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useBands } from "@/context/BandsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { TourItem } from "@/components/TourItem";
import { TourDate, Band } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TourDateWithBand = TourDate & { bandName: string; bandId: string };

const Tours = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { bands, tours } = useBands();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBand, setSelectedBand] = useState<string | null>(
    searchParams.get("band")
  );
  const [showPastTours, setShowPastTours] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Get all tour dates from all tours
  const allTourDates: TourDateWithBand[] = tours.flatMap(tour => 
    tour.dates.map(date => ({
      ...date,
      bandName: tour.bandName,
      bandId: tour.bandId
    }))
  );
  
  // Filter tour dates
  const filteredTourDates = allTourDates.filter(date => {
    // Filter by band if selected
    if (selectedBand && date.bandId !== selectedBand) {
      return false;
    }
    
    // Filter by search term
    if (
      searchTerm && 
      !date.bandName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !date.venue.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !date.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !date.country.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by date
    if (!showPastTours && new Date(date.date) < new Date()) {
      return false;
    }
    
    return true;
  });
  
  // Sort tour dates
  const sortedTourDates = [...filteredTourDates].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });
  
  // Update search params when band selection changes
  useEffect(() => {
    if (selectedBand) {
      setSearchParams({ band: selectedBand });
    } else {
      setSearchParams({});
    }
  }, [selectedBand, setSearchParams]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-display font-bold">Tour Dates</h1>
            <p className="text-muted-foreground">
              View all upcoming tour dates
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-lg sticky top-24 animate-fade-in">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Band
                    </label>
                    <Select 
                      value={selectedBand || ""} 
                      onValueChange={(value) => 
                        setSelectedBand(value === "" ? null : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Bands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Bands</SelectItem>
                        {bands.map((band) => (
                          <SelectItem key={band.id} value={band.id}>
                            {band.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium block">
                      Date
                    </label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant={showPastTours ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowPastTours(!showPastTours)}
                        className="w-full justify-start"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {showPastTours ? "Showing all dates" : "Upcoming only"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium block">
                      Sort Order
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => 
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      }
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {sortDirection === "asc" ? "Earliest first" : "Latest first"}
                      </span>
                      {sortDirection === "asc" ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
                
                {selectedBand && (
                  <div className="mt-6">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedBand(null)}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tour Dates List */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search venues, cities, bands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {sortedTourDates.length > 0 ? (
                <div className="space-y-4">
                  {sortedTourDates.map((date) => (
                    <TourItem 
                      key={date.id} 
                      tourDate={date} 
                      bandName={date.bandName} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  {tours.length === 0 ? (
                    <>
                      <p>No tour dates added yet</p>
                      <Button 
                        onClick={() => navigate("/add-band")}
                        variant="outline"
                        className="mt-4"
                      >
                        Add Your First Band
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>No tour dates match your filters</p>
                      <Button 
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedBand(null);
                          setShowPastTours(true);
                        }}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear All Filters
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tours;
