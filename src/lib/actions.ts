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

const updateBarterPostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required.'),
  skillsToOffer: z.string().min(1, 'Skills to offer are required.'),
  skillsToReceive: z.string().min(1, 'Skills to receive are required.'),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
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

export type UpdateBarterPostFormState = {
  message: string;
  errors?: {
    postId?: string[];
    skillsToOffer?: string[];
    skillsToReceive?: string[];
    title?: string[];
    description?: string[];
  } | null;
  data: { success: boolean } | null;
};


export async function generateJobPostAction(
  prevState: JobPostFormState,
  formData: FormData
): Promise<JobPostFormState> {
  const jobPostData = {
    skills: (formData.get('skills') as string) || '',
    experience: (formData.get('experience') as string) || '',
    category: (formData.get('category') as string) || '',
    jobType: (formData.get('jobType') as string) || 'remote',
    location: (formData.get('location') as string) || '',
  };

  if (jobPostData.jobType !== 'local') {
    jobPostData.location = 'Remote';
  }

  // No more validation checks. Directly call the AI.
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

export async function updateBarterPostAction(
  prevState: UpdateBarterPostFormState,
  formData: FormData
): Promise<UpdateBarterPostFormState> {
  const rawFormData = {
    postId: formData.get('postId'),
    skillsToOffer: formData.get('skillsToOffer'),
    skillsToReceive: formData.get('skillsToReceive'),
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const validatedFields = updateBarterPostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  const { postId, skillsToOffer, skillsToReceive, title, description } = validatedFields.data;

  // Simulate API call to update the barter post
  console.log("Updating barter post with ID:", postId);
  console.log("New data:", { skillsToOffer, skillsToReceive, title, description });

  // In a real application, you would make an API call here to update the post in your database.
  // Example: await db.updateBarterPost(postId, { skillsToOffer, skillsToReceive, title, description });

  return {
    message: 'Barter post updated successfully.',
    errors: null,
    data: { success: true },
  };
}
