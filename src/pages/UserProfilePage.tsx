
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile, useUserProfile, UserProfile } from "@/lib/roles-api";

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, refetch } = useUserProfile();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    username: profile?.username || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Update form data when profile is loaded
  useState(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  });
  
  // Handle form update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedProfile = await updateUserProfile(formData);
      
      if (updatedProfile) {
        await refetch();
        toast.success("Profile updated successfully");
        navigate("/"); // Navigate to homepage or dashboard
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!profile) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-thc-blue mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your profile...</p>
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
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-32 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-2 flex items-center justify-center">
                    {formData.avatar_url ? (
                      <img 
                        src={formData.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={formData.display_name || ''}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">This is the name that will be shown publicly</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="avatar_url">Profile Image URL</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              
              {profile.role === 'listener' && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-2">Account Type: Listener</h3>
                  <p className="text-gray-400 text-sm">As a listener, you can create playlists, like songs, and comment on content.</p>
                </div>
              )}
              
              {profile.role === 'artist' && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-2">Account Type: Artist</h3>
                  <p className="text-gray-400 text-sm">As an artist, you can upload music and manage your artist profile.</p>
                  <Button 
                    variant="outline"
                    type="button"
                    className="mt-2"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Artist Profile
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
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

export default UserProfilePage;
