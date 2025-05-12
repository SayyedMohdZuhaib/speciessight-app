// src/components/SpeciesResult.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle, Info, Home, Utensils, Feather, ShieldAlert, ExternalLink } from "lucide-react";
// Import the Genkit output type
import type { ClassifySpeciesAndDescribeOutput } from "@/ai/flows/classify-species"; // Adjust path if needed

interface SpeciesResultProps {
  speciesDetails: ClassifySpeciesAndDescribeOutput;
  isDarkMode: boolean;
}

// Reusable component for each of the four detail blocks
const DetailBlock: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string;
  isDarkMode: boolean;
  className?: string;
}> = ({ icon: Icon, label, value, isDarkMode, className }) => {
  if (!value) return null;
  return (
    <div className={`p-4 rounded-lg flex flex-col items-start space-y-2 transition-all duration-300
                    ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700/70' : 'bg-slate-100/70 hover:bg-slate-200/70'}
                    ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-nature-leaf/90' : 'text-nature-moss/90'}`} />
        <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</p>
      </div>
      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value}</p>
    </div>
  );
};


export default function SpeciesResult({ speciesDetails, isDarkMode }: SpeciesResultProps) {
  const { 
    speciesName, 
    species,     
    confidence, 
    habitat,
    diet,
    behavior,    
    conservationStatus,
  } = speciesDetails;

  const confidenceColor = confidence > 0.75 
    ? (isDarkMode ? "text-green-400" : "text-green-600") 
    : confidence > 0.5 
    ? (isDarkMode ? "text-yellow-400" : "text-yellow-600")
    : (isDarkMode ? "text-red-400" : "text-red-600");

  const displayConfidence = confidence * 100;

  const generateWikipediaLink = (name: string) => {
    // Replace spaces with underscores for Wikipedia URL format
    const searchTerm = name.replace(/\s+/g, '_');
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`;
  };

  // Determine the best name for Wikipedia search (prefer species (scientific) if available and distinct)
  const wikipediaSearchTerm = species || speciesName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-5 sm:p-6 rounded-xl shadow-lg transition-colors duration-300
                  ${isDarkMode ? "bg-gray-700/60 border border-gray-600/70" : "bg-white/80 border border-gray-200/90"}
                  space-y-6`} 
    >
      {/* Header Section - Clickable Title */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-dashed dark:border-gray-600/70 border-gray-300/70">
        <div className={`p-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-nature-leaf/20' : 'bg-nature-moss/10'}`}>
            <CheckCircle className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? 'text-nature-leaf' : 'text-nature-moss'}`} />
        </div>
        <div className="flex-1">
            <a
              href={generateWikipediaLink(wikipediaSearchTerm)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-block text-2xl sm:text-3xl font-bold tracking-tight 
                          transition-colors duration-200
                          ${isDarkMode ? "text-gray-50 hover:text-nature-leaf" : "text-gray-900 hover:text-nature-moss"}`}
              title={`Learn more about ${speciesName} on Wikipedia`}
            >
              {speciesName}
              <ExternalLink className="w-4 h-4 ml-2 mb-1 inline-block opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
            </a>
            
            {species && species.toLowerCase() !== speciesName.toLowerCase() && !speciesName.toLowerCase().includes(species.toLowerCase()) && (
                 <p className={`text-sm italic mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    ({species})
                 </p>
            )}

            <div className="mt-3">
                <p className={`text-xs font-medium ${confidenceColor}`}>
                Confidence Score:
                </p>
                <div className={`w-full rounded-full h-2.5 mt-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <motion.div 
                    className={`h-2.5 rounded-full ${
                        displayConfidence > 75 ? (isDarkMode ? 'bg-green-500' : 'bg-green-600') :
                        displayConfidence > 50 ? (isDarkMode ? 'bg-yellow-500' : 'bg-yellow-600') :
                        (isDarkMode ? 'bg-red-500' : 'bg-red-600')
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${displayConfidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                </div>
                <p className={`text-right text-xs font-bold mt-0.5 ${confidenceColor}`}>
                    {displayConfidence.toFixed(1)}%
                </p>
            </div>
        </div>
      </div>

      {/* Four Equal Blocks Section */}
      {(habitat || diet || behavior || conservationStatus) && (
        <div className={`p-1 rounded-xl 
                        ${isDarkMode ? 'bg-gray-600/30' : 'bg-gray-200/40'}`}> 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                <DetailBlock icon={Home} label="Habitat" value={habitat} isDarkMode={isDarkMode} />
                <DetailBlock icon={Utensils} label="Typical Diet" value={diet} isDarkMode={isDarkMode} />
                <DetailBlock icon={Feather} label="Typical Behavior" value={behavior} isDarkMode={isDarkMode} />
                <DetailBlock icon={ShieldAlert} label="Conservation Status" value={conservationStatus} isDarkMode={isDarkMode} />
            </div>
        </div>
      )}
      

      {displayConfidence < 70 && (
        <div className={`mt-5 p-3 rounded-md flex items-start gap-2 text-sm ${isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50' : 'bg-yellow-50 text-yellow-700 border border-yellow-300/70'}`}>
            <Info size={18} className="flex-shrink-0 mt-0.5" />
            <span>The confidence level is moderate. For critical identification, consider cross-referencing with other sources.</span>
        </div>
      )}
    </motion.div>
  );
}