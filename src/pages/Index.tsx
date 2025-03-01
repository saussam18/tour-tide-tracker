import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { BandCard } from "@/components/BandCard";
import { TourItem } from "@/components/TourItem";
import { useBands } from "@/context/BandsContext";
import { PlusCircle, CalendarDays, Music } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { bands, tours } = useBands();
  const recentBands = [...bands].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  const upcomingTourDates = tours
    .flatMap(tour => tour.dates.map(date => ({ ...date, bandName: tour.bandName, bandId: tour.bandId })))
    .filter(date => new Date(date.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center md:text-left">
              <AnimatedLogo />
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg"
                  onClick={() => navigate("/add-band")}
                  className="animate-fade-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add a Band
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/tours")}
                  className="animate-fade-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View Tours
                </Button>
              </div>
            </div>
            
            <div className="flex-1 max-w-md w-full relative">
              <div className="relative aspect-square glass-card p-8 rounded-xl overflow-hidden animate-fade-in animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <Music className="h-24 w-24 text-primary/30 mb-6" />
                  <h3 className="text-xl font-medium text-center mb-4">
                    {bands.length > 0 
                      ? `Tracking ${bands.length} bands with ${tours.reduce((acc, tour) => acc + tour.dates.length, 0)} tour dates`
                      : "Start by adding your favorite bands"}
                  </h3>
                </div>
              </div>
              <div className="absolute -inset-2 blur-3xl opacity-10 bg-primary rounded-full -z-10" />
            </div>
          </div>
        </section>
        
        {/* Recent Bands Section */}
        {bands.length > 0 && (
          <section className="py-12 bg-secondary/50">
            <div className="container max-w-7xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Recent Bands</h2>
                {bands.length > 3 && (
                  <Button variant="ghost" onClick={() => navigate("/add-band")}>
                    View All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentBands.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
              
              {bands.length === 0 && (
                <Button 
                  onClick={() => navigate("/add-band")}
                  className="mx-auto mt-4 block"
                >
                  Add Your First Band
                </Button>
              )}
            </div>
          </section>
        )}
        
        {/* Upcoming Tour Dates */}
        {upcomingTourDates.length > 0 && (
          <section className="py-12">
            <div className="container max-w-7xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Upcoming Tours</h2>
                <Button variant="ghost" onClick={() => navigate("/tours")}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingTourDates.map((date) => (
                  <div 
                    key={date.id}
                    onClick={() => navigate(`/tours?band=${date.bandId}`)}
                    className="cursor-pointer"
                  >
                    <TourItem tourDate={date} bandName={date.bandName} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
