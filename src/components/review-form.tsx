"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as api from "@/lib/api"; 

interface ReviewFormProps {
  jobId: string;
  revieweeId: string;
  revieweeType: 'freelancer' | 'employer'; 
  onReviewSubmitted: () => void;
}

export function ReviewForm({
  jobId,
  revieweeId,
  revieweeType,
  onReviewSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Error", description: "Please select a rating.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("job", jobId);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);
    
    formData.append("reviewee_id", revieweeId);
    formData.append("reviewee_type", revieweeType);

    images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      const response = await api.postReview(formData);

      if (response.status === 201) {
        toast({
          title: "Review Submitted!",
          description: "Thank you for your feedback.",
        });
        setRating(0);
        setComment("");
        setImages([]);
        onReviewSubmitted();
      } else {
        const errorData = response.data;
        toast({
          title: "Submission Failed",
          description: errorData.detail || "There was an error submitting your review.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer h-8 w-8 ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
          <Label htmlFor="image-upload">Add Photos (Optional)</Label>
          <div className="border-dashed border-2 border-gray-300 p-4 rounded-md text-center cursor-pointer hover:border-primary transition-colors">
              <label htmlFor="image-upload" className="cursor-pointer block">
                  <Upload className="mx-auto h-8 w-8 text-gray-400"/>
                  <p className="text-sm text-muted-foreground mt-2">Drag & drop or click to upload</p>
                  <Input id="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={isLoading}/>
              </label>
          </div>
          {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((file, index) => (
                      <div key={index} className="relative">
                          <img src={URL.createObjectURL(file)} alt="review image" className="h-24 w-full object-cover rounded-md"/>
                          <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)} disabled={isLoading}>
                              <X className="h-4 w-4"/>
                          </Button>
                      </div>
                  ))}
              </div>
          )}
      </div>
      <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
        ) : (
          "Submit Review"
        )}
      </Button>
    </div>
  );
}
