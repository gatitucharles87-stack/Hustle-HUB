'use server';

import {
  generateJobPost,
  type GenerateJobPostOutput,
} from '@/ai/flows/generate-job-post';
import { z } from 'zod';

const formSchema = z.object({
  skills: z.string().min(1, 'Skills are required.'),
  experience: z.string().min(1, 'Experience level is required.'),
  location: z.string().min(1, 'Location is required.'),
  category: z.string().min(1, 'Category is required.'),
});

export type FormState = {
  message: string;
  errors?: {
    skills?: string[];
    experience?: string[];
    location?: string[];
    category?: string[];
  } | null;
  data: GenerateJobPostOutput | null;
};

export async function generateJobPostAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    skills: formData.get('skills'),
    experience: formData.get('experience'),
    location: formData.get('location'),
    category: formData.get('category'),
  };

  const validatedFields = formSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await generateJobPost(validatedFields.data);
    return {
      message: 'Job post generated successfully.',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
      data: null,
    };
  }
}
