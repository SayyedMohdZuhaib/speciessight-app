// noinspection ES6ConvertVarToLetConst
'use server';

/**
 * @fileOverview Classifies the species in an image and provides a description.
 *
 * - classifySpeciesAndDescribe - A function that handles the species classification and description process.
 * - ClassifySpeciesAndDescribeInput - The input type for the classifySpeciesAndDescribe function.
 * - ClassifySpeciesAndDescribeOutput - The return type for the classifySpeciesAndDescribe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ClassifySpeciesAndDescribeInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the wildlife photo.'),
});
export type ClassifySpeciesAndDescribeInput = z.infer<typeof ClassifySpeciesAndDescribeInputSchema>;

const ClassifySpeciesAndDescribeOutputSchema = z.object({
  species: z.string().describe('The identified species of the wildlife.'),
  confidence: z.number().describe('The confidence score of the classification.'),
  description: z.string().describe('A detailed description of the identified species.'),
});
export type ClassifySpeciesAndDescribeOutput = z.infer<typeof ClassifySpeciesAndDescribeOutputSchema>;

export async function classifySpeciesAndDescribe(
  input: ClassifySpeciesAndDescribeInput
): Promise<ClassifySpeciesAndDescribeOutput> {
  return classifySpeciesAndDescribeFlow(input);
}

const classifySpeciesPrompt = ai.definePrompt({
  name: 'classifySpeciesPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the wildlife photo.'),
    }),
  },
  output: {
    schema: z.object({
      species: z.string().describe('The identified species of the wildlife.'),
      confidence: z.number().describe('The confidence score of the classification.'),
    }),
  },
  prompt: `You are an expert wildlife identifier.  Given the following image, identify the species of wildlife in the image.  Return the species and a confidence score.

Image: {{media url=photoUrl}}`,
});

const describeSpeciesPrompt = ai.definePrompt({
  name: 'describeSpeciesPrompt',
  input: {
    schema: z.object({
      species: z.string().describe('The identified species of the wildlife.'),
    }),
  },
  output: {
    schema: z.object({
      description: z.string().describe('A detailed description of the identified species, including common/scientific name, habitat, diet, behavior, and conservation status.'),
    }),
  },
  prompt: `You are an expert wildlife expert.  Given the species, provide a detailed description of the identified species, including common/scientific name, habitat, diet, behavior, and conservation status.

Species: {{{species}}}`,
});

const classifySpeciesAndDescribeFlow = ai.defineFlow<
  typeof ClassifySpeciesAndDescribeInputSchema,
  typeof ClassifySpeciesAndDescribeOutputSchema
>(
  {
    name: 'classifySpeciesAndDescribeFlow',
    inputSchema: ClassifySpeciesAndDescribeInputSchema,
    outputSchema: ClassifySpeciesAndDescribeOutputSchema,
  },
  async input => {
    const {output: classificationOutput} = await classifySpeciesPrompt(input);
    const {output: descriptionOutput} = await describeSpeciesPrompt({
      species: classificationOutput!.species,
    });

    return {
      species: classificationOutput!.species,
      confidence: classificationOutput!.confidence,
      description: descriptionOutput!.description,
    };
  }
);
