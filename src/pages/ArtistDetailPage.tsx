import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Music, Disc, Film, Upload, Edit, PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchArtistBySlug, 
  fetchAlbumsByArtistId, 
  fetchSinglesByArtistId
} from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const ArtistDetailPage = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Fetch artist data
  const { 
    data: artist, 
    isLoading: artistLoading,
    refetch: refetchArtist
  } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => fetchArtistBySlug(artistId || ''),
  });
  
  // Fetch artist albums
  const { data: albums = [] } = useQuery({
    queryKey: ['artist-albums', artist?.id],
    queryFn: () => fetchAlbumsByArtistId(artist?.id),
    enabled: !!artist?.id,
  });
  
  // Fetch artist singles
  const { data: singles = [] } = useQuery({
    queryKey: ['artist-singles', artist?.id],
    queryFn: () => fetchSinglesByArtistId(artist?.id),
    enabled: !!artist?.id,
  });
  
  // Mock data until videos and beats tables are implemented
  const videos: any[] = [];
  const beats: any[] = [];

  // Profile updates will be available when artist profile functionality is implemented
  const handleProfileImageUpload = async (url: string) => {
    console.log('Profile image update functionality coming soon');
    toast.info('Profile updates coming soon!');
  };
  
  const handleBannerImageUpload = async (url: string) => {
    console.log('Banner image update functionality coming soon');
    toast.info('Profile updates coming soon!');
  };

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

  if (artistLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-64 md:h-80 bg-white/10 rounded-lg mb-6"></div>
          <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-400">Artist not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Artist Banner & Info */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center bg-gray-800" 
        style={{ backgroundImage: `url(${artist.image_url || "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="container h-full flex flex-col justify-between py-6">
            {isEditMode && (
              <div className="self-end">
                <ImageUploader 
                  type="artist"
                  id={artist.id}
                  currentImage={artist.image_url}
                  onImageUploaded={handleBannerImageUpload}
                  className="w-32 h-20"
                />
              </div>
            )}
            <div className="flex items-center gap-6 mt-auto">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-thc-blue">
                <img 
                  src={artist.image_url} 
                  alt={artist.name} 
                  className="w-full h-full object-cover" 
                />
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <ImageUploader 
                      type="artist"
                      id={artist.id}
                      currentImage={artist.image_url}
                      onImageUploaded={handleProfileImageUpload}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getArtistIcon('artist')}
                  <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
                </div>
                <p className="text-gray-300 mb-2">1.2K followers</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit mode toggle button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-4 right-4 bg-black/30 border-white/20"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "Done" : <><Edit className="h-4 w-4 mr-1" /> Edit Profile</>}
        </Button>
      </div>

      <div className="container py-8">
        {/* Bio */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Biography</h2>
          <p className="text-gray-300">{artist.bio}</p>
        </div>

        {/* Albums Section - Only for artists with albums */}
        {albums.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album: any) => (
                <Card key={album.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={album.image_url} 
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
              
              {isEditMode && (
                <Card className="border border-white/5 bg-white/5 hover:bg-white/10 transition border-dashed">
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                    <PlusCircle className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-500 text-center">Add New Album</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Singles Section - For artists with singles */}
        {singles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Singles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {singles.map((single: any) => (
                <Card key={single.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={single.image_url} 
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
              
              {isEditMode && (
                <Card className="border border-white/5 bg-white/5 hover:bg-white/10 transition border-dashed">
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                    <PlusCircle className="h-10 w-10 text-gray-500 mb-1" />
                    <p className="text-gray-500 text-sm text-center">Add New Single</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Videos Section - Videos functionality coming soon */}
        {artist.name === 'Joe' && videos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Videos</h2>
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
                        <Button className="rounded-full h-12 w-12 bg-thc-blue hover:bg-thc-blue-light p-0">
                          <Play className="h-5 w-5 ml-0.5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                        {video.duration}
                      </div>
                    </div>
                    <h3 className="font-medium text-white">{video.title}</h3>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{video.date}</span>
                      <span>{video.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {isEditMode && (
                <Card className="border border-white/5 bg-white/5 hover:bg-white/10 transition border-dashed">
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                    <PlusCircle className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-500 text-center">Add New Video</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Beats Section - Beats functionality coming soon */}
        {(artist.name === 'Sean' || artist.name === 'Meme') && beats.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Beats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {beats.map((beat: any) => (
                <Card key={beat.id} className="border border-white/5 bg-white/5 hover:bg-white/10 transition">
                  <CardContent className="p-4">
                    <div className="mb-3 relative group">
                      <img 
                        src={beat.image_url} 
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
              
              {isEditMode && (
                <Card className="border border-white/5 bg-white/5 hover:bg-white/10 transition border-dashed">
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                    <PlusCircle className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-500 text-center">Add New Beat</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetailPage;
