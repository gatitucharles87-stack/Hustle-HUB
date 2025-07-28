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
  prompt: `You are an expert recruiter creating a compelling but concise job post. Based on the provided information, generate an engaging job title and a short, smart summary of the job.

The summary should be clean, professional, and easy for a freelancer to read quickly. It should not be a long, formal document.
- Start with a brief, engaging overview of the role.
- Clearly state the 2-3 most important responsibilities.
- List the essential skills or qualifications required.
- Do not use markdown formatting like asterisks, colons, or separate "sections" (e.g., "**Responsibilities:**"). Write it as a flowing text with natural paragraph breaks.
- Avoid corporate jargon and boilerplate language.

Skills: {{{skills}}}
Experience: {{{experience}}}
Location: {{{location}}}
Category: {{{category}}}

Please generate a compelling title and a concise job description summary based on these details.`,
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
