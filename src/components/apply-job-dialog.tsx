"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import * as api from "@/lib/api";

interface ApplyJobDialogProps {
  jobId: string;
  onApplicationSubmit: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApplyJobDialog({
  jobId,
  onApplicationSubmit,
  isOpen,
  onOpenChange,
}: ApplyJobDialogProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!coverLetter) {
      toast({
        title: "Cover letter is required",
        description: "Please write a cover letter for your application.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.applyJob(jobId, {
        cover_letter: coverLetter,
      });
      if (response.status === 200) {
        toast({
          title: "Application Sent!",
          description: "Your application has been sent to the employer.",
        });
        onApplicationSubmit();
        onOpenChange(false);
        setCoverLetter("");
      } else {
        toast({
          title: "Failed to Send Application",
          description: response.data?.detail || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error sending application:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "An unexpected error occurred while sending your application.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
          <DialogDescription>
            Submit your application with a compelling cover letter.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cover-letter">Cover Letter</Label>
              <Textarea
                id="cover-letter"
                placeholder="Briefly explain why you're a good fit for this role."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit Application</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
