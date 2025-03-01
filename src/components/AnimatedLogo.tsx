
import React from "react";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";

export const AnimatedLogo: React.FC = () => {
  return (
    <div className="relative">
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center mb-4 animate-fade-in">
          <Music className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight animate-fade-up">
          MoshPit
        </h1>
        <p className="text-muted-foreground text-lg mt-2 animate-fade-up" style={{ animationDelay: "100ms" }}>
          Track your favorite bands on tour
        </p>
      </div>
      <div className="absolute inset-0 blur-3xl opacity-10 bg-primary rounded-full animate-pulse" />
    </div>
  );
};
