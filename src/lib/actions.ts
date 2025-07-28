
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
  const jobPostData = {
    skills: formData.get('skills') as string,
    experience: formData.get('experience') as string,
    category: formData.get('category') as string,
    jobType: formData.get('jobType') as string,
    location: formData.get('location') as string,
  };

  if (jobPostData.jobType !== 'local') {
    jobPostData.location = 'Remote';
  }
  
  if (!jobPostData.skills || !jobPostData.experience || !jobPostData.category) {
    return {
      message: 'Invalid form data. Please fill out all required fields.',
      errors: null,
      data: null,
    };
  }
  
  try {
    const result = await generateJobPost({
      skills: jobPostData.skills,
      experience: jobPostData.experience,
      category: jobPostData.category,
      location: jobPostData.location,
    });
    return {
      message: 'Job post generated successfully.',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `An unexpected error occurred while generating the post: ${errorMessage}`,
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
