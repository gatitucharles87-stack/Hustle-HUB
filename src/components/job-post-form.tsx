
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateJobPostAction, type JobPostFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  skills: z.string().min(1, 'Skills are required.'),
  experience: z.string().min(1, 'Experience level is required.'),
  category: z.string().min(1, 'Category is required.'),
  jobType: z.enum(['remote', 'local']),
  location: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
}).refine(data => {
    if (data.jobType === 'local') {
        return !!data.location && data.location.length > 0;
    }
    return true;
}, {
    message: 'Location is required for local jobs.',
    path: ['location'],
});


type FormData = z.infer<typeof formSchema>;

function AIGenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="secondary">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
}

export function JobPostForm() {
  const { toast } = useToast();
  const initialState: JobPostFormState = { message: '', data: null };
  const [state, formAction] = useActionState(generateJobPostAction, initialState);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: '',
      experience: '',
      location: '',
      category: '',
      jobType: 'remote',
      title: '',
      description: '',
    },
  });

  const jobType = form.watch('jobType');

  useEffect(() => {
    if (state.message) {
      if(state.errors) {
        toast({
          title: 'Error generating post',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
    if (state.data) {
      form.setValue('title', state.data.title);
      form.setValue('description', state.data.description);
       toast({
          title: 'Success!',
          description: 'Job title and description have been generated.',
        });
    }
  }, [state, form, toast]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                    >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value="remote" />
                        </FormControl>
                        <FormLabel className="font-normal">Remote</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value="local" />
                        </FormControl>
                        <FormLabel className="font-normal">Local</FormLabel>
                        </FormItem>
                    </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          {jobType === 'local' && (
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Job Location</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Utawala, Nairobi" {...field} />
                    </FormControl>
                    <FormDescription>Required for local jobs.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
          )}
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Skills</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., React, Next.js, Plumbing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior-level">Senior-level</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Home Services">Home Services</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <AIGenerateButton />

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium font-headline">Generated Job Post</h3>
           <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
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
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="AI-generated description will appear here" {...field} rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
            <Button type="button" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Post Job
            </Button>
        </div>
      </form>
    </Form>
  );
}
