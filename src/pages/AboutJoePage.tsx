
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchArtistBySlug } from "@/lib/api";

const AboutJoePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Fetch Joe's artist profile
  const { data: artist } = useQuery({
    queryKey: ['artist', 'joe'],
    queryFn: () => fetchArtistBySlug('joe'),
  });
  
  // Mock videos data until videos table exists
  const videos = [];
  const videosLoading = false;

  useEffect(() => {
    if (artist) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [artist]);

  return (
    <div className={`container py-8 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className="relative h-80 mb-12 rounded-2xl overflow-hidden">
        {artist && (
          <img 
            src={artist.image_url || "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"} 
            alt="Joe" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white text-shadow">
            It's All About <span className="text-thc-blue text-glow">Joe</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-md">
            Content creator for THeeCosystem
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">About Joe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            {artist && (
              <img 
                src={artist.image_url} 
                alt="Joe" 
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-300 mb-4">
              Joe brings THC to life through his creative video content, including skits and behind-the-scenes footage.
              As the visual storyteller for the collective, he captures the essence of THeeCosystem's journey and culture.
            </p>
            <p className="text-gray-300 mb-4">
              With an eye for authentic moments and compelling narratives, Joe's content provides fans with an intimate
              look at the artists and their creative process. From studio sessions to live performances, his work
              showcases the human side of THeeCosystem.
            </p>
            <div className="flex items-center text-gray-400 mt-6">
              <span className="mr-6">
                <strong className="text-thc-blue">{videos.length}</strong> videos
              </span>
              <span>
                <strong className="text-thc-blue">1.2K</strong> followers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Latest Videos</h2>
        
        {videosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((skeleton) => (
              <Card key={skeleton} className="border border-white/5 bg-white/5">
                <CardContent className="p-4">
                  <div className="mb-3 aspect-video bg-white/10 animate-pulse rounded"></div>
                  <div className="h-5 bg-white/10 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-white/10 animate-pulse rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any) => (
              <Card key={video.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                <CardContent className="p-4">
                  <div className="mb-3 relative group">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title} 
                      className="w-full aspect-video object-cover rounded" 
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                      <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-12 w-12">
                        <Play size={20} className="text-white ml-0.5" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-lg">{video.title}</h3>
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>{video.date}</span>
                    <span>{video.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Work With Joe</h2>
        <Card className="border border-white/10 bg-white/5">
          <CardContent className="p-6">
            <p className="text-gray-300 mb-6">
              Interested in collaborating with Joe for video content, visual projects, or promotional material?
              Get in touch to discuss how Joe can help bring your vision to life.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="bg-thc-blue hover:bg-thc-blue-light">
                Contact for Work
              </Button>
              <Button variant="outline" className="border-thc-blue text-thc-blue hover:bg-thc-blue/10">
                View Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutJoePage;
