
import React from "react";
import { format } from "date-fns";
import { TourDate } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourItemProps {
  tourDate: TourDate;
  bandName: string;
}

export const TourItem: React.FC<TourItemProps> = ({ tourDate, bandName }) => {
  const date = new Date(tourDate.date);
  const isPast = date < new Date();
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      isPast ? "opacity-70" : "animate-fade-up"
    )}>
      <CardContent className="p-0 flex">
        <div className={cn(
          "w-24 flex-shrink-0 flex flex-col items-center justify-center p-4 text-primary-foreground",
          isPast ? "bg-muted" : "bg-primary"
        )}>
          <span className="text-2xl font-bold">{format(date, "dd")}</span>
          <span className="text-sm uppercase">{format(date, "MMM")}</span>
          <span className="text-xs">{format(date, "yyyy")}</span>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold tracking-tight">{bandName}</h4>
              <h3 className="text-xl font-bold">{tourDate.venue}</h3>
            </div>
            {isPast && (
              <span className="text-xs uppercase bg-muted px-2 py-1 rounded-full">
                Past
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {tourDate.city}, {tourDate.country}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(date, "EEEE")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{format(date, "p")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
