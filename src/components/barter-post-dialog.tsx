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
  
  // State for AI generated content display (re-introduced)
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  
  const { toast } = useToast();

  const handleGenerateWithAI = async () => {
    // Use current form values as a prompt for AI
    const input = {
      skillsToOffer: skillsOffered || '',
      skillsToReceive: skillsWanted || '',
      currentTitle: title || '',
      currentDescription: description || '',
    };

    setIsAiLoading(true);
    try {
      const aiData = await api.generateBarterPostAI(input); 
      
      // Populate generated content for display
      setGeneratedTitle(aiData.title || "");
      setGeneratedDescription(aiData.description || "");

      toast({
        title: "AI Generated Content",
        description: "AI has generated content for your barter post. Review it below.",
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
        // Reset all fields including generated ones
        setTitle("");
        setDescription("");
        setSkillsOffered("");
        setSkillsWanted("");
        setGeneratedTitle("");
        setGeneratedDescription("");
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
            Fill in the details below. Our AI assistant can help you generate a compelling title, description, and skill lists.
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

          <p className="text-sm text-center text-muted-foreground mt-4">
            Fill in some details, then click "Generate with AI" to get suggestions for all fields.
          </p>
          <Button
            type="button"
            className="w-full"
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
              <h3 className="text-lg font-semibold">Generated Barter Post Suggestions</h3>
              <p className="text-sm text-muted-foreground mb-4">Review the AI-generated suggestions below. You can copy and paste them into the main form fields above, or modify them as needed.</p>

              <div className="grid gap-2">
                <Label htmlFor="generated-title">Suggested Title</Label>
                <Input
                  id="generated-title"
                  value={generatedTitle}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generated-description">Suggested Description</Label>
                <Textarea
                  id="generated-description"
                  value={generatedDescription}
                  readOnly
                  className="bg-muted/50 resize-y min-h-[150px]"
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
