
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageDropzoneProps {
  onImageUpload: (file: File) => void;
  isDarkMode: boolean;
}

const ImageDropzone = ({ onImageUpload, isDarkMode }: ImageDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
        isDarkMode
          ? "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
      } ${isDragging ? "border-nature-leaf" : ""}`}
      whileHover={{ scale: 1.01 }}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{ height: "180px" }}
    >
      <div className="flex flex-col items-center space-y-2">
        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className={`rounded-full p-3 mb-2 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          {isDragging ? (
            <Camera className="w-6 h-6 text-nature-leaf" />
          ) : (
            <Upload className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          )}
        </motion.div>
        <p className="text-sm font-medium">
          Drop your image here or{" "}
          <span className="text-nature-leaf underline">browse</span>
        </p>
        <p className="text-xs opacity-60">Supports JPG, PNG</p>
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </motion.div>
  );
};

export default ImageDropzone;
