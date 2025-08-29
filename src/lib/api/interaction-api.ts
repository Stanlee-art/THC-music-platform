
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Comment } from "./types";
import { 
  safeLikeSong, 
  safeUnlikeSong, 
  safeCheckSongLike, 
  safeAddComment, 
  safeGetSongComments 
} from "./temp-tables-api";

// Song likes - using safe implementations
export async function likeSong(songId: string): Promise<boolean> {
  return safeLikeSong(songId);
}

export async function unlikeSong(songId: string): Promise<boolean> {
  return safeUnlikeSong(songId);
}

export async function hasSongLike(songId: string): Promise<boolean> {
  return safeCheckSongLike(songId);
}

// Comments - using safe implementations
export async function addComment(songId: string, content: string): Promise<Comment | null> {
  return safeAddComment(songId, content);
}

export async function getSongComments(songId: string): Promise<Comment[]> {
  return safeGetSongComments(songId);
}
