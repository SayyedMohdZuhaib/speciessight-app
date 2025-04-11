
import { motion } from "framer-motion";

interface SpeciesResultProps {
  speciesData: {
    species: string;
    confidence: number;
    description: string;
  };
  isDarkMode: boolean;
}

const SpeciesResult = ({ speciesData, isDarkMode }: SpeciesResultProps) => {
  const paragraphs = speciesData.description.split("\n\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-5 border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold text-nature-leaf">
          {speciesData.species}
        </h2>
        <div className="text-sm font-medium px-2 py-1 rounded-full bg-nature-leaf/10 text-nature-leaf">
          {Math.round(speciesData.confidence * 100)}% match
        </div>
      </div>

      <div className="space-y-4">
        {paragraphs.map((para, idx) => {
          // Check if the paragraph has a heading pattern
          const colonIndex = para.indexOf(":");
          if (colonIndex !== -1 && colonIndex < 30) {
            const heading = para.substring(0, colonIndex).trim();
            const content = para.substring(colonIndex + 1).trim();

            return (
              <div key={idx} className="space-y-1">
                <h4 className="text-sm font-semibold text-nature-moss uppercase tracking-wide">
                  {heading}
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {content}
                </p>
              </div>
            );
          }

          // If no heading pattern, just render the paragraph
          return (
            <p key={idx} className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {para}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SpeciesResult;
