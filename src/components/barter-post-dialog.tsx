
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBarterPostAction, type BarterPostFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Wand2, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api'; // Import the centralized API client

const formSchema = z.object({
  skillsToOffer: z.string().min(1, 'Please list the skills you can offer.'),
  skillsToReceive: z.string().min(1, 'Please list the skills you want in return.'),
  title: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function AIGenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="secondary" size="sm">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
}

interface BarterPostDialogProps {
    children: React.ReactNode;
    onPostCreated?: () => void; // Optional callback for when a post is successfully created
}

export function BarterPostDialog({ children, onPostCreated }: BarterPostDialogProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const initialState: BarterPostFormState = { message: '', data: null };
    const [state, formAction] = useActionState(generateBarterPostAction, initialState);
    const [isPosting, setIsPosting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            skillsToOffer: '',
            skillsToReceive: '',
            title: '',
            description: '',
        },
    });

    useEffect(() => {
        if (state.message) {
            if(state.errors) {
                toast({
                title: 'Error',
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
                description: 'Barter post details have been generated.',
            });
        }
    }, [state, form, toast]);

    const handleDialogSubmit = async () => {
        const isValid = await form.trigger(); // Manually trigger validation for all fields
        if (!isValid) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsPosting(true);
        try {
            const formData = form.getValues();
            const payload = {
                skillsOffered: formData.skillsToOffer, // Corrected key
                skillsWanted: formData.skillsToReceive, // Corrected key
                title: formData.title || 'No Title',
                description: formData.description || 'No Description',
            };

            const response = await api.post('/skill-barter-posts/', payload);

            if (response.status === 201) {
                toast({
                    title: 'Barter Post Created!',
                    description: 'Your skill barter offer has been successfully posted.',
                });
                setOpen(false);
                form.reset();
                onPostCreated?.(); // Call the callback to refresh the list
            } else {
                const errorData = response.data; // Axios error response data
                toast({
                    title: 'Failed to Post Offer',
                    description: errorData.detail || 'An error occurred while posting your offer.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.error("Error posting barter offer:", error);
            const errorMessage = error.response?.data?.detail || "An unexpected error occurred. Please try again.";
            toast({
                title: 'Failed to Post Offer',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>Create a New Barter Offer</DialogTitle>
                <DialogDescription>
                    Describe what you can offer and what you need. Use AI to generate a title and description.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form action={formAction} className="space-y-4">
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
                            <AIGenerateButton />
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
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" onClick={handleDialogSubmit} disabled={isPosting} size="lg">
                        {isPosting ? 'Posting...' : <><Send className="mr-2 h-4 w-4" /> Post Barter Offer</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
