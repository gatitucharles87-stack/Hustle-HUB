'use client';

import { useEffect, useState, useActionState, startTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBarterPostAction, updateBarterPostAction, type BarterPostFormState, type UpdateBarterPostFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  skillsToOffer: z.string().min(1, 'Please list the skills you can offer.'),
  skillsToReceive: z.string().min(1, 'Please list the skills you want in return.'),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
});

type FormData = z.infer<typeof formSchema>;

// Mock data for existing posts - replace with actual API call
const mockBarterPosts = {
  "post-1": {
    skillsToOffer: "Graphic Design, Logo Creation",
    skillsToReceive: "Website Development, SEO",
    title: "Barter Graphic Design for Website Dev",
    description: "Looking to exchange my graphic design skills for professional website development and SEO optimization.",
  },
  "post-3": {
    skillsToOffer: "Professional Photography, Event Coverage",
    skillsToReceive: "Plumbing Services, Van Maintenance",
    title: "Photography for Plumbing Services",
    description: "I am a professional photographer available for events and portraits, seeking plumbing services for my home and maintenance for my work van.",
  },
};

export default function EditBarterPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const postId = params.postId as string;

  const initialGenerateState: BarterPostFormState = { message: '', data: null };
  const [generateState, generateAction] = useActionState(generateBarterPostAction, initialGenerateState);

  const initialUpdateState: UpdateBarterPostFormState = { message: '', data: null };
  const [updateState, updateAction] = useActionState(updateBarterPostAction, initialUpdateState);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillsToOffer: '',
      skillsToReceive: '',
      title: '',
      description: '',
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing post data
  useEffect(() => {
    const postData = mockBarterPosts[postId as keyof typeof mockBarterPosts];
    if (postData) {
      form.reset(postData); // Reset and set form values
    } else {
      toast({
        title: "Error",
        description: "Barter post not found.",
        variant: "destructive",
      });
      router.push('/skill-barter/my-applications'); // Redirect if post not found
    }
  }, [postId, form, router, toast]);

  // Handle AI generation response
  useEffect(() => {
    if (generateState.message) {
      setIsGenerating(false); // End loading
      if (generateState.errors) {
        toast({
          title: 'Error',
          description: generateState.message,
          variant: 'destructive',
        });
      }
    }
    if (generateState.data) {
      form.setValue('title', generateState.data.title);
      form.setValue('description', generateState.data.description);
      toast({
        title: 'Success!',
        description: 'Barter post details have been generated.',
      });
    }
  }, [generateState, form, toast]);

  // Handle update post response
  useEffect(() => {
    if (updateState.message) {
      if (updateState.errors) {
        toast({
          title: 'Error',
          description: updateState.message,
          variant: 'destructive',
        });
      } else if (updateState.data?.success) {
        toast({
          title: 'Success!',
          description: 'Your barter post has been updated.',
        });
        router.push('/skill-barter/my-applications'); // Redirect after successful update
      }
    }
  }, [updateState, router, toast]);

  const handleGenerateAI = async () => {
    setIsGenerating(true); // Start loading
    const currentFormValues = form.getValues();
    const formData = new FormData();
    formData.append('skillsToOffer', currentFormValues.skillsToOffer);
    formData.append('skillsToReceive', currentFormValues.skillsToReceive);
    
    // Wrap the action call in startTransition
    startTransition(async () => {
      await generateAction(formData);
    });
  };

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('skillsToOffer', data.skillsToOffer);
      formData.append('skillsToReceive', data.skillsToReceive);
      formData.append('title', data.title);
      formData.append('description', data.description);

      await updateAction(formData);
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-[625px]">
        <CardHeader>
          <CardTitle>Edit Barter Post</CardTitle>
          <CardDescription>You are editing the barter post with ID: {postId}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="skillsToOffer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills/Services I can offer</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Graphic Design, Plumbing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skillsToReceive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills/Services I need</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SEO writing, Tax advice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" disabled={isGenerating} variant="secondary" size="sm" onClick={handleGenerateAI}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="AI-generated title will appear here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="AI-generated description will appear here" {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="flex justify-end gap-2 p-0 pt-4">
                <Button type="submit" size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
