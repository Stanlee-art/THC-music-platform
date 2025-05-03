
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSong } from "@/lib/music-api";
import { Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface SongFormProps {
  song: any;
  onSuccess?: (updatedSong: any) => void;
}

const SongForm = ({ song, onSuccess }: SongFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(song.title || "");
  const [trackNumber, setTrackNumber] = useState<number>(song.track_number || 1);
  const [lyrics, setLyrics] = useState<string>(song.lyrics || "");
  const [imageUrl, setImageUrl] = useState<string | null>(song.image_url || null);
  
  const handleTrackNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackNumber(parseInt(e.target.value) || 1);
  };
  
  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const songData = {
        id: song.id,
        title: title.trim(),
        track_number: trackNumber,
        lyrics: lyrics.trim(),
      };
      
      const updatedSong = await updateSong(songData);
      
      if (updatedSong && onSuccess) {
        onSuccess(updatedSong);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/3">
          <div className="aspect-square rounded-md overflow-hidden bg-gray-800 mb-3">
            <ImageUploader
              type="song"
              id={song.id}
              currentImage={imageUrl}
              onImageUploaded={handleImageUploaded}
              variant="overlay"
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-gray-400 text-center">
            {imageUrl ? "Click image to change" : "Click to upload song artwork"}
          </p>
        </div>
        
        <div className="w-2/3 space-y-4">
          <div>
            <Label htmlFor="title">Song Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              className="bg-black/20 border-white/10"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="track-number">Track Number</Label>
            <Input
              id="track-number"
              type="number"
              min={1}
              value={trackNumber}
              onChange={handleTrackNumberChange}
              className="bg-black/20 border-white/10"
              required
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="lyrics">Lyrics (Optional)</Label>
        <Textarea
          id="lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Enter song lyrics"
          className="bg-black/20 border-white/10 min-h-[200px]"
        />
      </div>
      
      <div>
        <Label>File Information</Label>
        <div className="text-sm text-gray-400 space-y-1 mt-2">
          <p>Format: {song.file_format ? song.file_format.toUpperCase() : "Unknown"}</p>
          <p>
            Size: {song.file_size 
              ? `${(song.file_size / (1024 * 1024)).toFixed(2)} MB` 
              : "Unknown"}
          </p>
          <p>Quality: {song.encoding_rate || "Unknown"}</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SongForm;
