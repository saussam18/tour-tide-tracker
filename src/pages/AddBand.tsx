
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BandCard } from "@/components/BandCard";
import { useBands } from "@/context/BandsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Music, Image, Search } from "lucide-react";
import { toast } from "sonner";

const AddBand = () => {
  const navigate = useNavigate();
  const { bands, addBand } = useBands();
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Band name is required");
      return;
    }
    
    if (!genre.trim()) {
      toast.error("Genre is required");
      return;
    }
    
    addBand({
      name: name.trim(),
      genre: genre.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });
    
    setName("");
    setGenre("");
    setImageUrl("");
  };
  
  const filteredBands = bands.filter(band => 
    band.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    band.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-display font-bold">Bands</h1>
            <p className="text-muted-foreground">Add and manage your favorite bands</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Band Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-lg animate-fade-in">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <Music className="mr-2 h-5 w-5" />
                  Add New Band
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Band Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter band name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      placeholder="e.g. Rock, Metal, Pop"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="flex items-center">
                      <Image className="mr-1 h-4 w-4" />
                      Image URL (Optional)
                    </Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Band
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Band List */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {filteredBands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBands.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  {searchTerm ? (
                    <p>No bands match your search</p>
                  ) : (
                    <p>No bands added yet. Add your first band!</p>
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

export default AddBand;
