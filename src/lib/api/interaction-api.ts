
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Comment } from "./types";

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
