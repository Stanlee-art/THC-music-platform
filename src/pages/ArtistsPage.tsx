
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data
const artists = [
  { id: 1, name: "MC Lyrical", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", tracks: 24, followers: "12.5K" },
  { id: 2, name: "Flow Master", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", tracks: 18, followers: "8.2K" },
  { id: 3, name: "Beat Maker", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", tracks: 15, followers: "6.7K" },
  { id: 4, name: "Lyric Queen", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", tracks: 12, followers: "5.3K" },
  { id: 5, name: "Rhythm King", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", tracks: 10, followers: "4.1K" },
  { id: 6, name: "Flow Agent", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", tracks: 8, followers: "3.2K" },
];

const ArtistsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredArtists.map((artist) => (
          <Card 
            key={artist.id} 
            className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden group"
          >
            <CardContent className="p-0">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-white">{artist.name}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-400 space-x-4">
                  <span>{artist.tracks} tracks</span>
                  <span>{artist.followers} followers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
