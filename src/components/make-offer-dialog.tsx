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

interface MakeOfferDialogProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onOfferSubmitted: () => void; // Add this prop
}

export function MakeOfferDialog({ postId, isOpen, onClose, onOfferSubmitted }: MakeOfferDialogProps) {
  const [offerMessage, setOfferMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/skill-barter-offers/", {
        skill_barter_post: postId,
        message: offerMessage,
      });

      if (response.status === 201) {
        toast({
          title: "Offer Submitted!",
          description: "Your offer has been successfully sent.",
        });
        setOfferMessage("");
        onOfferSubmitted(); // Call the callback on success
        onClose();
      } else {
        const errorData = response.data;
        toast({
          title: "Offer Failed",
          description: errorData.detail || "There was an error submitting your offer.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error making offer:", error);
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
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Enter your offer message for this skill barter post.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="offer-message">Offer Message</Label>
            <Textarea
              id="offer-message"
              placeholder="Describe your offer or why you're interested..."
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
