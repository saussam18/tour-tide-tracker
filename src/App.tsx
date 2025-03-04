
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BandsProvider } from "@/context/BandsContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AddBand from "./pages/AddBand";
import AddTour from "./pages/AddTour";
import Tours from "./pages/Tours";
import LocationTours from "./pages/LocationTours";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BandsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-band" element={<AddBand />} />
            <Route path="/add-tour/:bandId" element={<AddTour />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/location/:location" element={<LocationTours />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BandsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
