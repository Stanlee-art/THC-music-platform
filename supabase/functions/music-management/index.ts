
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = "https://djadwbnfmhspczqwefzb.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Initialize Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Extract authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user session from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify if user is an artist by checking profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_artist, artist_id")
      .eq("id", user.id)
      .single();

    // Non-artists can still access read endpoints
    const isArtist = !profileError && profile && profile.is_artist && profile.artist_id;

    // Process request based on path and method
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();
    
    // Create or update artist profile
    if (path === "update-artist" && req.method === "POST") {
      if (!isArtist) {
        return new Response(
          JSON.stringify({ error: "Only artists can update artist profiles" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const requestData = await req.json();
      
      // Ensure the user can only update their own artist profile
      if (requestData.id !== profile.artist_id) {
        return new Response(
          JSON.stringify({ error: "You can only update your own artist profile" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update artist profile
      const { data: updatedArtist, error: updateError } = await supabase
        .from("artists")
        .update({
          name: requestData.name,
          bio: requestData.bio,
          genres: requestData.genres,
          website_url: requestData.website_url,
          facebook_url: requestData.facebook_url,
          twitter_url: requestData.twitter_url,
          instagram_url: requestData.instagram_url,
          spotify_url: requestData.spotify_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.artist_id)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update artist profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, artist: updatedArtist }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create new album
    if (path === "create-album" && req.method === "POST") {
      if (!isArtist) {
        return new Response(
          JSON.stringify({ error: "Only artists can create albums" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const requestData = await req.json();
      
      // Insert new album
      const { data: newAlbum, error: albumError } = await supabase
        .from("albums")
        .insert({
          artist_id: profile.artist_id,
          title: requestData.title,
          album_type: requestData.album_type || 'album',
          description: requestData.description,
          release_date: requestData.release_date,
          genres: requestData.genres,
          year: requestData.year || new Date().getFullYear().toString(),
          tracks: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (albumError) {
        return new Response(
          JSON.stringify({ error: "Failed to create album" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, album: newAlbum }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update existing album
    if (path === "update-album" && req.method === "POST") {
      if (!isArtist) {
        return new Response(
          JSON.stringify({ error: "Only artists can update albums" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const requestData = await req.json();
      
      // Verify album ownership
      const { data: albumData, error: albumCheckError } = await supabase
        .from("albums")
        .select("artist_id")
        .eq("id", requestData.id)
        .single();

      if (albumCheckError || !albumData || albumData.artist_id !== profile.artist_id) {
        return new Response(
          JSON.stringify({ error: "Album not found or you don't have permission to update it" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update album
      const { data: updatedAlbum, error: updateError } = await supabase
        .from("albums")
        .update({
          title: requestData.title,
          album_type: requestData.album_type,
          description: requestData.description,
          release_date: requestData.release_date,
          genres: requestData.genres,
          year: requestData.year,
          updated_at: new Date().toISOString()
        })
        .eq("id", requestData.id)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update album" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, album: updatedAlbum }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update song details
    if (path === "update-song" && req.method === "POST") {
      if (!isArtist) {
        return new Response(
          JSON.stringify({ error: "Only artists can update songs" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const requestData = await req.json();
      
      // Verify song ownership
      const { data: songData, error: songCheckError } = await supabase
        .from("songs")
        .select("artist_id")
        .eq("id", requestData.id)
        .single();

      if (songCheckError || !songData || songData.artist_id !== profile.artist_id) {
        return new Response(
          JSON.stringify({ error: "Song not found or you don't have permission to update it" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update song
      const { data: updatedSong, error: updateError } = await supabase
        .from("songs")
        .update({
          title: requestData.title,
          track_number: requestData.track_number,
          lyrics: requestData.lyrics,
          updated_at: new Date().toISOString()
        })
        .eq("id", requestData.id)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update song" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, song: updatedSong }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Reorder songs in an album
    if (path === "reorder-songs" && req.method === "POST") {
      if (!isArtist) {
        return new Response(
          JSON.stringify({ error: "Only artists can reorder songs" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const requestData = await req.json();
      const albumId = requestData.albumId;
      const songOrders = requestData.songOrders; // Array of {id, track_number}
      
      // Verify album ownership
      const { data: albumData, error: albumCheckError } = await supabase
        .from("albums")
        .select("artist_id")
        .eq("id", albumId)
        .single();

      if (albumCheckError || !albumData || albumData.artist_id !== profile.artist_id) {
        return new Response(
          JSON.stringify({ error: "Album not found or you don't have permission to update it" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update each song's track number
      for (const songOrder of songOrders) {
        await supabase
          .from("songs")
          .update({ track_number: songOrder.track_number })
          .eq("id", songOrder.id)
          .eq("album_id", albumId);
      }

      // Fetch the updated songs
      const { data: updatedSongs, error: fetchError } = await supabase
        .from("songs")
        .select("*")
        .eq("album_id", albumId)
        .order("track_number");

      if (fetchError) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch updated songs" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, songs: updatedSongs }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get artist with albums and songs
    if (path === "get-artist-content" && req.method === "GET") {
      const artistId = url.searchParams.get("artistId");
      
      if (!artistId) {
        return new Response(
          JSON.stringify({ error: "Artist ID is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch artist
      const { data: artist, error: artistError } = await supabase
        .from("artists")
        .select("*")
        .eq("id", artistId)
        .single();

      if (artistError) {
        return new Response(
          JSON.stringify({ error: "Artist not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch albums
      const { data: albums, error: albumsError } = await supabase
        .from("albums")
        .select("*")
        .eq("artist_id", artistId)
        .order("year", { ascending: false });

      if (albumsError) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch albums" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch songs for each album
      const albumsWithSongs = [];
      for (const album of albums) {
        const { data: songs, error: songsError } = await supabase
          .from("songs")
          .select("*")
          .eq("album_id", album.id)
          .order("track_number");

        if (!songsError) {
          albumsWithSongs.push({
            ...album,
            songs: songs
          });
        } else {
          albumsWithSongs.push({
            ...album,
            songs: []
          });
        }
      }

      return new Response(
        JSON.stringify({
          artist: artist,
          albums: albumsWithSongs
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we reach here, the requested endpoint doesn't exist
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
