
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = "https://djadwbnfmhspczqwefzb.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define allowed audio formats and max file size (20MB)
const ALLOWED_AUDIO_FORMATS = ["audio/mpeg", "audio/wav", "audio/flac", "audio/mp3"];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

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

    if (profileError || !profile || !profile.is_artist || !profile.artist_id) {
      return new Response(
        JSON.stringify({ error: "Only artists can upload music" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process request based on path
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Handle multipart/form-data for file uploads
    if (path === "upload-audio" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const albumId = formData.get("albumId") as string;
      const title = formData.get("title") as string;
      const trackNumber = parseInt(formData.get("trackNumber") as string, 10);
      
      // Validate file
      if (!file) {
        return new Response(
          JSON.stringify({ error: "No file provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate file type
      if (!ALLOWED_AUDIO_FORMATS.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: "Invalid file type. Only MP3, WAV, and FLAC are allowed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: `File too large. Maximum size allowed is ${MAX_FILE_SIZE / (1024 * 1024)}MB` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify album ownership
      const { data: album, error: albumError } = await supabase
        .from("albums")
        .select("artist_id")
        .eq("id", albumId)
        .single();

      if (albumError || !album || album.artist_id !== profile.artist_id) {
        return new Response(
          JSON.stringify({ error: "Album not found or you don't have permission to add songs to it" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.artist_id}/${albumId}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("audio")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return new Response(
          JSON.stringify({ error: "Failed to upload file" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get the URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from("audio")
        .getPublicUrl(fileName);

      // Extract audio metadata
      const fileSize = file.size;
      let encodingRate = "Unknown";
      // For MP3 files, try to extract bitrate from filename or set default
      if (file.type === "audio/mpeg" || file.type === "audio/mp3") {
        const bitrateMatch = file.name.match(/(\d{3})kbps/i);
        encodingRate = bitrateMatch ? `${bitrateMatch[1]}kbps` : "128-320kbps";
      }

      // Store song info in database
      const { data: songData, error: songError } = await supabase
        .from("songs")
        .insert({
          title: title,
          artist_id: profile.artist_id,
          album_id: albumId,
          audio_url: urlData.publicUrl,
          track_number: trackNumber,
          file_format: fileExt,
          file_size: fileSize,
          encoding_rate: encodingRate
        })
        .select()
        .single();

      if (songError) {
        console.error("Song database entry error:", songError);
        // Clean up the uploaded file if database entry failed
        await supabase.storage.from("audio").remove([fileName]);
        
        return new Response(
          JSON.stringify({ error: "Failed to save song information" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, song: songData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (path === "upload-image" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const type = formData.get("type") as string; // artist, album, or song
      const id = formData.get("id") as string;
      
      // Validate image
      if (!file || !file.type.startsWith("image/")) {
        return new Response(
          JSON.stringify({ error: "Invalid image file" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate folder path based on type
      let folder = "";
      let table = "";
      
      if (type === "artist") {
        // Verify artist ownership
        if (profile.artist_id !== id) {
          return new Response(
            JSON.stringify({ error: "You can only update your own artist profile" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        folder = "artists";
        table = "artists";
      } else if (type === "album") {
        // Verify album ownership
        const { data: album, error: albumError } = await supabase
          .from("albums")
          .select("artist_id")
          .eq("id", id)
          .single();

        if (albumError || !album || album.artist_id !== profile.artist_id) {
          return new Response(
            JSON.stringify({ error: "Album not found or you don't have permission to update it" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        folder = "albums";
        table = "albums";
      } else if (type === "song") {
        // Verify song ownership
        const { data: song, error: songError } = await supabase
          .from("songs")
          .select("artist_id")
          .eq("id", id)
          .single();

        if (songError || !song || song.artist_id !== profile.artist_id) {
          return new Response(
            JSON.stringify({ error: "Song not found or you don't have permission to update it" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        folder = "songs";
        table = "songs";
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid image type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${id}/${Date.now()}.${fileExt}`;

      // Upload image to storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("images")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        return new Response(
          JSON.stringify({ error: "Failed to upload image" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get the URL for the uploaded image
      const { data: urlData } = supabase
        .storage
        .from("images")
        .getPublicUrl(fileName);

      // Update the database record with the new image URL
      const updateData: Record<string, string> = {};
      
      if (type === "artist" || type === "album") {
        updateData.image_url = urlData.publicUrl;
      } else if (type === "song") {
        updateData.image_url = urlData.publicUrl;
      }

      const { data: updateResult, error: updateError } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error("Database update error:", updateError);
        // Clean up the uploaded file if database update failed
        await supabase.storage.from("images").remove([fileName]);
        
        return new Response(
          JSON.stringify({ error: "Failed to update database with new image" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, url: urlData.publicUrl, data: updateResult }),
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
