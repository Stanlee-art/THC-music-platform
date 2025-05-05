
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Types
export type UserRole = 'artist' | 'listener';

export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_artist: boolean;
  artist_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  added_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  song_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface Like {
  id: string;
  user_id: string;
  song_id: string;
  created_at: string;
}

// API functions
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

export async function getUserRole(): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase.rpc('get_user_role');
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data as UserRole;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

export async function isUserArtist(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_artist');
    
    if (error) {
      console.error('Error checking artist status:', error);
      return false;
    }
    
    return data as boolean;
  } catch (error) {
    console.error('Error in isUserArtist:', error);
    return false;
  }
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return null;
    }
    
    toast.success('Profile updated successfully');
    return data as UserProfile;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    toast.error('An error occurred while updating profile');
    return null;
  }
}

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

// Song likes
export async function likeSong(songId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to like songs');
      return false;
    }
    
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        song_id: songId
      });
    
    if (error) {
      if (error.code === '23505') { // Unique violation
        toast.info('You have already liked this song');
        return false;
      }
      console.error('Error liking song:', error);
      toast.error('Failed to like song');
      return false;
    }
    
    toast.success('Song liked successfully');
    return true;
  } catch (error) {
    console.error('Error in likeSong:', error);
    toast.error('An error occurred while liking song');
    return false;
  }
}

export async function unlikeSong(songId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ user_id: user.id, song_id: songId });
    
    if (error) {
      console.error('Error unliking song:', error);
      toast.error('Failed to unlike song');
      return false;
    }
    
    toast.success('Song unliked successfully');
    return true;
  } catch (error) {
    console.error('Error in unlikeSong:', error);
    toast.error('An error occurred while unliking song');
    return false;
  }
}

export async function hasSongLike(songId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .match({ user_id: user.id, song_id: songId });
    
    if (error) {
      console.error('Error checking song like:', error);
      return false;
    }
    
    return data.length > 0;
  } catch (error) {
    console.error('Error in hasSongLike:', error);
    return false;
  }
}

// Comments
export async function addComment(songId: string, content: string): Promise<Comment | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to add comments');
      return null;
    }
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        song_id: songId,
        content: content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
    
    return data as Comment;
  } catch (error) {
    console.error('Error in addComment:', error);
    toast.error('An error occurred while adding comment');
    return null;
  }
}

export async function getSongComments(songId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('song_id', songId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      return [];
    }
    
    return data as Comment[];
  } catch (error) {
    console.error('Error in getSongComments:', error);
    return [];
  }
}

// Custom React Query hooks
export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: getCurrentUserProfile,
  });
}

export function useUserRole() {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: getUserRole,
  });
}

export function useIsArtist() {
  return useQuery({
    queryKey: ['is-artist'],
    queryFn: isUserArtist,
  });
}

export function useUserPlaylists() {
  return useQuery({
    queryKey: ['user-playlists'],
    queryFn: getUserPlaylists,
  });
}
