
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to get the current user's session
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Function to check if the current user is an artist
export async function checkIsArtist() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isArtist: false, artistId: null };
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("is_artist, artist_id")
      .eq("id", user.id)
      .single();
      
    if (error || !data) {
      console.error("Error checking artist status:", error);
      return { isArtist: false, artistId: null };
    }
    
    return { 
      isArtist: data.is_artist === true, 
      artistId: data.artist_id 
    };
  } catch (error) {
    console.error("Error in checkIsArtist:", error);
    return { isArtist: false, artistId: null };
  }
}

// Upload an audio file
export async function uploadAudio(file: File, albumId: string, title: string, trackNumber: number) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to upload music");
      return null;
    }

    // Create FormData for the file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('albumId', albumId);
    formData.append('title', title);
    formData.append('trackNumber', String(trackNumber));
    
    const response = await fetch(`${supabase.functions.url}/music-upload/upload-audio`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to upload audio");
      return null;
    }

    toast.success("Audio uploaded successfully!");
    return data.song;
  } catch (error: any) {
    console.error("Error uploading audio:", error);
    toast.error(error.message || "An error occurred during audio upload");
    return null;
  }
}

// Upload an image file (for artist, album, or song)
export async function uploadImage(file: File, type: 'artist' | 'album' | 'song', id: string) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to upload images");
      return null;
    }

    // Create FormData for the file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('id', id);
    
    const response = await fetch(`${supabase.functions.url}/music-upload/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to upload image");
      return null;
    }

    toast.success("Image uploaded successfully!");
    return data.url;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    toast.error(error.message || "An error occurred during image upload");
    return null;
  }
}

// Update artist profile
export async function updateArtist(artistData: any) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to update artist information");
      return null;
    }

    const response = await fetch(`${supabase.functions.url}/music-management/update-artist`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artistData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to update artist profile");
      return null;
    }

    toast.success("Artist profile updated successfully!");
    return data.artist;
  } catch (error: any) {
    console.error("Error updating artist:", error);
    toast.error(error.message || "An error occurred while updating artist");
    return null;
  }
}

// Create a new album
export async function createAlbum(albumData: any) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to create an album");
      return null;
    }

    const response = await fetch(`${supabase.functions.url}/music-management/create-album`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(albumData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to create album");
      return null;
    }

    toast.success("Album created successfully!");
    return data.album;
  } catch (error: any) {
    console.error("Error creating album:", error);
    toast.error(error.message || "An error occurred while creating album");
    return null;
  }
}

// Update an existing album
export async function updateAlbum(albumData: any) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to update an album");
      return null;
    }

    const response = await fetch(`${supabase.functions.url}/music-management/update-album`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(albumData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to update album");
      return null;
    }

    toast.success("Album updated successfully!");
    return data.album;
  } catch (error: any) {
    console.error("Error updating album:", error);
    toast.error(error.message || "An error occurred while updating album");
    return null;
  }
}

// Update song details
export async function updateSong(songData: any) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to update song information");
      return null;
    }

    const response = await fetch(`${supabase.functions.url}/music-management/update-song`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to update song");
      return null;
    }

    toast.success("Song updated successfully!");
    return data.song;
  } catch (error: any) {
    console.error("Error updating song:", error);
    toast.error(error.message || "An error occurred while updating song");
    return null;
  }
}

// Reorder songs in an album
export async function reorderSongs(albumId: string, songOrders: { id: string, track_number: number }[]) {
  try {
    const session = await getSession();
    
    if (!session) {
      toast.error("You must be logged in to reorder songs");
      return null;
    }

    const response = await fetch(`${supabase.functions.url}/music-management/reorder-songs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ albumId, songOrders }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.error || "Failed to reorder songs");
      return null;
    }

    toast.success("Songs reordered successfully!");
    return data.songs;
  } catch (error: any) {
    console.error("Error reordering songs:", error);
    toast.error(error.message || "An error occurred while reordering songs");
    return null;
  }
}

// Get artist with complete content (albums and songs)
export async function getArtistContent(artistId: string) {
  try {
    const session = await getSession();
    const headers: HeadersInit = {};
    
    if (session) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${supabase.functions.url}/music-management/get-artist-content?artistId=${artistId}`, {
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error fetching artist content:", data.error);
      return null;
    }

    return {
      artist: data.artist,
      albums: data.albums
    };
  } catch (error: any) {
    console.error("Error in getArtistContent:", error);
    return null;
  }
}

// Utility function to validate audio files
export function validateAudioFile(file: File): { valid: boolean; message?: string } {
  // Check file type
  const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
  
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Invalid file type. Please upload MP3, WAV, or FLAC files only.'
    };
  }
  
  // Check file size (max 20MB)
  const maxSize = 20 * 1024 * 1024; // 20MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size exceeds 20MB limit. Please compress or use a smaller file.`
    };
  }
  
  return { valid: true };
}

// Utility function to validate image files
export function validateImageFile(file: File): { valid: boolean; message?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { 
      valid: false, 
      message: 'Invalid file type. Please upload an image file.'
    };
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size exceeds 5MB limit. Please compress or use a smaller image.`
    };
  }
  
  return { valid: true };
}
