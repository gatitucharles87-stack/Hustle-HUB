'use server';

/**
 * @fileOverview Generates skill barter post titles and descriptions using AI.
 *
 * - generateBarterPost - A function that generates a barter post.
 * - GenerateBarterPostInput - The input type for the generateBarterPost function.
 * - GenerateBarterPostOutput - The return type for the generateBarterPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBarterPostInputSchema = z.object({
  skillsToOffer: z
    .string()
    .describe('A list of skills or services the user can provide.'),
  skillsToReceive: z
    .string()
    .describe('A list of skills or services the user wants in return.'),
});
export type GenerateBarterPostInput = z.infer<typeof GenerateBarterPostInputSchema>;

const GenerateBarterPostOutputSchema = z.object({
  title: z.string().describe('Generated title for the barter post.'),
  description: z.string().describe('Generated description for the barter post, written from the user\'s perspective.'),
});
export type GenerateBarterPostOutput = z.infer<typeof GenerateBarterPostOutputSchema>;

export async function generateBarterPost(input: GenerateBarterPostInput): Promise<GenerateBarterPostOutput> {
  return generateBarterPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBarterPostPrompt',
  input: {schema: GenerateBarterPostInputSchema},
  output: {schema: GenerateBarterPostOutputSchema},
  prompt: `You are an expert copywriter who specializes in creating compelling skill-barter and trade offers. Based on the user's input, generate an engaging title and a friendly, persuasive description for their barter post. The description should be from the first-person perspective (e.g., "I can offer...", "I'm looking for...").

Here is the information:
- Skills I can offer: {{{skillsToOffer}}}
- Skills I want in return: {{{skillsToReceive}}}

Please now generate a title and description for this barter post.`,
});

const generateBarterPostFlow = ai.defineFlow(
  {
    name: 'generateBarterPostFlow',
    inputSchema: GenerateBarterPostInputSchema,
    outputSchema: GenerateBarterPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
