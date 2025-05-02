
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/card";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Music, Disc, Film } from "lucide-react";

// THC Artists complete data
const artistsData = {
  "saint": {
    name: "$aint",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    banner: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    type: "artist",
    bio: "$aint is one of the founding members of THeeCosystem, known for his unique flow and powerful lyrics.",
    followers: "12.5K",
    albums: [
      { id: 1, title: "Saint's World", tracks: 10, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", year: "2023" }
    ],
    singles: [
      { id: 1, title: "Higher Ground", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", year: "2023" },
      { id: 2, title: "Midnight Flow", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", year: "2023" }
    ]
  },
  "bill-james": {
    name: "Bill James",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    banner: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    type: "artist",
    bio: "Bill James brings a southern influence to THeeCosystem with his distinct style and storytelling abilities.",
    followers: "8.2K",
    albums: [
      { id: 1, title: "Bill's Vision", tracks: 12, image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", year: "2023" }
    ],
    singles: [
      { id: 1, title: "Street Dreams", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", year: "2023" },
      { id: 2, title: "City Lights", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", year: "2023" }
    ]
  },
  "kennrank": {
    name: "Kennrank",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    banner: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    type: "artist",
    bio: "Kennrank's experimental approach to hip hop has made him a standout member of THeeCosystem.",
    followers: "6.7K",
    albums: [
      { id: 1, title: "Mind of Kennrank", tracks: 11, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", year: "2022" }
    ],
    singles: [
      { id: 1, title: "Rhythm & Flow", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", year: "2023" },
      { id: 2, title: "Late Night Thoughts", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", year: "2022" }
    ]
  },
  "zzero": {
    name: "Zzero",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    banner: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07",
    type: "artist",
    bio: "Zzero contributes a raw, unfiltered energy to THeeCosystem collaborations.",
    followers: "5.3K",
    singles: [
      { id: 1, title: "Zero to Hero", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", year: "2023" },
      { id: 2, title: "Night Rider", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", year: "2023" }
    ]
  },
  "sean": {
    name: "Sean",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    banner: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6",
    type: "producer",
    bio: "Sean is the production mastermind behind many of THeeCosystem's biggest tracks, crafting unique beats and soundscapes.",
    followers: "7.1K",
    beats: [
      { id: 1, title: "Urban Groove", bpm: 95, image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", year: "2023" },
      { id: 2, title: "Midnight Rhythm", bpm: 85, image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", year: "2023" },
      { id: 3, title: "Street Flow", bpm: 90, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", year: "2023" },
      { id: 4, title: "Chill Vibes", bpm: 75, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", year: "2022" }
    ],
    productions: [
      { id: 1, title: "THC Vol. 1", tracks: 12, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", year: "2023" },
      { id: 2, title: "THC Vol. 2", tracks: 10, image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", year: "2023" }
    ]
  },
  "meme-joe": {
    name: "Meme Joe",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    banner: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740",
    type: "creator",
    bio: "Meme Joe brings THC to life through his creative video content, including skits and behind-the-scenes footage.",
    followers: "9.2K",
    // Redirects to the dedicated page
  }
};

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const artist = artistsData[artistId as string];

  if (!artist) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-400">Artist not found</h3>
        </div>
      </div>
    );
  }

  const getArtistIcon = (type: string) => {
    switch (type) {
      case 'producer':
        return <Disc className="h-6 w-6 text-thc-blue" />;
      case 'creator':
        return <Film className="h-6 w-6 text-thc-blue" />;
      default:
        return <Music className="h-6 w-6 text-thc-blue" />;
    }
  };

  return (
    <div>
      {/* Artist Banner & Info */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center" 
        style={{ backgroundImage: `url(${artist.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="container h-full flex items-end pb-6">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-thc-blue">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getArtistIcon(artist.type)}
                  <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
                </div>
                <p className="text-gray-300 mb-2">{artist.followers} followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Bio */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Biography</h2>
          <p className="text-gray-300">{artist.bio}</p>
        </div>

        {/* Albums Section - Only for artists with albums */}
        {artist.albums && artist.albums.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artist.albums.map(album => (
                <Card key={album.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={album.image} 
                        alt={album.title} 
                        className="w-full aspect-square object-cover rounded" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                        <Button className="rounded-full h-12 w-12 bg-thc-blue hover:bg-thc-blue-light p-0">
                          <Play className="h-5 w-5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-white">{album.title}</h3>
                    <p className="text-sm text-gray-400">{album.tracks} tracks • {album.year}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Singles Section - For artists with singles */}
        {artist.singles && artist.singles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Singles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {artist.singles.map(single => (
                <Card key={single.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={single.image} 
                        alt={single.title} 
                        className="w-full aspect-square object-cover rounded" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                        <Button className="rounded-full h-10 w-10 bg-thc-blue hover:bg-thc-blue-light p-0">
                          <Play className="h-4 w-4 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-white text-sm">{single.title}</h3>
                    <p className="text-xs text-gray-400">{single.year}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Beats Section - Only for producer (Sean) */}
        {artist.beats && artist.beats.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Beats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artist.beats.map(beat => (
                <Card key={beat.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={beat.image} 
                        alt={beat.title} 
                        className="w-full aspect-square object-cover rounded" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                        <Button className="rounded-full h-10 w-10 bg-thc-blue hover:bg-thc-blue-light p-0">
                          <Play className="h-4 w-4 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-white">{beat.title}</h3>
                    <p className="text-sm text-gray-400">{beat.bpm} BPM • {beat.year}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Productions Section - Only for producer (Sean) */}
        {artist.productions && artist.productions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Productions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artist.productions.map(production => (
                <Card key={production.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={production.image} 
                        alt={production.title} 
                        className="w-full aspect-square object-cover rounded" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                        <Button className="rounded-full h-12 w-12 bg-thc-blue hover:bg-thc-blue-light p-0">
                          <Play className="h-5 w-5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-white">{production.title}</h3>
                    <p className="text-sm text-gray-400">{production.tracks} tracks • {production.year}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetailPage;
