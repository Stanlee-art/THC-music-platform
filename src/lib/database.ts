
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
  const { data: directAlbums, error: directError } = await supabase
    .from('albums')
    .select('*')
    .eq('artist_id', artistId)
    .order('year', { ascending: false });
  
  if (directError) {
    console.error(`Error fetching albums for artist ${artistId}:`, directError);
    toast.error('Failed to load artist albums');
    return [];
  }
  
  // For collaborative albums like "Love Cycle" and "Backstreets (Compilation)"
  // In a real app, you would have a proper junction table for collaborations
  // This is a simplified approach for demonstration
  let collaborativeAlbums: any[] = [];
  
  if (directAlbums) {
    // Check if this is Kennrank or Bill James for Love Cycle collaboration
    if (directAlbums.some(album => album.title === 'Love Cycle')) {
      const artistData = await fetchArtistBySlug(artistId === (await fetchArtistBySlug('kennrank'))?.id ? 'bill-james' : 'kennrank');
      if (artistData) {
        const { data: collabAlbums } = await supabase
          .from('albums')
          .select('*')
          .eq('artist_id', artistData.id)
          .eq('title', 'Love Cycle');
          
        if (collabAlbums && collabAlbums.length > 0) {
          collaborativeAlbums = [...collaborativeAlbums, ...collabAlbums];
        }
      }
    }
    
    // For Backstreets compilation, which is collaborative across all artists
    if (!directAlbums.some(album => album.title.includes('Backstreets'))) {
      const { data: backstreetsAlbum } = await supabase
        .from('albums')
        .select('*')
        .ilike('title', '%Backstreets%');
        
      if (backstreetsAlbum && backstreetsAlbum.length > 0) {
        collaborativeAlbums = [...collaborativeAlbums, ...backstreetsAlbum];
      }
    }
  }
  
  return [...directAlbums, ...collaborativeAlbums];
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

// Auth methods
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*, artists(*)')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

export async function updateProfile(updates: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    toast.error('You must be logged in to update your profile');
    return false;
  }
  
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);
  
  if (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
    return false;
  }
  
  toast.success('Profile updated successfully');
  return true;
}

// Create methods for music and videos
export async function createAlbum(albumData: any) {
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
      ...albumData,
      artist_id: profile.artist_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating album:', error);
    toast.error('Failed to create album');
    return null;
  }
  
  toast.success('Album created successfully');
  return data;
}

export async function createSong(songData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    toast.error('You must be logged in to create a song');
    return null;
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('artist_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.artist_id) {
    toast.error('You must have an artist profile to create songs');
    return null;
  }
  
  const { data, error } = await supabase
    .from('songs')
    .insert({
      ...songData,
      artist_id: profile.artist_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating song:', error);
    toast.error('Failed to create song');
    return null;
  }
  
  toast.success('Song created successfully');
  return data;
}

export async function createVideo(videoData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    toast.error('You must be logged in to create a video');
    return null;
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('artist_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.artist_id) {
    toast.error('You must have an artist profile to create videos');
    return null;
  }
  
  const { data, error } = await supabase
    .from('videos')
    .insert({
      ...videoData,
      artist_id: profile.artist_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating video:', error);
    toast.error('Failed to create video');
    return null;
  }
  
  toast.success('Video created successfully');
  return data;
}

export async function createBeat(beatData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    toast.error('You must be logged in to create a beat');
    return null;
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('artist_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.artist_id) {
    toast.error('You must have a producer profile to create beats');
    return null;
  }
  
  const { data, error } = await supabase
    .from('beats')
    .insert({
      ...beatData,
      producer_id: profile.artist_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating beat:', error);
    toast.error('Failed to create beat');
    return null;
  }
  
  toast.success('Beat created successfully');
  return data;
}
