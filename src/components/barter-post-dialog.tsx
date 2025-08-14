"use client";

import { useState, ReactNode, isValidElement, cloneElement } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import * as api from "@/lib/api";

interface BarterPostDialogProps {
  children?: ReactNode;
  onPostCreated: () => void;
}

export function BarterPostDialog({ children, onPostCreated }: BarterPostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // New state for AI generated content display
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [generatedSkillsOffered, setGeneratedSkillsOffered] = useState("");
  const [generatedSkillsWanted, setGeneratedSkillsWanted] = useState("");
  
  const { toast } = useToast();

  const handleGenerateWithAI = async () => {
    // Combine relevant fields into a prompt for AI
    const prompt = `Generate a skill barter post. Title suggestion: ${title || ''}. Description: ${description || ''}. Skills I can offer: ${skillsOffered || ''}. Skills I want in return: ${skillsWanted || ''}.`;

    setIsAiLoading(true);
    try {
      const response = await api.generateBarterPostAI(prompt);
      const aiData = response.data; // Assuming AI returns { title, description, skills_offered, skills_wanted }
      
      // Update editable form fields with AI generated content
      setTitle(aiData.title || title);
      setDescription(aiData.description || description);
      setSkillsOffered(aiData.skills_offered ? aiData.skills_offered.join(', ') : skillsOffered);
      setSkillsWanted(aiData.skills_wanted ? aiData.skills_wanted.join(', ') : skillsWanted);

      // Update generated content for display
      setGeneratedTitle(aiData.title || "");
      setGeneratedDescription(aiData.description || "");
      setGeneratedSkillsOffered(aiData.skills_offered ? aiData.skills_offered.join(', ') : "");
      setGeneratedSkillsWanted(aiData.skills_wanted ? aiData.skills_wanted.join(', ') : "");

      toast({
        title: "AI Generated Content",
        description: "AI has generated content for your barter post.",
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

  const handleSubmit = async () => {
    if (!title || !description || !skillsOffered || !skillsWanted) {
      toast({
        title: "All fields are required",
        description: "Please fill out all the fields to create a barter post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.postSkillBarterPost({
        title,
        description,
        skills_offered: skillsOffered.split(",").map((s) => s.trim()),
        skills_wanted: skillsWanted.split(",").map((s) => s.trim()),
      });
      if (response.status === 201) {
        toast({
          title: "Barter Post Created!",
          description: "Your post is now live for others to see.",
        });
        onPostCreated();
        setIsOpen(false);
        // Reset fields
        setTitle("");
        setDescription("");
        setSkillsOffered("");
        setSkillsWanted("");
        setGeneratedTitle(""); // Reset generated fields
        setGeneratedDescription("");
        setGeneratedSkillsOffered("");
        setGeneratedSkillsWanted("");
      } else {
        toast({
          title: "Failed to Create Post",
          description: response.data?.detail || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating barter post:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "An unexpected error occurred while creating your post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isValidElement(children) ? (
          cloneElement(children)
        ) : (
          <Button>Open Barter Post Dialog</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create a New Skill Barter Post</DialogTitle>
          <DialogDescription>
            Offer your skills and find the expertise you need in return. Use our AI assistant to help you craft your post.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="e.g., 'Logo Design for Spanish Tutoring'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading || isAiLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills-offered">Skills You Offer</Label>
              <Input
                id="skills-offered"
                placeholder="e.g., Graphic Design, Branding"
                value={skillsOffered}
                onChange={(e) => setSkillsOffered(e.target.value)}
                disabled={isLoading || isAiLoading}
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with a comma.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skills-wanted">Skills You Want</Label>
            <Input
              id="skills-wanted"
              placeholder="e.g., Spanish, Web Development"
              value={skillsWanted}
              onChange={(e) => setSkillsWanted(e.target.value)}
              disabled={isLoading || isAiLoading}
            />
            <p className="text-xs text-muted-foreground">
              Separate skills with a comma.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your offer and what you're looking for in detail."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              disabled={isLoading || isAiLoading}
            />
          </div>

          <Button
            type="button"
            className="w-full mt-4"
            onClick={handleGenerateWithAI}
            disabled={isAiLoading || !title} // Disable if no title for prompt
          >
            {isAiLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>

          {(generatedTitle || generatedDescription || generatedSkillsOffered || generatedSkillsWanted) && (
            <div className="space-y-4 pt-4 border-t border-dashed mt-6">
              <h3 className="text-lg font-semibold">Generated Barter Post</h3>
              <div className="grid gap-2">
                <Label htmlFor="generated-title">Generated Title</Label>
                <Input
                  id="generated-title"
                  value={generatedTitle}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generated-description">Generated Description</Label>
                <Textarea
                  id="generated-description"
                  value={generatedDescription}
                  readOnly
                  rows={6}
                  className="bg-muted/50 resize-none"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generated-skills-offered">Generated Skills You Offer</Label>
                <Input
                  id="generated-skills-offered"
                  value={generatedSkillsOffered}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generated-skills-wanted">Generated Skills You Want</Label>
                <Input
                  id="generated-skills-wanted"
                  value={generatedSkillsWanted}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading || isAiLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isAiLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Post...</>
            ) : (
              "Create Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
