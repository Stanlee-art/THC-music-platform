
import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAlbum, updateAlbum } from "@/lib/music-api";
import { Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface AlbumFormProps {
  artistId: string;
  existingAlbum?: any;
  onSuccess?: (album: any) => void;
}

const AlbumForm = ({ artistId, existingAlbum, onSuccess }: AlbumFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(existingAlbum?.title || "");
  const [description, setDescription] = useState(existingAlbum?.description || "");
  const [albumType, setAlbumType] = useState<string>(existingAlbum?.album_type || "album");
  const [year, setYear] = useState<string>(existingAlbum?.year || new Date().getFullYear().toString());
  const [genres, setGenres] = useState<string>(existingAlbum?.genres?.join(", ") || "");
  const [imageUrl, setImageUrl] = useState<string | null>(existingAlbum?.image_url || null);
  
  const isEditing = !!existingAlbum;
  
  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric input for year
    const value = e.target.value.replace(/\D/g, "");
    setYear(value);
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
      const albumData = {
        ...(isEditing && { id: existingAlbum.id }),
        title: title.trim(),
        description: description.trim(),
        album_type: albumType,
        year,
        genres: genres.split(",").map(g => g.trim()).filter(g => g),
      };
      
      const album = isEditing
        ? await updateAlbum(albumData)
        : await createAlbum(albumData);
      
      if (album && onSuccess) {
        onSuccess(album);
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
              type="album"
              id={existingAlbum?.id || "temp"}
              currentImage={imageUrl}
              onImageUploaded={handleImageUploaded}
              variant="overlay"
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-gray-400 text-center">
            {imageUrl ? "Click image to change" : "Click to upload cover art"}
          </p>
        </div>
        
        <div className="w-2/3 space-y-4">
          <div>
            <Label htmlFor="title">Album Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title"
              className="bg-black/20 border-white/10"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="album-type">Type</Label>
              <Select
                value={albumType}
                onValueChange={setAlbumType}
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="album">Album</SelectItem>
                  <SelectItem value="mixtape">Mixtape</SelectItem>
                  <SelectItem value="ep">EP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="year">Release Year</Label>
              <Input
                id="year"
                value={year}
                onChange={handleYearChange}
                placeholder="YYYY"
                maxLength={4}
                className="bg-black/20 border-white/10"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter album description"
          className="bg-black/20 border-white/10 min-h-[100px]"
        />
      </div>
      
      <div>
        <Label htmlFor="genres">Genres</Label>
        <Input
          id="genres"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="Enter genres (comma separated)"
          className="bg-black/20 border-white/10"
        />
        <p className="text-xs text-gray-400 mt-1">
          Separate genres with commas (e.g. Hip Hop, Rap, R&B)
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Save Changes" : "Create Album"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AlbumForm;
