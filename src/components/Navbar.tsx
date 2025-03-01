
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Music, Calendar, PlusCircle, Home } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Music className="h-5 w-5" />
          </div>
          <span className="font-display font-semibold text-xl">MoshPit</span>
        </NavLink>
        
        <div className="flex items-center space-x-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              "nav-link",
              isActive && "active"
            )}
            end
          >
            <span className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </span>
          </NavLink>
          
          <NavLink 
            to="/add-band" 
            className={({ isActive }) => cn(
              "nav-link",
              isActive && "active"
            )}
          >
            <span className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Band
            </span>
          </NavLink>
          
          <NavLink 
            to="/tours" 
            className={({ isActive }) => cn(
              "nav-link",
              isActive && "active"
            )}
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Tours
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
