"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import * as api from "@/lib/api";

interface JobCategory {
  id: string;
  name: string;
}

export function JobPostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]); // Explicitly type jobCategories
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  // State for AI generated content display
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getJobCategories();
        setJobCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch job categories", error);
        toast({
          title: "Error",
          description: "Could not load job categories.",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const handleGenerateWithAI = async () => {
    // Combine relevant fields into a prompt for AI
    const prompt = `Generate a job post. Job Type: ${jobType || 'Any'}. Experience Level: ${experienceLevel || 'Any'}. Required Skills: ${requiredSkills || 'None specified'}. Job Category: ${jobCategories.find(cat => cat.id === category)?.name || 'Any'}.`;

    setIsAiLoading(true);
    try {
      const response = await api.generateJobPostAI(prompt);
      // Assuming AI returns { title, description }
      setGeneratedTitle(response.data.title || "");
      setGeneratedDescription(response.data.description || "");

      // Optionally, pre-fill form fields with generated content
      setTitle(response.data.title || "");
      setDescription(response.data.description || "");

      toast({
        title: "AI Generated Content",
        description: "AI has generated content for your job post.",
      });
    } catch (error) {
      console.error("AI generation failed", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate content with AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.postJob({
        title,
        description,
        budget,
        job_type: jobType,
        category,
        required_skills: requiredSkills.split(',').map(s => s.trim()),
        experience_level: experienceLevel,
      });

      if (response.status === 201) {
        toast({
          title: "Job Posted!",
          description: "Your job has been successfully posted.",
        });
        // Reset form and generated content
        setTitle("");
        setDescription("");
        setBudget("");
        setJobType("");
        setCategory("");
        setRequiredSkills("");
        setExperienceLevel("");
        setGeneratedTitle("");
        setGeneratedDescription("");
      } else {
        toast({
          title: "Failed to Post Job",
          description: response.data?.detail || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "An unexpected error occurred while posting the job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Job Posting</CardTitle>
          <CardDescription>
            Fill in the details below. Use our AI assistant to generate a compelling title and description for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-type">Job Type</Label>
              <Select onValueChange={setJobType} value={jobType} required>
                <SelectTrigger id="job-type">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="required-skills">Required Skills</Label>
              <Input
                id="required-skills"
                placeholder="e.g., React, Django"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with a comma.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience-level">Experience Level</Label>
              <Select onValueChange={setExperienceLevel} value={experienceLevel} required>
                <SelectTrigger id="experience-level">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry-level">Entry-level</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid-level">Mid-level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Job Category</Label>
              <Select onValueChange={setCategory} value={category} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((cat: JobCategory) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            className="w-full mt-4"
            onClick={handleGenerateWithAI}
            disabled={isAiLoading}
          >
            {isAiLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>

          {(generatedTitle || generatedDescription) && (
            <div className="space-y-4 pt-4 border-t border-dashed mt-6">
              <h3 className="text-lg font-semibold">Generated Job Post</h3>
              <div className="grid gap-2">
                <Label htmlFor="generated-title">Job Title</Label>
                <Input
                  id="generated-title"
                  value={generatedTitle}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generated-description">Job Description</Label>
                <Textarea
                  id="generated-description"
                  value={generatedDescription}
                  readOnly
                  rows={8}
                  className="bg-muted/50 resize-none"
                />
              </div>
            </div>
          )}
           <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., 'Experienced React Developer'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <div>
              <Textarea
                id="description"
                placeholder="Describe the job requirements, responsibilities, and qualifications."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 1500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</>
            ) : (
              "Post Job"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
