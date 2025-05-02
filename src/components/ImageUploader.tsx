
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus } from "lucide-react";
import { uploadImage } from "@/lib/database";
import { toast } from "sonner";

interface ImageUploaderProps {
  bucketName: string;
  folderPath: string;
  onImageUploaded: (url: string) => void;
  existingImageUrl?: string;
  className?: string;
}

const ImageUploader = ({
  bucketName,
  folderPath,
  onImageUploaded,
  existingImageUrl,
  className = "",
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSize = file.size / 1024 / 1024; // in MB
    if (fileSize > 5) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, bucketName, folderPath);
      if (imageUrl) {
        onImageUploaded(imageUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {existingImageUrl ? (
        <div className="relative">
          <img
            src={existingImageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center text-white">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Change Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-thc-blue transition">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImagePlus className="h-12 w-12 mb-3" />
            <span className="text-sm font-medium mb-1">Upload Image</span>
            <span className="text-xs">Click to browse</span>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
          <div className="animate-pulse text-white">Uploading...</div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
