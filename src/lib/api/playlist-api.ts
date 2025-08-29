
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Playlist } from "./types";
import { useQuery } from "@tanstack/react-query";

// Safe playlist functions that handle missing tables
export async function createPlaylist(playlistData: { name: string; description?: string; is_public?: boolean }): Promise<Playlist | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to create a playlist');
      return null;
    }
    
    console.log('Playlist functionality not available yet');
    toast.info('Playlists feature coming soon!');
    return null;
  } catch (error) {
    console.log('Playlist functionality not available yet');
    toast.info('Playlists feature coming soon!');
    return null;
  }
}

export async function getUserPlaylists(): Promise<Playlist[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    console.log('Playlist functionality not available yet');
    return [];
  } catch (error) {
    console.log('Playlist functionality not available yet');
    return [];
  }
}

export async function addSongToPlaylist(playlistId: string, songId: string): Promise<boolean> {
  try {
    console.log('Playlist functionality not available yet');
    toast.info('Playlists feature coming soon!');
    return false;
  } catch (error) {
    console.log('Playlist functionality not available yet');
    toast.info('Playlists feature coming soon!');
    return false;
  }
}

export async function removeSongFromPlaylist(playlistId: string, songId: string): Promise<boolean> {
  try {
    console.log('Playlist functionality not available yet');
    toast.info('Playlists feature coming soon!');
    return false;
  } catch (error) {
    console.log('Playlist functionality not available yet');
    toast.info('Playlists feature coming soon!');
    return false;
  }
}

export function useUserPlaylists() {
  return useQuery({
    queryKey: ['user-playlists'],
    queryFn: getUserPlaylists,
  });
}
