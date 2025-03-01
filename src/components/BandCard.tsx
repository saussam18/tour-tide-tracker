
import React from "react";
import { useNavigate } from "react-router-dom";
import { Band } from "@/types";
import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useBands } from "@/context/BandsContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BandCardProps {
  band: Band;
}

export const BandCard: React.FC<BandCardProps> = ({ band }) => {
  const navigate = useNavigate();
  const { getBandTours } = useBands();
  const tours = getBandTours(band.id);
  const tourCount = tours.length;
  const upcomingDates = tours.flatMap(tour => tour.dates).filter(
    date => new Date(date.date) > new Date()
  ).length;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in">
      <div className="aspect-[3/1] overflow-hidden relative bg-secondary flex items-center justify-center">
        {band.imageUrl ? (
          <img 
            src={band.imageUrl} 
            alt={band.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <Music className="h-16 w-16 text-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <Badge variant="outline" className="mb-2 bg-black/30 text-white border-white/20">
            {band.genre}
          </Badge>
          <h3 className="text-xl font-bold">{band.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Added on {format(new Date(band.createdAt), "MMMM d, yyyy")}
          </span>
          <div className="flex items-center space-x-2 text-sm">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {upcomingDates} upcoming
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/add-tour/${band.id}`)}
        >
          Add Tour Dates
        </Button>
        <Button
          variant="ghost" 
          size="sm"
          className="text-primary"
          onClick={() => navigate(`/tours?band=${band.id}`)}
        >
          {tourCount > 0 ? "View Tours" : "No Tours Yet"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
