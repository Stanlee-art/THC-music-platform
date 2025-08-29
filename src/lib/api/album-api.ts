import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Album types
export interface Album {
  id: string;
  title: string;
  artist_id: string;
  image_url?: string;
  year: string; // Database stores year as string, not number
  album_type: string;
  tracks?: number;
  description?: string;
  genres?: string[];
  release_date?: string;
  created_at: string;
  updated_at: string;
  artists?: {
    name: string;
    slug: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  album_id?: string;
  track_number?: number;
  duration?: number;
  file_url?: string;
  image_url?: string;
  lyrics?: string;
  is_single: boolean;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  bio?: string;
  genres?: string[];
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Album functions
export async function fetchAllAlbums(albumType?: string): Promise<Album[]> {
  try {
    let query = supabase
      .from('albums')
      .select(`
        *,
        artists:artist_id (name, slug)
      `)
      .order('created_at', { ascending: false });
    
    if (albumType) {
      query = query.eq('album_type', albumType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching albums:', error);
      toast.error('Failed to load albums');
      return [];
    }
    
    return data as Album[];
  } catch (error) {
    console.error('Error in fetchAllAlbums:', error);
    toast.error('An error occurred while loading albums');
    return [];
  }
}

export async function fetchAlbumsByArtistId(artistId: string): Promise<Album[]> {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('artist_id', artistId)
      .order('year', { ascending: false });
    
    if (error) {
      console.error(`Error fetching albums for artist ${artistId}:`, error);
      toast.error('Failed to load artist albums');
      return [];
    }
    
    return data as Album[];
  } catch (error) {
    console.error('Error in fetchAlbumsByArtistId:', error);
    return [];
  }
}

export async function createAlbum(albumData: Partial<Album>): Promise<Album | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to create an album');
      return null;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('artist_id')
      .eq('id', user.id)
      .single();
    
    if (!profile?.artist_id) {
      toast.error('You must have an artist profile to create albums');
      return null;
    }
    
    const { data, error } = await supabase
      .from('albums')
      .insert({
        title: albumData.title!,
        album_type: albumData.album_type!,
        artist_id: profile.artist_id,
        image_url: albumData.image_url,
        year: albumData.year,
        tracks: albumData.tracks,
        description: albumData.description,
        genres: albumData.genres
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating album:', error);
      toast.error('Failed to create album');
      return null;
    }
    
    toast.success('Album created successfully');
    return data as Album;
  } catch (error) {
    console.error('Error in createAlbum:', error);
    toast.error('An error occurred while creating album');
    return null;
  }
}

export async function updateAlbum(albumId: string, updates: Partial<Omit<Album, 'id' | 'created_at' | 'updated_at' | 'artists'>>): Promise<Album | null> {
  try {
    const { data, error } = await supabase
      .from('albums')
      .update(updates)
      .eq('id', albumId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating album:', error);
      toast.error('Failed to update album');
      return null;
    }
    
    toast.success('Album updated successfully');
    return data as Album;
  } catch (error) {
    console.error('Error in updateAlbum:', error);
    toast.error('An error occurred while updating album');
    return null;
  }
}

// Song functions
export async function fetchSongsByAlbumId(albumId: string): Promise<Song[]> {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('album_id', albumId)
      .order('track_number');
    
    if (error) {
      console.error(`Error fetching songs for album ${albumId}:`, error);
      toast.error('Failed to load album songs');
      return [];
    }
    
    return data as Song[];
  } catch (error) {
    console.error('Error in fetchSongsByAlbumId:', error);
    return [];
  }
}

export async function fetchSinglesByArtistId(artistId: string): Promise<Song[]> {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('artist_id', artistId)
      .eq('is_single', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching singles for artist ${artistId}:`, error);
      toast.error('Failed to load artist singles');
      return [];
    }
    
    return data as Song[];
  } catch (error) {
    console.error('Error in fetchSinglesByArtistId:', error);
    return [];
  }
}

// Artist functions
export async function fetchAllArtists(): Promise<Artist[]> {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to load artists');
      return [];
    }
    
    return data as Artist[];
  } catch (error) {
    console.error('Error in fetchAllArtists:', error);
    return [];
  }
}

export async function fetchArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching artist with slug ${slug}:`, error);
      toast.error('Failed to load artist details');
      return null;
    }
    
    return data as Artist;
  } catch (error) {
    console.error('Error in fetchArtistBySlug:', error);
    return null;
  }
}

// React Query hooks
export function useAlbums(albumType?: string) {
  return useQuery({
    queryKey: ['albums', albumType],
    queryFn: () => fetchAllAlbums(albumType),
  });
}

export function useArtistAlbums(artistId: string) {
  return useQuery({
    queryKey: ['artist-albums', artistId],
    queryFn: () => fetchAlbumsByArtistId(artistId),
    enabled: !!artistId,
  });
}

export function useAlbumSongs(albumId: string) {
  return useQuery({
    queryKey: ['album-songs', albumId],
    queryFn: () => fetchSongsByAlbumId(albumId),
    enabled: !!albumId,
  });
}

export function useArtists() {
  return useQuery({
    queryKey: ['artists'],
    queryFn: fetchAllArtists,
  });
}

export function useArtist(slug: string) {
  return useQuery({
    queryKey: ['artist', slug],
    queryFn: () => fetchArtistBySlug(slug),
    enabled: !!slug,
  });
}