"use client";

import { upload } from "@imagekit/next";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have sonner for toasts

interface FileUploadProps {
  onSuccess: (url: any ) => void; // Expects the final URL
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
  label?: string; 
  disabled?: boolean; 
}

const FileUpload = ({
  onSuccess,
  onProgress,
  fileType = "image",
  label = `Choose ${fileType} file`,
  disabled = false,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File) => {
    setError(null); // Clear previous errors
    if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (e.g., .jpg, .png, .jpeg).");
        return false;
      }
    } else if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file (e.g., .mp4, .mov).");
        return false;
      }
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Please select a file less than ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null); // Clear file if validation fails
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) {
        const errorData = await authRes.json();
        throw new Error(errorData.message || "Failed to get ImageKit auth.");
      }
      const auth = await authRes.json();

      const res = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!, // Ensure this env var is set
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percent));
            onProgress(Math.round(percent));
          }
        },
      });

      // ImageKit's upload function returns an object with `url`
      onSuccess(res.url); // Pass the URL to the parent component
      toast.success("File uploaded successfully!");
      setSelectedFile(null); // Clear selected file after successful upload
      setUploadProgress(0);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.message || "An error occurred during upload.");
      toast.error(err.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border border-[#efa765] rounded-lg bg-card-background/90">
      <label
        htmlFor="file-upload"
        className="text-white text-sm font-sans mb-2"
      >
        {label}
      </label>
      <input
        id="file-upload"
        type="file"
        accept={fileType === "image" ? "image/*" : "video/*"}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-[#efa765] file:text-[#141f2d]
          hover:file:bg-opacity-80 transition-colors
          cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading || disabled}
      />

      {selectedFile && (
        <p className="text-gray-300 text-sm mt-1">
          Selected: {selectedFile.name}
        </p>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <button
        type="button"
        onClick={handleUploadClick}
        className="mt-4 bg-[#efa765] text-[#141f2d] font-bold py-2 px-4 rounded-lg
                   hover:bg-opacity-90 transition-colors shadow-md
                   flex items-center justify-center
                   disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading || !selectedFile || disabled}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" /> Uploading (
            {uploadProgress}%)
          </>
        ) : (
          "Upload File"
        )}
      </button>
    </div>
  );
};

export default FileUpload;
