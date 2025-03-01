
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useBands } from "@/context/BandsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarIcon, 
  MapPin, 
  Building, 
  Globe, 
  Plus,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { TourItem } from "@/components/TourItem";
import { toast } from "sonner";
import { Band, TourDate } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AddTour = () => {
  const navigate = useNavigate();
  const { bandId } = useParams<{ bandId: string }>();
  const { getBand, addTour } = useBands();
  const [band, setBand] = useState<Band | undefined>(undefined);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  
  useEffect(() => {
    if (bandId) {
      const bandData = getBand(bandId);
      if (bandData) {
        setBand(bandData);
      } else {
        toast.error("Band not found");
        navigate("/add-band");
      }
    }
  }, [bandId, getBand, navigate]);
  
  const addTourDate = () => {
    setTourDates([
      ...tourDates,
      {
        id: crypto.randomUUID(),
        date: new Date(),
        venue: "",
        city: "",
        country: ""
      }
    ]);
  };
  
  const removeTourDate = (index: number) => {
    setTourDates(tourDates.filter((_, i) => i !== index));
  };
  
  const updateTourDate = (index: number, field: keyof Omit<TourDate, "id">, value: string | Date) => {
    setTourDates(
      tourDates.map((date, i) => 
        i === index ? { ...date, [field]: value } : date
      )
    );
  };
  
  const handleSubmit = () => {
    if (!band) return;
    
    if (tourDates.length === 0) {
      toast.error("Add at least one tour date");
      return;
    }
    
    // Validate tour dates
    const invalidDates = tourDates.filter(
      date => !date.venue || !date.city || !date.country
    );
    
    if (invalidDates.length > 0) {
      toast.error("Please fill out all fields for each tour date");
      return;
    }
    
    // Include bandId in the tour object
    addTour(band.id, { 
      bandId: band.id,  // Add this line to fix the type error
      dates: tourDates 
    });
    navigate(`/tours?band=${band.id}`);
  };

  if (!band) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="py-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-3xl font-display font-bold">
              Add Tour Dates for {band.name}
            </h1>
            <p className="text-muted-foreground">
              Create a new tour with multiple dates and locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tour Dates Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-lg animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Tour Dates
                  </h2>
                  
                  <Button 
                    onClick={addTourDate}
                    size="sm"
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Date
                  </Button>
                </div>
                
                {tourDates.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p>No tour dates added yet</p>
                    <Button 
                      onClick={addTourDate}
                      variant="outline"
                      className="mt-4"
                    >
                      Add Your First Tour Date
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {tourDates.map((date, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "p-4 border rounded-lg",
                          "animate-fade-up transition-all"
                        )}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">Tour Date #{index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTourDate(index)}
                            className="text-destructive h-8 px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label 
                              htmlFor={`date-${index}`}
                              className="flex items-center text-xs text-muted-foreground"
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              Date
                            </Label>
                            <Input
                              id={`date-${index}`}
                              type="datetime-local"
                              value={format(new Date(date.date), "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => 
                                updateTourDate(index, "date", new Date(e.target.value))
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label 
                              htmlFor={`venue-${index}`}
                              className="flex items-center text-xs text-muted-foreground"
                            >
                              <Building className="mr-1 h-3 w-3" />
                              Venue
                            </Label>
                            <Input
                              id={`venue-${index}`}
                              placeholder="Venue name"
                              value={date.venue}
                              onChange={(e) => 
                                updateTourDate(index, "venue", e.target.value)
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label 
                              htmlFor={`city-${index}`}
                              className="flex items-center text-xs text-muted-foreground"
                            >
                              <MapPin className="mr-1 h-3 w-3" />
                              City
                            </Label>
                            <Input
                              id={`city-${index}`}
                              placeholder="City"
                              value={date.city}
                              onChange={(e) => 
                                updateTourDate(index, "city", e.target.value)
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label 
                              htmlFor={`country-${index}`}
                              className="flex items-center text-xs text-muted-foreground"
                            >
                              <Globe className="mr-1 h-3 w-3" />
                              Country
                            </Label>
                            <Input
                              id={`country-${index}`}
                              placeholder="Country"
                              value={date.country}
                              onChange={(e) => 
                                updateTourDate(index, "country", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleSubmit}
                    disabled={tourDates.length === 0}
                  >
                    Save Tour
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-medium mb-4">Preview</h2>
                
                {tourDates.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {tourDates.map((date, index) => (
                      <div key={index} className="opacity-90 hover:opacity-100">
                        <TourItem 
                          tourDate={{
                            ...date,
                            id: `preview-${index}`,
                          }} 
                          bandName={band.name}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Add tour dates to see a preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTour;
