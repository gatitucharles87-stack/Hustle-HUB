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

const jobPostFormSchema = z.object({
  skills: z.string().min(1, 'Skills are required.'),
  experience: z.string().min(1, 'Experience level is required.'),
  category: z.string().min(1, 'Category is required.'),
  jobType: z.enum(['remote', 'local']),
  location: z.string().optional(),
});

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

export async function generateJobPostAction(
  prevState: JobPostFormState,
  formData: FormData
): Promise<JobPostFormState> {
  const rawFormData = {
    skills: formData.get('skills'),
    experience: formData.get('experience'),
    location: formData.get('location') || '',
    category: formData.get('category'),
    jobType: formData.get('jobType'),
  };

  const validatedFields = jobPostFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }
  
  // Refine location validation based on job type
  if (validatedFields.data.jobType === 'local' && !validatedFields.data.location) {
      return {
          message: 'Location is required for local jobs.',
          errors: { location: ['Location is required for local jobs.'] },
          data: null,
      };
  }


  try {
    const result = await generateJobPost({
        ...validatedFields.data,
        location: validatedFields.data.jobType === 'remote' ? 'Remote' : validatedFields.data.location!,
    });
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
