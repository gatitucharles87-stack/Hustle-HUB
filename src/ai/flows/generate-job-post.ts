'use server';

/**
 * @fileOverview Generates job post titles and descriptions using AI.
 *
 * - generateJobPost - A function that generates a job post.
 * - GenerateJobPostInput - The input type for the generateJobPost function.
 * - GenerateJobPostOutput - The return type for the generateJobPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobPostInputSchema = z.object({
  skills: z
    .string()
    .describe('List of required skills, separated by commas.'),
  experience: z
    .string()
    .describe('Required experience level (e.g., Entry-level, Mid-level, Senior-level).'),
  location: z.string().describe('Job location.'),
  category: z.string().describe('Job category (e.g., Tech, Home Services, Beauty).'),
});
export type GenerateJobPostInput = z.infer<typeof GenerateJobPostInputSchema>;

const GenerateJobPostOutputSchema = z.object({
  title: z.string().describe('Generated job post title.'),
  description: z.string().describe('Generated job post description.'),
});
export type GenerateJobPostOutput = z.infer<typeof GenerateJobPostOutputSchema>;

export async function generateJobPost(input: GenerateJobPostInput): Promise<GenerateJobPostOutput> {
  return generateJobPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobPostPrompt',
  input: {schema: GenerateJobPostInputSchema},
  output: {schema: GenerateJobPostOutputSchema},
  prompt: `You are an expert recruiter creating a compelling and detailed job post. Based on the provided information, generate an engaging job title and a comprehensive job description.

The job description should be structured, clean, and professional, making it easy for a freelancer to understand the role thoroughly.
- Start with a brief, engaging overview of the role (Job Summary).
- Create a "Responsibilities" section with a bulleted list of key duties.
- Create a "Qualifications" section with a bulleted list of essential skills and experience.
- Use clear headings for each section (e.g., "Responsibilities:", "Qualifications:"). Do not use markdown like asterisks. Write it as a flowing text with natural paragraph breaks and bullet points where appropriate.
- Avoid corporate jargon and boilerplate language.

Skills: {{{skills}}}
Experience: {{{experience}}}
Location: {{{location}}}
Category: {{{category}}}

Please generate a compelling title and a detailed job description based on these details.`,
});

const generateJobPostFlow = ai.defineFlow(
  {
    name: 'generateJobPostFlow',
    inputSchema: GenerateJobPostInputSchema,
    outputSchema: GenerateJobPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
