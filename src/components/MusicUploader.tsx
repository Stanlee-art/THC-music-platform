
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileAudio, 
  Upload, 
  Music, 
  Loader2, 
  Check, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { uploadAudio, validateAudioFile } from "@/lib/music-api";

interface MusicUploaderProps {
  albumId: string;
  onSongUploaded?: (song: any) => void;
  currentTrackCount?: number;
}

const MusicUploader = ({ albumId, onSongUploaded, currentTrackCount = 0 }: MusicUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [trackNumber, setTrackNumber] = useState(currentTrackCount + 1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateAudioFile(file);
      
      if (!validation.valid) {
        setFileError(validation.message || "Invalid file");
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setFileError(null);
      
      // Try to extract title from filename if not set
      if (!songTitle) {
        let fileName = file.name.split('.')[0]; // Remove extension
        fileName = fileName.replace(/-|_/g, ' '); // Replace dashes and underscores with spaces
        // Try to clean up common patterns like "01 - Song Name" or "01_Song_Name"
        const titleMatch = fileName.match(/^\d+\s*[_-]?\s*(.+)/);
        if (titleMatch) {
          fileName = titleMatch[1];
        }
        setSongTitle(fileName);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an audio file to upload");
      return;
    }
    
    if (!songTitle.trim()) {
      toast.error("Please enter a title for the song");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const song = await uploadAudio(
        selectedFile, 
        albumId, 
        songTitle, 
        trackNumber
      );
      
      if (song && onSongUploaded) {
        onSongUploaded(song);
        
        // Reset form
        setSongTitle("");
        setSelectedFile(null);
        setTrackNumber(prev => prev + 1);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border border-white/10 bg-black/20">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Upload New Song</h3>
          <p className="text-sm text-gray-400">Upload MP3, WAV or FLAC audio files (max 20MB)</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="songTitle">Song Title</Label>
            <Input
              id="songTitle"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Enter song title"
              className="bg-black/20 border-white/10"
            />
          </div>
          
          <div>
            <Label htmlFor="trackNumber">Track Number</Label>
            <Input
              id="trackNumber"
              type="number"
              min={1}
              value={trackNumber}
              onChange={(e) => setTrackNumber(parseInt(e.target.value) || 1)}
              className="bg-black/20 border-white/10"
            />
          </div>
          
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/mpeg,audio/wav,audio/flac"
              className="hidden"
            />
            
            {!selectedFile ? (
              <div 
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer
                  ${fileError ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:border-white/30'}`}
              >
                {fileError ? (
                  <div className="text-red-500 flex flex-col items-center gap-2">
                    <AlertCircle className="h-10 w-10" />
                    <p>{fileError}</p>
                    <p className="text-sm">Click to select another file</p>
                  </div>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <FileAudio className="h-10 w-10" />
                    <p>Click to select an audio file</p>
                    <p className="text-xs">MP3, WAV or FLAC (max 20MB)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-white/5">
                <div className="flex items-start gap-3">
                  <Music className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •&nbsp;
                      {selectedFile.type.replace('audio/', '').toUpperCase()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="flex-shrink-0"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !songTitle.trim()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Song
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicUploader;
