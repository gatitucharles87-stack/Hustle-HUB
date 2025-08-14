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

interface MakeOfferDialogProps {
  postId: string;
  onOfferMade: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MakeOfferDialog({
  postId,
  onOfferMade,
  isOpen,
  onOpenChange,
}: MakeOfferDialogProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message) {
      toast({
        title: "Message is required",
        description: "Please write a message for your offer.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.applySkillBarter(postId, { message });
      if (response.status === 200) {
        toast({
          title: "Offer Sent!",
          description: "Your offer has been sent to the post author.",
        });
        onOfferMade();
        onOpenChange(false);
        setMessage("");
      } else {
        toast({
          title: "Failed to Send Offer",
          description: response.data?.detail || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error sending offer:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "An unexpected error occurred while sending your offer.",
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
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Propose a skill exchange. Describe what you can offer in return.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Your Offer Message</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'm a skilled web developer and I'd love to help you with your website in exchange for your graphic design services."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Send Offer</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
