'use client';

import { useActionState, useEffect, useState, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateJobPostAction, postJobAction, type JobPostFormState, type PostJobState } from '@/lib/actions';
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
import api from '@/lib/api';

interface JobCategory {
  id: string;
  name: string;
}

const formSchema = z.object({
  skills: z.string().min(1, 'Skills are required.').transform(s => s.split(',').map(skill => skill.trim()).filter(Boolean)),
  experience: z.string().min(1, 'Experience level is required.'),
  category: z.string().min(1, 'Category is required.'), // This will be the category ID
  jobType: z.enum(['remote', 'local']),
  location: z.string().optional(),
  title: z.string().min(1, 'Job title is required.'),
  description: z.string().min(1, 'Job description is required.'),
  budget: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0, 'Budget cannot be negative.').nullable().optional()
  ),
  deadline: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.jobType === 'local' && (!data.location || data.location.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Location is required for local jobs.',
            path: ['location'],
        });
    }
    if (data.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Deadline must be in YYYY-MM-DD format.',
        path: ['deadline'],
      });
    }
});


type FormData = z.infer<typeof formSchema>;

function AIGenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="secondary" name="action" value="generate">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
}

function PostJobSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} name="action" value="post">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Post Job
    </Button>
  );
}

export function JobPostForm() {
  const { toast } = useToast();
  const initialGenerateState: JobPostFormState = { message: '', data: null };
  const [generateState, generateFormAction] = useActionState(generateJobPostAction, initialGenerateState);

  const initialPostState: PostJobState = { message: '', success: false };
  const [postState, postFormAction] = useActionState(postJobAction, initialPostState);

  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [], // Initialize as empty array
      experience: '',
      location: '',
      category: '',
      jobType: 'remote',
      title: '',
      description: '',
      budget: null,
      deadline: '',
    },
  });

  const jobType = form.watch('jobType');

  // Fetch job categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/job-categories/');
        setJobCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch job categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job categories.',
          variant: 'destructive',
        });
      }
    };
    fetchCategories();
  }, [toast]);

  useEffect(() => {
    if (generateState.message) {
      if(generateState.errors || (generateState.message && !generateState.data)) {
        toast({
          title: 'Error generating post',
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
          description: 'Job title and description have been generated.',
        });
    }
  }, [generateState, form, toast]);

  useEffect(() => {
    if (postState.message) {
      toast({
        title: postState.success ? 'Success!' : 'Error',
        description: postState.message,
        variant: postState.success ? 'default' : 'destructive',
      });
      if (postState.success) {
        form.reset(); // Reset form on successful submission
      }
    }
  }, [postState, form, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.currentTarget);
    const action = formData.get('action'); // Get the value from the clicked button's 'name="action"' attribute

    if (action === 'generate') {
      generateFormAction(formData);
    } else if (action === 'post') {
      form.handleSubmit(() => {
        // Need to convert form data to an object that postJobAction expects
        // The form.getValues() will provide the validated data
        const data = form.getValues();
        const formDataForPost = new FormData();
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = (data as any)[key];
            if (Array.isArray(value)) {
              formDataForPost.append(key, value.join(',')); // Convert array back to comma-separated string for action
            } else if (value !== null && value !== undefined) {
              formDataForPost.append(key, String(value));
            }
          }
        }
        postFormAction(formDataForPost);
      })();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                    <RadioGroup
                        onValueChange={(value) => {
                            field.onChange(value);
                            if (value === 'remote') {
                                form.setValue('location', '');
                                form.clearErrors('location');
                            }
                        }}
                        value={field.value}
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
                  <Input 
                    placeholder="e.g., React, Next.js, Plumbing" 
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (KES)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 50000" 
                    {...field}
                    value={field.value === null ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? null : Number(value));
                    }}
                  />
                </FormControl>
                <FormDescription>Optional. Estimated budget for the job.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Optional. Format: YYYY-MM-DD</FormDescription>
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
            <PostJobSubmitButton />
        </div>
      </form>
    </Form>
  );
}
