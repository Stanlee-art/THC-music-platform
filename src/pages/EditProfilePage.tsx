
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { updateArtist, checkIsArtist, getArtistContent } from "@/lib/music-api";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const EditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is an artist
  const { data: artistStatus } = useQuery({
    queryKey: ['is-artist', user?.id],
    queryFn: checkIsArtist,
    enabled: !!user,
  });
  
  // Fetch artist data
  const { data: artistData, isLoading } = useQuery({
    queryKey: ['artist-content', artistStatus?.artistId],
    queryFn: () => getArtistContent(artistStatus?.artistId || ''),
    enabled: !!artistStatus?.isArtist && !!artistStatus?.artistId,
  });
  
  const artist = artistData?.artist;
  
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    bio: artist?.bio || '',
    genres: artist?.genres ? artist.genres.join(', ') : '',
    website_url: artist?.website_url || '',
    facebook_url: artist?.facebook_url || '',
    twitter_url: artist?.twitter_url || '',
    instagram_url: artist?.instagram_url || '',
    spotify_url: artist?.spotify_url || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle form update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artist?.id) {
      toast.error("Artist profile not found");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedData = {
        id: artist.id,
        name: formData.name,
        bio: formData.bio,
        genres: formData.genres.split(',').map(g => g.trim()).filter(g => g),
        website_url: formData.website_url,
        facebook_url: formData.facebook_url,
        twitter_url: formData.twitter_url,
        instagram_url: formData.instagram_url,
        spotify_url: formData.spotify_url
      };
      
      const result = await updateArtist(updatedData);
      
      if (result) {
        toast.success("Profile updated successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading || !artist) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-thc-blue mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your artist profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Artist Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              
              <div>
                <Label htmlFor="genres">Genres (comma separated)</Label>
                <Input
                  id="genres"
                  name="genres"
                  value={formData.genres}
                  onChange={handleChange}
                  placeholder="Hip-Hop, R&B, Trap"
                />
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="spotify_url">Spotify</Label>
                    <Input
                      id="spotify_url"
                      name="spotify_url"
                      value={formData.spotify_url}
                      onChange={handleChange}
                      placeholder="https://open.spotify.com/artist/..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram_url">Instagram</Label>
                    <Input
                      id="instagram_url"
                      name="instagram_url"
                      value={formData.instagram_url}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter_url">Twitter</Label>
                    <Input
                      id="twitter_url"
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleChange}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="facebook_url">Facebook</Label>
                    <Input
                      id="facebook_url"
                      name="facebook_url"
                      value={formData.facebook_url}
                      onChange={handleChange}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;
