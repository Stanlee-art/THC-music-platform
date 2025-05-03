
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAlbums } from "@/lib/database";
import { useState, useEffect } from "react";

// Type mapping for API to display labels
const typeLabels = {
  'album': 'Albums',
  'mixtape': 'Mixtapes',
  'ep': 'EPs',
  'singles': 'Singles'
};

// Catalog type to API type mapping
const catalogTypeMapping = {
  'singles': 'singles',
  'albums': 'album',
  'mixtapes': 'mixtape',
  'eps': 'ep'
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const CatalogPage = () => {
  const { type = "albums" } = useParams<{ type: 'singles' | 'albums' | 'mixtapes' | 'eps' }>();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get the API type parameter based on URL type
  const apiType = type !== 'singles' ? catalogTypeMapping[type as keyof typeof catalogTypeMapping] : null;
  
  // Fetch albums based on type
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['catalog', type],
    queryFn: () => fetchAllAlbums(apiType),
  });
  
  // Format the type for display
  const formattedType = typeLabels[type as keyof typeof typeLabels] || 'Albums';

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [items]);
  
  if (error) {
    console.error('Error fetching catalog data:', error);
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{formattedType}</h1>
        <p className="text-gray-400">Browse all {type} from THeeCosystem</p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skeleton) => (
            <Card key={skeleton} className="border border-white/5 bg-white/5">
              <CardContent className="p-4">
                <div className="w-full aspect-square bg-white/10 animate-pulse rounded mb-3"></div>
                <div className="h-5 bg-white/10 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-white/10 animate-pulse rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {items.map((item: any) => (
            <Card key={item.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
              <CardContent className="p-4">
                <div className="mb-3 relative group">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full aspect-square object-cover rounded" 
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                    <Button size="icon" className="bg-thc-blue hover:bg-thc-blue-light rounded-full h-12 w-12">
                      <Play size={20} className="text-white ml-0.5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-white text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.artists?.name || 'Various Artists'}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Released: {item.year}</span>
                  {item.tracks && <span>{item.tracks} tracks</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isLoading && items.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-400">No {type} found</h3>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
