"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { classifySpeciesAndDescribe } from "@/ai/flows/classify-species";

// Custom components
import ImageDropzone from "@/components/ImageDropzone";
import SpeciesResult from "@/components/SpeciesResult";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [speciesData, setSpeciesData] = useState<{
    species: string;
    confidence: number;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setSpeciesData(null); // Reset previous results
    };
    reader.readAsDataURL(file);
  };

  const handleClassification = async () => {
    if (!imageUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await classifySpeciesAndDescribe({ photoUrl: imageUrl });
      setSpeciesData(result);
    } catch (error) {
      console.error("Classification failed:", error);
      toast({
        title: "Classification failed",
        description: "There was a problem identifying the species",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setSpeciesData(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode 
          ? "bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100" 
          : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
      }`}
    >
      <div className="container max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Leaf className="h-6 w-6 text-nature-leaf" />
            <h1 className="text-2xl font-bold">
              Species<span className="text-nature-leaf">Sight</span>
            </h1>
          </motion.div>
          <ThemeToggle isDarkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>

        {/* Main Content */}
        <Card className={`border-0 shadow-lg overflow-hidden transition-all ${
          darkMode ? "bg-gray-800/30 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
        }`}>
          <CardContent className="p-6 space-y-6">
            {/* Introduction */}
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-xl font-medium">AI Species Identification</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Upload a photo of a plant, animal or insect to identify it
              </p>
            </div>

            {/* Dropzone or Image Preview */}
            <AnimatePresence mode="wait">
              {!imageUrl ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ImageDropzone onImageUpload={handleImageUpload} isDarkMode={darkMode} />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/20">
                    <img
                      src={imageUrl}
                      alt="Species"
                      className="object-contain w-full h-full"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <AlertCircle size={16} />
                    </button>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      onClick={handleClassification}
                      disabled={loading}
                      className={`px-8 text-white font-medium transition-all ${
                        loading ? "bg-nature-moss animate-pulse-subtle" : "bg-nature-leaf hover:bg-nature-moss"
                      }`}
                    >
                      {loading ? "Analyzing..." : "Identify Species"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {speciesData && (
                <SpeciesResult speciesData={speciesData} isDarkMode={darkMode} />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Species identification powered by AI | 2025
          </p>
        </div>
      </div>
    </div>
  );
}
