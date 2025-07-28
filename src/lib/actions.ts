
'use server';

import {
  generateJobPost,
  type GenerateJobPostOutput,
} from '@/ai/flows/generate-job-post';
import {
  generateBarterPost,
  type GenerateBarterPostOutput,
} from '@/ai/flows/generate-barter-post';
import { z } from 'zod';

// This schema is used for the barter post feature. It is working correctly.
const barterPostFormSchema = z.object({
  skillsToOffer: z.string().min(1, 'Skills to offer are required.'),
  skillsToReceive: z.string().min(1, 'Skills to receive are required.'),
});

export type JobPostFormState = {
  message: string;
  errors?: {
    skills?: string[];
    experience?: string[];
    location?: string[];
    category?: string[];
    jobType?: string[];
  } | null;
  data: GenerateJobPostOutput | null;
};

export type BarterPostFormState = {
  message: string;
  errors?: {
    skillsToOffer?: string[];
    skillsToReceive?: string[];
  } | null;
  data: GenerateBarterPostOutput | null;
};

// Simplified validation for the job post form to fix the error.
const jobPostFormSchema = z.object({
  skills: z.string().min(1, 'Skills are required.'),
  experience: z.string().min(1, 'Experience is required.'),
  category: z.string().min(1, 'Category is required.'),
  jobType: z.enum(['remote', 'local']),
  location: z.string().optional(),
});


export async function generateJobPostAction(
  prevState: JobPostFormState,
  formData: FormData
): Promise<JobPostFormState> {
  const rawFormData = {
    skills: formData.get('skills'),
    experience: formData.get('experience'),
    category: formData.get('category'),
    jobType: formData.get('jobType'),
    location: formData.get('location'),
  };

  // Basic validation to ensure required fields are strings
   const validatedFields = jobPostFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please fill out all required fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  const { skills, experience, category, jobType, location } = validatedFields.data;
  let finalLocation = 'Remote'; // Default to Remote

  // If the job is local, we must have a location.
  if (jobType === 'local') {
    if (!location || location.trim().length === 0) {
      return {
        message: 'Location is required for local jobs.',
        errors: { location: ['Location is required for local jobs.'] },
        data: null,
      };
    }
    finalLocation = location;
  }
  
  try {
    const result = await generateJobPost({
      skills,
      experience,
      category,
      location: finalLocation,
    });
    return {
      message: 'Job post generated successfully.',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred while generating the post. Please try again.',
      errors: null,
      data: null,
    };
  }
}


export async function generateBarterPostAction(
  prevState: BarterPostFormState,
  formData: FormData
): Promise<BarterPostFormState> {
  const rawFormData = {
    skillsToOffer: formData.get('skillsToOffer'),
    skillsToReceive: formData.get('skillsToReceive'),
  };

  const validatedFields = barterPostFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await generateBarterPost(validatedFields.data);
    return {
      message: 'Barter post generated successfully.',
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
