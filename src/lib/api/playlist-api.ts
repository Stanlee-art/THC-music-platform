
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Playlist } from "./types";
import { useQuery } from "@tanstack/react-query";

// Playlist management
export async function createPlaylist(playlistData: { name: string; description?: string; is_public?: boolean }): Promise<Playlist | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to create a playlist');
      return null;
    }
    
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: user.id,
        name: playlistData.name,
        description: playlistData.description || null,
        is_public: playlistData.is_public !== undefined ? playlistData.is_public : true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
      return null;
    }
    
    toast.success('Playlist created successfully');
    return data as Playlist;
  } catch (error) {
    console.error('Error in createPlaylist:', error);
    toast.error('An error occurred while creating playlist');
    return null;
  }
}

export async function getUserPlaylists(): Promise<Playlist[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
      return [];
    }
    
    return data as Playlist[];
  } catch (error) {
    console.error('Error in getUserPlaylists:', error);
    return [];
  }
}

export async function addSongToPlaylist(playlistId: string, songId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_id: songId
      });
    
    if (error) {
      if (error.code === '23505') { // Unique violation
        toast.info('This song is already in the playlist');
        return false;
      }
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist');
      return false;
    }
    
    toast.success('Song added to playlist');
    return true;
  } catch (error) {
    console.error('Error in addSongToPlaylist:', error);
    toast.error('An error occurred while adding song to playlist');
    return false;
  }
}

export async function removeSongFromPlaylist(playlistId: string, songId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .match({ playlist_id: playlistId, song_id: songId });
    
    if (error) {
      console.error('Error removing song from playlist:', error);
      toast.error('Failed to remove song from playlist');
      return false;
    }
    
    toast.success('Song removed from playlist');
    return true;
  } catch (error) {
    console.error('Error in removeSongFromPlaylist:', error);
    toast.error('An error occurred while removing song from playlist');
    return false;
  }
}

export function useUserPlaylists() {
  return useQuery({
    queryKey: ['user-playlists'],
    queryFn: getUserPlaylists,
  });
}
