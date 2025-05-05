
// User types
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

// Playlist types
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

// Interaction types
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
