
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useBands } from "@/context/BandsContext";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { TourItem } from "@/components/TourItem";
import { TourDate } from "@/types";

type TourDateWithBand = TourDate & { bandName: string; bandId: string };

const LocationTours = () => {
  const navigate = useNavigate();
  const { location } = useParams();
  const { tours } = useBands();
  const [showPastTours, setShowPastTours] = useState(false);
  
  // Get all tour dates from all tours
  const allTourDates: TourDateWithBand[] = tours.flatMap(tour => 
    tour.dates.map(date => ({
      ...date,
      bandName: tour.bandName,
      bandId: tour.bandId
    }))
  );
  
  // Filter tour dates by location (city or country)
  const locationTourDates = allTourDates.filter(date => {
    const matchesLocation = 
      location && 
      (date.city.toLowerCase() === location.toLowerCase() || 
       date.country.toLowerCase() === location.toLowerCase());
    
    // Also filter by date if needed
    if (!showPastTours && new Date(date.date) < new Date()) {
      return false;
    }
    
    return matchesLocation;
  });
  
  // Sort tour dates by date (ascending)
  const sortedTourDates = [...locationTourDates].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="py-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate("/tours")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all tours
            </Button>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold flex items-center">
                  <MapPin className="mr-2 h-6 w-6" />
                  Tours in {location}
                </h1>
                <p className="text-muted-foreground">
                  {sortedTourDates.length} {sortedTourDates.length === 1 ? 'tour' : 'tours'} found
                </p>
              </div>
              
              <Button
                variant={showPastTours ? "default" : "outline"}
                onClick={() => setShowPastTours(!showPastTours)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {showPastTours ? "Showing all dates" : "Upcoming only"}
              </Button>
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
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p>No tours found in {location}</p>
              <Button 
                onClick={() => navigate("/tours")}
                variant="outline"
                className="mt-4"
              >
                View all tours
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LocationTours;
