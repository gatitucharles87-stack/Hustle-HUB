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

export function JobPostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [jobCategories, setJobCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

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
    if (!title) {
      toast({
        title: "Title is required for AI generation",
        variant: "destructive",
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const response = await api.generateJobPostAI(title);
      setDescription(response.data.description);
    } catch (error) {
      console.error("AI generation failed", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate description.",
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
      });

      if (response.status === 201) {
        toast({
          title: "Job Posted!",
          description: "Your job has been successfully posted.",
        });
        // Reset form
        setTitle("");
        setDescription("");
        setBudget("");
        setJobType("");
        setCategory("");
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
          <CardTitle>Post a New Job</CardTitle>
          <CardDescription>
            Fill in the details below to find the perfect freelancer for your
            project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Describe the job requirements, responsibilities, and qualifications."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2"
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
            <div className="grid gap-2">
              <Label htmlFor="job-type">Job Type</Label>
              <Select onValueChange={setJobType} value={jobType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Job Category</Label>
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((cat: { id: string; name: string }) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
