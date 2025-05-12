// src/components/ImageDropzone.tsx
"use client";

import { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { UploadCloud, ImageIcon, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // from shadcn/ui

interface ImageDropzoneProps {
  onImageUpload: (file: File) => void;
  isDarkMode: boolean;
}

export default function ImageDropzone({ onImageUpload, isDarkMode }: ImageDropzoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: any[]) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        toast({
          title: "File Upload Error",
          description: rejectedFiles[0].errors[0].message || "Invalid file type or size.",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onImageUpload(file);
      }
    },
    [onImageUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const baseClasses = "flex flex-col items-center justify-center w-full h-64 sm:h-72 p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const modeClasses = isDarkMode
    ? "border-gray-600 hover:border-gray-500 bg-gray-700/20 hover:bg-gray-700/40 focus:ring-nature-leaf/70"
    : "border-gray-300 hover:border-gray-400 bg-gray-50/30 hover:bg-gray-100/50 focus:ring-nature-moss/70";
  
  const activeClasses = isDragActive 
    ? (isDarkMode ? "border-nature-leaf bg-gray-600/50" : "border-nature-moss bg-green-50/70")
    : "";
  const acceptClasses = isDragAccept ? (isDarkMode ? "border-green-400" : "border-green-500") : "";
  const rejectClasses = isDragReject ? (isDarkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-100/50") : "";


  return (
    <div
      {...getRootProps()}
      className={`${baseClasses} ${modeClasses} ${activeClasses} ${acceptClasses} ${rejectClasses}`}
    >
      <input {...getInputProps()} />
      {isDragReject ? (
        <AlertTriangle className={`w-16 h-16 mb-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`} />
      ) : isDragActive ? (
         <UploadCloud className={`w-16 h-16 mb-4 animate-bounce ${isDarkMode ? "text-nature-leaf" : "text-nature-moss"}`} />
      ) : (
        <ImageIcon className={`w-16 h-16 mb-4 ${isDarkMode ? "text-gray-500 group-hover:text-gray-400" : "text-gray-400 group-hover:text-gray-500"}`} />
      )}
     
      <p className={`text-lg font-semibold text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {isDragReject 
            ? "Invalid file type!"
            : isDragActive 
                ? "Drop the image here..." 
                : "Drag & drop an image here"}
      </p>
      <p className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        or click to select a file
      </p>
      <p className={`text-xs mt-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
        (PNG, JPG, WEBP, GIF up to 5MB)
      </p>
    </div>
  );
}