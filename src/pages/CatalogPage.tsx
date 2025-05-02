
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Mock data for different catalog types
const catalogData = {
  singles: [
    { id: 1, title: "Urban Flow", artist: "MC Lyrical", releaseDate: "2023-12-15", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" },
    { id: 2, title: "Street Poetry", artist: "Flow Master", releaseDate: "2023-11-28", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625" },
    { id: 3, title: "Rhythm & Rhymes", artist: "Beat Maker", releaseDate: "2023-10-05", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { id: 4, title: "City Lights", artist: "MC Lyrical", releaseDate: "2023-09-22", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
    { id: 5, title: "Midnight Cipher", artist: "Flow Master", releaseDate: "2023-08-11", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
    { id: 6, title: "First Light", artist: "Beat Maker", releaseDate: "2023-07-30", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
  ],
  albums: [
    { id: 1, title: "THC Vol. 1", artist: "Various Artists", releaseDate: "2023-12-01", tracks: 12, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
    { id: 2, title: "Urban Legend", artist: "MC Lyrical", releaseDate: "2023-10-15", tracks: 10, image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625" },
    { id: 3, title: "The Blueprint", artist: "Flow Master", releaseDate: "2023-08-20", tracks: 11, image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" },
    { id: 4, title: "Masterpiece", artist: "Beat Maker", releaseDate: "2023-06-05", tracks: 9, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  ],
  mixtapes: [
    { id: 1, title: "Street Chronicles", artist: "MC Lyrical", releaseDate: "2023-11-10", tracks: 8, image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625" },
    { id: 2, title: "Underground Vibes", artist: "Flow Master", releaseDate: "2023-09-15", tracks: 7, image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
    { id: 3, title: "Beat Sessions", artist: "Beat Maker", releaseDate: "2023-07-25", tracks: 8, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
  ],
  eps: [
    { id: 1, title: "Flow EP", artist: "MC Lyrical", releaseDate: "2023-12-10", tracks: 5, image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
    { id: 2, title: "Rhythm State", artist: "Flow Master", releaseDate: "2023-10-28", tracks: 4, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
    { id: 3, title: "Beats & Pieces", artist: "Beat Maker", releaseDate: "2023-08-15", tracks: 6, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { id: 4, title: "The Prelude", artist: "MC Lyrical", releaseDate: "2023-06-22", tracks: 5, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
  ],
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const CatalogPage = () => {
  const { type = "singles" } = useParams<{ type: 'singles' | 'albums' | 'mixtapes' | 'eps' }>();
  const items = catalogData[type as keyof typeof catalogData] || [];
  
  // Format the type for display
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{formattedType}</h1>
        <p className="text-gray-400">Browse all {type} from THeeCosystem</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item: any) => (
          <Card key={item.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
            <CardContent className="p-4">
              <div className="mb-3 relative group">
                <img 
                  src={item.image} 
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
              <p className="text-sm text-gray-400">{item.artist}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Released: {formatDate(item.releaseDate)}</span>
                {item.tracks && <span>{item.tracks} tracks</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-400">No {type} found</h3>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
