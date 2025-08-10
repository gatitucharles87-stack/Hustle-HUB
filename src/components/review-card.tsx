// src/components/review-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
    reviewer_full_name: string;
    rating: number;
    comment: string | null;
    job_title: string;
    created_at: string;
    images?: string[]; // Optional array of image URLs
}

interface ReviewCardProps {
  review: Review;
}

// A simple star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.04 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      ))}
    </div>
  );
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>{review.reviewer_full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{review.reviewer_full_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review for: {review.job_title}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <StarRating rating={review.rating} />
        </div>
        <p className="text-muted-foreground">{review.comment}</p>
        
        {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
                {review.images.map((img, index) => (
                    <img key={index} src={img} alt={`review-image-${index}`} className="h-24 w-full object-cover rounded-md cursor-pointer"/>
                ))}
            </div>
        )}
        
        <p className="text-xs text-right text-muted-foreground mt-4">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
