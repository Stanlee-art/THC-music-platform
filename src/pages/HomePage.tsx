
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllArtists, fetchAllAlbums } from "@/lib/database";

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch featured artists (limit to 3)
  const { data: allArtists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: fetchAllArtists
  });
  
  const featuredArtists = allArtists.slice(0, 3);
  
  // Fetch featured tracks (singles)
  const { data: allAlbums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => fetchAllAlbums()
  });
  
  // Get latest albums for the "Latest Releases" section
  const latestReleases = allAlbums.slice(0, 4);
  
  // Create a list of "featured tracks" from albums
  const featuredTracks = allAlbums
    .filter((album: any) => album.album_type === 'album')
    .slice(0, 5);

  useEffect(() => {
    // Only set loaded if we have data and after a small delay for a nice fade-in effect
    if (featuredArtists.length > 0 && latestReleases.length > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [featuredArtists.length, latestReleases.length]);

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
        
        {artistsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((skeleton) => (
              <Card key={skeleton} className="border border-white/5 bg-white/5">
                <CardContent className="p-0">
                  <div className="aspect-square bg-white/10 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {featuredArtists.map((artist: any) => (
              <Link to={`/artists/${artist.slug}`} key={artist.id}>
                <Card key={artist.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden">
                  <CardContent className="p-0 relative group">
                    <img src={artist.image_url} alt={artist.name} className="w-full aspect-square object-cover" />
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
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Tracks */}
      <section className="mb-10 animate-fade-in" style={{animationDelay: "0.2s"}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Tracks</h2>
          <Link to="/catalog/singles" className="text-thc-blue hover:underline text-sm">View All</Link>
        </div>
        
        {albumsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((skeleton) => (
              <Card key={skeleton} className="border border-white/5 bg-white/5">
                <CardContent className="p-4">
                  <div className="mb-3 aspect-square bg-white/10 animate-pulse rounded"></div>
                  <div className="h-5 bg-white/10 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-white/10 animate-pulse rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredTracks.map((track: any) => (
              <Card key={track.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden">
                <CardContent className="p-4">
                  <div className="mb-3 relative group">
                    <img src={track.image_url} alt={track.title} className="w-full aspect-square object-cover rounded" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                      <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-10 w-10">
                        <Play size={16} className="text-white ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium text-white truncate">{track.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{track.artists?.name || 'Various Artists'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Latest Releases */}
      <section className="animate-fade-in" style={{animationDelay: "0.4s"}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Releases</h2>
          <Link to="/catalog/albums" className="text-thc-blue hover:underline text-sm">View All</Link>
        </div>
        
        {albumsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((skeleton) => (
              <Card key={skeleton} className="border border-white/5 bg-white/5">
                <CardContent className="p-4">
                  <div className="mb-3 aspect-square bg-white/10 animate-pulse rounded"></div>
                  <div className="h-5 bg-white/10 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-white/10 animate-pulse rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestReleases.map((release: any) => (
              <Card key={release.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                <CardContent className="p-4">
                  <div className="mb-3 relative group">
                    <img src={release.image_url} alt={release.title} className="w-full aspect-square object-cover rounded" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                      <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-10 w-10">
                        <Play size={16} className="text-white ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white truncate">{release.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{release.artists?.name || 'Various Artists'}</p>
                    </div>
                    <span className="text-xs text-thc-blue px-2 py-1 bg-thc-blue/10 rounded">
                      {release.album_type === 'album' ? 'Album' : 
                       release.album_type === 'mixtape' ? 'Mixtape' : 
                       release.album_type === 'ep' ? 'EP' : 'Single'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{release.tracks} tracks</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
