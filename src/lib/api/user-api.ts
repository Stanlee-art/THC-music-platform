
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile, UserRole } from "./types";

// Function to get the current user's profile
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

// Function to get the current user's role
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

// Function to check if the current user is an artist
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

// Function to update the user's profile
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

// Hooks for user-related queries
import { useQuery } from "@tanstack/react-query";

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
