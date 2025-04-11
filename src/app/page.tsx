"use client";

import { useState } from "react";
import { classifySpeciesAndDescribe } from "@/ai/flows/classify-species";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [speciesData, setSpeciesData] = useState<{
    species: string;
    confidence: number;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleClassification = async () => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const result = await classifySpeciesAndDescribe({ photoUrl: imageUrl });
      setSpeciesData(result);
    } catch (error: any) {
      console.error("Classification failed:", error);
      alert(
        "Classification failed. Please ensure the image is a supported format."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setSpeciesData(null);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">WildChat</h1>
      <Card className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            {imageUrl && (
              <div className="flex flex-col items-start">
                <span className="text-gray-700 mb-1">User Image:</span>
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="mb-2 rounded-md max-w-full h-auto"
                />
              </div>
            )}

            {speciesData && (
              <div className="flex flex-col items-start">
                <span className="text-gray-700 mb-1">AI Response:</span>
                <div className="bg-teal-50 rounded-md p-3 text-sm text-gray-800">
                  <p className="font-semibold">
                    Species: {speciesData.species} (
                    {speciesData.confidence.toFixed(2)})
                  </p>
                  {speciesData.description && (
                    <div>
                      <h6 className="font-semibold mt-2">Description:</h6>
                      {speciesData.description
                        .split("\n\n")
                        .map((paragraph, index) => {
                          const [heading, ...content] = paragraph.split(":");
                          const formattedContent = content.join(":").trim();
                          return (
                            <div key={index} className="mb-2">
                              {heading && (
                                <h6 className="font-medium capitalize">
                                  {heading.replace("_", " ")}:
                                </h6>
                              )}
                              <p className="text-sm">{formattedContent}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageUpload}
              className="mb-2"
            />

            <div className="flex space-x-2">
              <Button
                onClick={handleClassification}
                disabled={loading}
                className={classNames(
                  "bg-teal-500 text-white font-bold py-2 px-4 rounded",
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-teal-700"
                )}
              >
                {loading ? "Classifying..." : "Classify Species"}
              </Button>

              <Button
                onClick={handleReset}
                disabled={loading}
                variant="outline"
                className="font-bold py-2 px-4 rounded"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
