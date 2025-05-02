
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Mock data
const featuredArtists = [
  { id: 1, name: "MC Lyrical", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
  { id: 2, name: "Flow Master", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
  { id: 3, name: "Beat Maker", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
];

const featuredTracks = [
  { id: 1, title: "Urban Flow", artist: "MC Lyrical", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625" },
  { id: 2, title: "Street Poetry", artist: "Flow Master", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" },
  { id: 3, title: "Rhythm & Rhymes", artist: "Beat Maker", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { id: 4, title: "City Lights", artist: "MC Lyrical", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
  { id: 5, title: "Midnight Cipher", artist: "Flow Master", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
];

const latestReleases = [
  { id: 1, title: "THC Vol. 1", artist: "Various Artists", type: "Album", tracks: 12, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
  { id: 2, title: "Street Chronicles", artist: "MC Lyrical", type: "Mixtape", tracks: 8, image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625" },
  { id: 3, title: "Underground Vibes", artist: "Flow Master", type: "EP", tracks: 5, image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" },
  { id: 4, title: "First Light", artist: "Beat Maker", type: "Single", tracks: 1, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
];

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`container py-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className="relative h-80 mb-12 rounded-2xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" 
          alt="THC Music" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white text-shadow">
            Welcome to <span className="text-thc-blue text-glow">THC</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-md">
            Discover the latest tracks from THeeCosystem hip hop collective
          </p>
          <Button className="w-fit bg-thc-blue hover:bg-thc-blue-light text-white font-medium">
            <Play className="mr-2 h-4 w-4" /> Play Latest Releases
          </Button>
        </div>
      </div>

      {/* Featured Artists */}
      <section className="mb-10 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Artists</h2>
          <Link to="/artists" className="text-thc-blue hover:underline text-sm">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {featuredArtists.map((artist) => (
            <Card key={artist.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden">
              <CardContent className="p-0 relative group">
                <img src={artist.image} alt={artist.name} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-lg font-medium text-white">{artist.name}</h3>
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-12 w-12">
                    <Play size={20} className="text-white ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="mb-10 animate-fade-in" style={{animationDelay: "0.2s"}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Tracks</h2>
          <Link to="/catalog/singles" className="text-thc-blue hover:underline text-sm">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredTracks.map((track) => (
            <Card key={track.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-3 relative group">
                  <img src={track.image} alt={track.title} className="w-full aspect-square object-cover rounded" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                    <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-10 w-10">
                      <Play size={16} className="text-white ml-0.5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-white truncate">{track.title}</h3>
                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Releases */}
      <section className="animate-fade-in" style={{animationDelay: "0.4s"}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Releases</h2>
          <Link to="/catalog/albums" className="text-thc-blue hover:underline text-sm">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestReleases.map((release) => (
            <Card key={release.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
              <CardContent className="p-4">
                <div className="mb-3 relative group">
                  <img src={release.image} alt={release.title} className="w-full aspect-square object-cover rounded" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                    <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-10 w-10">
                      <Play size={16} className="text-white ml-0.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white truncate">{release.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{release.artist}</p>
                  </div>
                  <span className="text-xs text-thc-blue px-2 py-1 bg-thc-blue/10 rounded">
                    {release.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{release.tracks} tracks</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
