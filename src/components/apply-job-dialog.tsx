"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api"; // Import the centralized API client

interface ApplyJobDialogProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyJobDialog({ jobId, isOpen, onClose }: ApplyJobDialogProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/job-applications/", {
        job: jobId,
        cover_letter: coverLetter,
      });

      if (response.status === 201) { // Assuming 201 Created for successful application
        toast({
          title: "Application Submitted!",
          description: "Your application has been successfully sent.",
        });
        setCoverLetter("");
        onClose();
      } else {
        // This block might be redundant if Axios handles non-2xx as errors
        const errorData = response.data;
        toast({
          title: "Application Failed",
          description: errorData.detail || "There was an error submitting your application.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error applying for job:", error);
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
          <DialogDescription>
            Submit your cover letter for this job listing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="cover-letter">Cover Letter</Label>
            <Textarea
              id="cover-letter"
              placeholder="Tell the employer why you're the best fit for this job..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}