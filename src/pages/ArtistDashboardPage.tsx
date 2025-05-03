
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Music, Disc, UploadCloud, Edit, User, ExternalLink } from "lucide-react";
import { checkIsArtist, getArtistContent } from "@/lib/music-api";
import { useQuery } from "@tanstack/react-query";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const ArtistDashboardPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Check if user is an artist
  const { data: artistStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['is-artist', user?.id],
    queryFn: checkIsArtist,
    enabled: !!user && isAuthenticated,
  });
  
  // Fetch artist content for the authenticated artist
  const { 
    data: artistData,
    isLoading: contentLoading,
    refetch: refetchArtist
  } = useQuery({
    queryKey: ['artist-content', artistStatus?.artistId],
    queryFn: () => getArtistContent(artistStatus?.artistId || ''),
    enabled: !!artistStatus?.isArtist && !!artistStatus?.artistId,
  });
  
  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    
    if (!statusLoading && !artistStatus?.isArtist && isAuthenticated) {
      toast.error("You don't have artist access");
      navigate("/", { replace: true });
    }
  }, [authLoading, isAuthenticated, statusLoading, artistStatus, navigate]);
  
  // Loading state
  if (authLoading || statusLoading || contentLoading || !artistData) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-thc-blue mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your artist dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { artist, albums = [] } = artistData;
  
  if (!artist) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Artist Profile Not Found</h2>
          <p className="text-gray-400 mb-6">Your artist profile could not be loaded.</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }
  
  // View artist profile in public view
  const viewPublicProfile = () => {
    navigate(`/artists/${artist.slug}`);
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artist Dashboard</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={viewPublicProfile}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Profile
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate("/upload")}
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Music
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="albums">
            <Disc className="h-4 w-4 mr-2" /> Albums
          </TabsTrigger>
          <TabsTrigger value="songs">
            <Music className="h-4 w-4 mr-2" /> Songs
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artist Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 flex-col md:flex-row">
                <div className="w-40 h-40">
                  <ImageUploader 
                    type="artist"
                    id={artist.id}
                    currentImage={artist.image_url}
                    variant="overlay"
                    onImageUploaded={(url) => {
                      refetchArtist();
                      toast.success("Profile image updated!");
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                  <p className="text-gray-400 mb-4">{artist.type}</p>
                  <p className="text-gray-300">{artist.bio}</p>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/edit-profile")}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Albums Tab */}
        <TabsContent value="albums" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Albums</CardTitle>
              <Button onClick={() => navigate("/upload/album")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Album
              </Button>
            </CardHeader>
            <CardContent>
              {albums.length === 0 ? (
                <div className="text-center py-10">
                  <Disc className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 mb-4">You haven't created any albums yet.</p>
                  <Button onClick={() => navigate("/upload/album")}>Create Your First Album</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album: any) => (
                    <Card key={album.id} className="overflow-hidden border-white/10 bg-white/5">
                      <div className="aspect-square">
                        <ImageUploader 
                          type="album"
                          id={album.id} 
                          currentImage={album.image_url}
                          variant="overlay"
                          onImageUploaded={() => {
                            refetchArtist();
                            toast.success("Album cover updated!");
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-1">{album.title}</h4>
                        <p className="text-sm text-gray-400">{album.year}</p>
                        <div className="mt-3 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/edit/album/${album.id}`)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/upload/song/${album.id}`)}
                          >
                            Add Songs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Songs Tab */}
        <TabsContent value="songs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Songs</CardTitle>
            </CardHeader>
            <CardContent>
              {albums.length === 0 || albums.every((album: any) => !album.songs || album.songs.length === 0) ? (
                <div className="text-center py-10">
                  <Music className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 mb-4">You haven't uploaded any songs yet.</p>
                  <Button onClick={() => navigate("/upload")}>Upload Your First Song</Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {albums.map((album: any) => (
                    album.songs && album.songs.length > 0 && (
                      <div key={album.id} className="space-y-4">
                        <h3 className="text-lg font-medium">{album.title}</h3>
                        <div className="divide-y divide-white/10">
                          {album.songs.map((song: any, index: number) => (
                            <div 
                              key={song.id} 
                              className="py-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-gray-400 w-6 text-center">{song.track_number}</span>
                                {song.image_url ? (
                                  <img 
                                    src={song.image_url} 
                                    alt={song.title} 
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                                    <Music className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{song.title}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/edit/song/${song.id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDashboardPage;
