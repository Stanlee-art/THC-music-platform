
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Upload, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/music-api";
import { toast } from "sonner";

interface ImageUploaderProps {
  type: 'artist' | 'album' | 'song';
  id: string;
  currentImage?: string | null;
  onImageUploaded?: (url: string) => void;
  className?: string;
  variant?: 'button' | 'overlay';
}

const ImageUploader = ({ 
  type, 
  id, 
  currentImage, 
  onImageUploaded,
  className = "",
  variant = "button"
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      
      if (!validation.valid) {
        setFileError(validation.message || "Invalid image file");
        toast.error(validation.message || "Invalid image file");
        return;
      }
      
      setFileError(null);
      setIsUploading(true);
      
      try {
        const url = await uploadImage(file, type, id);
        
        if (url && onImageUploaded) {
          onImageUploaded(url);
        }
      } finally {
        setIsUploading(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (variant === "overlay") {
    return (
      <div className={`relative group ${className}`}>
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Current image" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <ImageIcon className="w-1/3 h-1/3 text-gray-600" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={isUploading}
            onClick={triggerFileInput}
            className="text-white border-white/50"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Change Image
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        variant="outline" 
        size="sm"
        disabled={isUploading}
        onClick={triggerFileInput}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {currentImage ? 'Change Image' : 'Upload Image'}
          </>
        )}
      </Button>
      
      {fileError && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{fileError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
