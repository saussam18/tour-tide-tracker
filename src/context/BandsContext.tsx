
import React, { createContext, useContext, useState, useEffect } from "react";
import { Band, Tour, TourDate } from "@/types";
import { toast } from "sonner";

interface BandsContextType {
  bands: Band[];
  tours: Tour[];
  addBand: (band: Omit<Band, "id" | "createdAt">) => void;
  addTour: (bandId: string, tour: Omit<Tour, "id" | "bandName" | "createdAt">) => void;
  addTourDate: (tourId: string, tourDate: Omit<TourDate, "id">) => void;
  getBand: (id: string) => Band | undefined;
  getTour: (id: string) => Tour | undefined;
  getBandTours: (bandId: string) => Tour[];
}

const BandsContext = createContext<BandsContextType | undefined>(undefined);

export const useBands = () => {
  const context = useContext(BandsContext);
  if (!context) {
    throw new Error("useBands must be used within a BandsProvider");
  }
  return context;
};

export const BandsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [bands, setBands] = useState<Band[]>(() => {
    const savedBands = localStorage.getItem("bands");
    return savedBands ? JSON.parse(savedBands) : [];
  });

  const [tours, setTours] = useState<Tour[]>(() => {
    const savedTours = localStorage.getItem("tours");
    return savedTours ? JSON.parse(savedTours) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("bands", JSON.stringify(bands));
  }, [bands]);

  useEffect(() => {
    localStorage.setItem("tours", JSON.stringify(tours));
  }, [tours]);

  const addBand = (band: Omit<Band, "id" | "createdAt">) => {
    const newBand: Band = {
      ...band,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setBands([...bands, newBand]);
    toast.success(`${band.name} added successfully`);
  };

  const addTour = (bandId: string, tour: Omit<Tour, "id" | "bandName" | "createdAt">) => {
    const band = getBand(bandId);
    if (!band) {
      toast.error("Band not found");
      return;
    }

    const newTour: Tour = {
      ...tour,
      id: crypto.randomUUID(),
      bandId,
      bandName: band.name,
      createdAt: new Date(),
    };
    setTours([...tours, newTour]);
    toast.success(`New tour added for ${band.name}`);
  };

  const addTourDate = (tourId: string, tourDate: Omit<TourDate, "id">) => {
    const tour = getTour(tourId);
    if (!tour) {
      toast.error("Tour not found");
      return;
    }

    const newTourDate: TourDate = {
      ...tourDate,
      id: crypto.randomUUID(),
    };

    setTours(tours.map(t => {
      if (t.id === tourId) {
        return {
          ...t,
          dates: [...t.dates, newTourDate],
        };
      }
      return t;
    }));
    toast.success(`New tour date added`);
  };

  const getBand = (id: string) => {
    return bands.find(band => band.id === id);
  };

  const getTour = (id: string) => {
    return tours.find(tour => tour.id === id);
  };

  const getBandTours = (bandId: string) => {
    return tours.filter(tour => tour.bandId === bandId);
  };

  return (
    <BandsContext.Provider
      value={{
        bands,
        tours,
        addBand,
        addTour,
        addTourDate,
        getBand,
        getTour,
        getBandTours,
      }}
    >
      {children}
    </BandsContext.Provider>
  );
};
