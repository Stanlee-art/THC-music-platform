
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Artists
export async function fetchAllArtists() {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching artists:', error);
    toast.error('Failed to load artists');
    return [];
  }
  
  return data;
}

export async function fetchArtistBySlug(slug: string) {
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
  
  return data;
}

// Albums
export async function fetchAllAlbums(albumType?: string) {
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
  
  return data;
}

export async function fetchAlbumsByArtistId(artistId: string) {
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
  
  return data;
}

// Songs
export async function fetchSongsByAlbumId(albumId: string) {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('album_id', albumId);
  
  if (error) {
    console.error(`Error fetching songs for album ${albumId}:`, error);
    toast.error('Failed to load album songs');
    return [];
  }
  
  return data;
}

export async function fetchSinglesByArtistId(artistId: string) {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('artist_id', artistId)
    .eq('is_single', true);
  
  if (error) {
    console.error(`Error fetching singles for artist ${artistId}:`, error);
    toast.error('Failed to load artist singles');
    return [];
  }
  
  return data;
}

// Videos
export async function fetchVideosByArtistId(artistId: string) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('artist_id', artistId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching videos for artist ${artistId}:`, error);
    toast.error('Failed to load artist videos');
    return [];
  }
  
  return data;
}

// Beats
export async function fetchBeatsByProducerId(producerId: string) {
  const { data, error } = await supabase
    .from('beats')
    .select('*')
    .eq('producer_id', producerId)
    .order('year', { ascending: false });
  
  if (error) {
    console.error(`Error fetching beats for producer ${producerId}:`, error);
    toast.error('Failed to load producer beats');
    return [];
  }
  
  return data;
}

// File upload methods
export async function uploadImage(file: File, bucket: string, path: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload image');
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

// Update methods
export async function updateArtistProfile(id: string, updates: any) {
  const { error } = await supabase
    .from('artists')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating artist profile:', error);
    toast.error('Failed to update profile');
    return false;
  }
  
  toast.success('Profile updated successfully');
  return true;
}

export async function updateAlbum(id: string, updates: any) {
  const { error } = await supabase
    .from('albums')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating album:', error);
    toast.error('Failed to update album');
    return false;
  }
  
  toast.success('Album updated successfully');
  return true;
}

export async function updateSong(id: string, updates: any) {
  const { error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating song:', error);
    toast.error('Failed to update song');
    return false;
  }
  
  toast.success('Song updated successfully');
  return true;
}

export async function updateVideo(id: string, updates: any) {
  const { error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating video:', error);
    toast.error('Failed to update video');
    return false;
  }
  
  toast.success('Video updated successfully');
  return true;
}

export async function updateBeat(id: string, updates: any) {
  const { error } = await supabase
    .from('beats')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating beat:', error);
    toast.error('Failed to update beat');
    return false;
  }
  
  toast.success('Beat updated successfully');
  return true;
}
