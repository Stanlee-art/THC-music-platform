
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPlaylist, useUserPlaylists } from "@/lib/roles-api";
import { useAuth } from "@/contexts/AuthContext";
import { Play, PlusCircle, Music, List } from "lucide-react";
import { formatDate } from "@/lib/utils";

const PlaylistsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: playlists = [], refetch } = useUserPlaylists();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    is_public: true
  });
  
  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) return;
    
    setCreatingPlaylist(true);
    try {
      await createPlaylist({
        name: newPlaylist.name,
        description: newPlaylist.description,
        is_public: newPlaylist.is_public
      });
      
      refetch();
      setIsDialogOpen(false);
      setNewPlaylist({ name: "", description: "", is_public: true });
    } finally {
      setCreatingPlaylist(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to view and create playlists.</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
                  placeholder="My Awesome Playlist"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                  placeholder="What's this playlist about?"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newPlaylist.is_public}
                  onCheckedChange={(checked) => setNewPlaylist({...newPlaylist, is_public: checked})}
                />
                <Label htmlFor="is_public">Make this playlist public</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={creatingPlaylist || !newPlaylist.name.trim()}
                onClick={handleCreatePlaylist}
              >
                {creatingPlaylist ? 'Creating...' : 'Create Playlist'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">
              <List className="h-4 w-4 mr-2" /> Grid View
            </TabsTrigger>
            <TabsTrigger value="list">
              <Music className="h-4 w-4 mr-2" /> List View
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="space-y-6">
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-4">You haven't created any playlists yet.</p>
              <Button onClick={() => setIsDialogOpen(true)}>Create Your First Playlist</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="overflow-hidden">
                  <div 
                    className="aspect-square bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center group cursor-pointer"
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                  >
                    <Music className="h-1/3 w-1/3 text-gray-400 group-hover:text-gray-300 transition-colors" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary" className="rounded-full h-12 w-12 p-0">
                        <Play className="h-5 w-5 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{playlist.name}</h3>
                    <p className="text-sm text-gray-400">{formatDate(playlist.created_at)}</p>
                    {!playlist.is_public && (
                      <div className="mt-1">
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full text-xs">Private</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-4">You haven't created any playlists yet.</p>
              <Button onClick={() => setIsDialogOpen(true)}>Create Your First Playlist</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="overflow-hidden">
                  <div className="p-4 flex items-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center rounded mr-4">
                      <Music className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-400 line-clamp-1">{playlist.description}</p>
                      )}
                      <p className="text-xs text-gray-500">{formatDate(playlist.created_at)}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlaylistsPage;
