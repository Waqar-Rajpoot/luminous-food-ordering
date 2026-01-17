"use client";

import { upload } from "@imagekit/next";
import { Loader2, Image as ImageIcon, XCircle } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios"; // Import axios

interface FileUploadProps {
  onChange: (value: any) => void;
  value: string;
  name: string;
  label?: string;
  disabled?: boolean;
  onUploadProgress?: (progress: number) => void;
}

const FileUpload = ({
  onChange,
  value,
  name,
  label = "Upload product image",
  disabled = false,
  onUploadProgress,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<any>(value || null);

  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const validateFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (e.g., .jpg, .png, .jpeg, .gif, .webp).");
      return false;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Please select a file less than ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      onChange("");
      setPreviewUrl(null);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    // Create a local blob URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    let auth: any;
    try {
      // Fetch authentication parameters from your API route using Axios
      const authRes = await axios.get("/api/imagekit-auth");
      auth = authRes.data; // Axios automatically parses JSON into .data

    } catch (err: any) {
      console.error("Error fetching ImageKit auth:", err);
      URL.revokeObjectURL(objectUrl); // Clean up blob URL if auth fails
      
      let errorMessage = "Failed to get ImageKit authentication.";
      if (axios.isAxiosError(err) && err.response) {
        // If it's an Axios error with a response, try to get the message from data
        errorMessage = err.response.data?.error || err.response.data?.message || JSON.stringify(err.response.data);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(`Image upload failed: ${errorMessage}`);
      onChange("");
      setPreviewUrl(null);
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    // Proceed with ImageKit upload if auth was successful
    try {
      const res = await upload({
        file: file,
        fileName: file.name,
        token: auth.token,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!, // Public key from client-side env
        signature: auth.signature,
        expire: auth.expire,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percent));
            onUploadProgress?.(Math.round(percent));
          }
        },
      });

      onChange(res.url);
      setPreviewUrl(res.url); // Update preview to the permanent ImageKit URL
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Error uploading file to ImageKit:", err); // More specific error message
      setError(err.message || "An error occurred during upload to ImageKit.");
      toast.error(err.message || "Image upload failed.");
      onChange("");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      URL.revokeObjectURL(objectUrl); // Revoke the original blob URL
    }
  }, [onChange, onUploadProgress]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Clear the input field's value so the same file can be selected again
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    onChange("");
    setPreviewUrl(null);
    setError(null);
    setUploading(false);
    setUploadProgress(0);
    toast.info("Image removed.");
  };

  return (
    <div className="flex flex-col gap-2 p-4 border border-[#efa765] rounded-lg bg-gray-800/90 relative">
      <label htmlFor={name} className="text-white text-sm font-sans mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*" // Only accepts image files
        onChange={handleFileChange} // Auto-upload on change
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-[#efa765] file:text-[#141f2d]
          hover:file:bg-opacity-80 transition-colors
          cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading || disabled}
      />

      {uploading && (
        <div className="flex items-center justify-center py-2 text-gray-300">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          <span>Uploading image... {uploadProgress}%</span>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {previewUrl && !uploading && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-gray-300 text-sm mb-2">Image Preview:</p>
          <div className="relative w-full max-w-50 h-37.5 rounded-md overflow-hidden border border-gray-700">
            <Image
              src={previewUrl}
              alt="Product Image Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              unoptimized={previewUrl.startsWith('blob:')} // Don't optimize blob URLs
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors z-10"
              title="Remove Image"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {!previewUrl && !uploading && !error && (
        <div className="mt-4 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-md text-gray-400">
          <ImageIcon className="h-10 w-10 mb-2" />
          <span>No image selected</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;