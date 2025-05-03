
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Music, Film, Disc } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllArtists } from "@/lib/database";

const ArtistsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { data: artists = [], isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: fetchAllArtists,
  });
  
  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [artists]);

  const filteredArtists = artists.filter((artist: any) => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getArtistIcon = (type: string) => {
    switch (type) {
      case 'producer':
        return <Disc className="h-5 w-5 text-thc-blue" />;
      case 'creator':
        return <Film className="h-5 w-5 text-thc-blue" />;
      default:
        return <Music className="h-5 w-5 text-thc-blue" />;
    }
  };

  if (error) {
    console.error('Error fetching artists:', error);
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Artists</h1>
        <p className="text-gray-400">Browse all artists from THeeCosystem</p>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search artists..."
          className="pl-10 bg-white/5 border-white/10 focus-visible:ring-thc-blue"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skeleton) => (
            <Card key={skeleton} className="border border-white/5 bg-white/5">
              <CardContent className="p-0">
                <div className="aspect-square bg-white/10 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-white/10 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-white/10 animate-pulse rounded w-2/3 mb-2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {filteredArtists.map((artist: any) => (
            <Link to={`/artists/${artist.slug}`} key={artist.id}>
              <Card 
                className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={artist.image_url} 
                      alt={artist.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      {getArtistIcon(artist.type)}
                      <h3 className="text-xl font-medium text-white">{artist.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">{artist.bio}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filteredArtists.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-400">No artists found</h3>
        </div>
      )}
    </div>
  );
};

export default ArtistsPage;
