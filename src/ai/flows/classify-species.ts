// src/ai/flows/classify-species.ts
'use server';

import { ai } from '@/ai/ai-instance'; // Ensure this path is correct for your project
import { z } from 'genkit';
// Import auth from Clerk

// --- Input Schema --- (Stays the same)
const ClassifySpeciesAndDescribeInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the wildlife photo.'),
});
export type ClassifySpeciesAndDescribeInput = z.infer<typeof ClassifySpeciesAndDescribeInputSchema>;

// --- Output Schema --- (Stays the same)
const ClassifySpeciesAndDescribeOutputSchema = z.object({
  species: z.string().describe('The identified species of the wildlife.'),
  confidence: z.number().describe('The confidence score of the classification.'),
  speciesName: z.string(),
  habitat: z.string(),
  diet: z.string(),
  behavior: z.string(),
  conservationStatus: z.string(),
});
export type ClassifySpeciesAndDescribeOutput = z.infer<typeof ClassifySpeciesAndDescribeOutputSchema>;

// --- Prompts (Stay the same) ---
const classifySpeciesPrompt = ai.definePrompt({
  name: 'classifySpeciesPrompt',
  input: { schema: z.object({ photoUrl: z.string() }) },
  output: { schema: z.object({ species: z.string(), confidence: z.number() }) },
  prompt: `You are an expert wildlife identifier. 
Given the following image, identify the species of wildlife in the image. Return only the species name and your confidence score as a JSON object like:
{
  "species": "Panthera leo",
  "confidence": 0.95
}
Image: {{media url=photoUrl}}`,
});

const describeSpeciesPrompt = ai.definePrompt({
  name: 'describeSpeciesPrompt',
  input: { schema: z.object({ species: z.string() }) },
  output: {
    schema: z.object({
      speciesName: z.string(),
      habitat: z.string(),
      diet: z.string(),
      behavior: z.string(),
      conservationStatus: z.string(),
    }),
  },
  prompt: `You are an expert wildlife biologist.
Given the species name, return a valid JSON object with the following fields:
- speciesName: the common and scientific name
- habitat: typical environment
- diet: what it eats
- behavior: notable traits or social behavior
- conservationStatus: its IUCN or other global status
Species: {{{species}}}
Respond ONLY with valid JSON.`,
});

// --- Internal Genkit Flow Definition (Stays the same, not exported) ---
const classifySpeciesAndDescribeFlow = ai.defineFlow< // This is your actual Genkit flow
  typeof ClassifySpeciesAndDescribeInputSchema,
  typeof ClassifySpeciesAndDescribeOutputSchema
>(
  {
    name: 'classifySpeciesAndDescribeFlow', // This name is internal to Genkit
    inputSchema: ClassifySpeciesAndDescribeInputSchema,
    outputSchema: ClassifySpeciesAndDescribeOutputSchema,
  },
  async inputParams => { // Renamed 'input' to 'inputParams' to avoid conflict with outer scope if any
    const classificationResult = await classifySpeciesPrompt({ photoUrl: inputParams.photoUrl });
    if (!classificationResult || !classificationResult.output) {
      throw new Error("Classification prompt failed or returned empty output.");
    }
    const classificationOutput = classificationResult.output;

    const descriptionResult = await describeSpeciesPrompt({
      species: classificationOutput.species,
    });
    if (!descriptionResult || !descriptionResult.output) {
      throw new Error("Description prompt failed or returned empty output.");
    }
    const descriptionOutput = descriptionResult.output;

    return {
      species: classificationOutput.species,
      confidence: classificationOutput.confidence,
      speciesName: descriptionOutput.speciesName,
      habitat: descriptionOutput.habitat,
      diet: descriptionOutput.diet,
      behavior: descriptionOutput.behavior,
      conservationStatus: descriptionOutput.conservationStatus,
    };
  }
);

// --- MODIFIED Publicly Exported Server Action with Auth Protection ---
// This is the SINGLE exported function that your client (page.tsx) calls.
export async function classifySpeciesAndDescribe(
  input: ClassifySpeciesAndDescribeInput // Parameter name is 'input' here
): Promise<ClassifySpeciesAndDescribeOutput> {
  // If authenticated, proceed to call your internal Genkit flow
  // Pass the 'input' received by this exported function to the internal flow
  return classifySpeciesAndDescribeFlow(input);
}