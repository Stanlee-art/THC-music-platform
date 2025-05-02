
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const videos = [
  { id: 1, title: "THC Cypher Part 1", thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", duration: "3:45", views: "4.2K", date: "2023-12-15" },
  { id: 2, title: "Behind The Scenes - Album Recording", thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22", duration: "5:20", views: "3.8K", date: "2023-11-20" },
  { id: 3, title: "Freestyle Session with $aint", thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", duration: "2:15", views: "2.7K", date: "2023-10-10" },
  { id: 4, title: "Studio Tour with Meme Joe", thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", duration: "8:30", views: "5.1K", date: "2023-09-05" },
  { id: 5, title: "THC Rap Battle", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", duration: "10:45", views: "7.3K", date: "2023-08-22" },
  { id: 6, title: "A Day in the Life - Meme Joe", thumbnail: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", duration: "15:20", views: "6.5K", date: "2023-07-15" },
];

const categories = ["All", "Skits", "Behind The Scenes", "Shorts", "Vlogs"];

const AboutJoePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">It's All About Joe</h1>
        <p className="text-gray-400">Explore video content from Meme Joe</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category ? "bg-thc-blue hover:bg-thc-blue-light" : "border-white/10 hover:bg-white/5"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video relative group">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Button className="rounded-full h-12 w-12 bg-thc-blue hover:bg-thc-blue-light p-0">
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">{video.title}</h3>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                  <span>{video.views} views</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutJoePage;
