// src/components/review-section.tsx
"use client";

import { useEffect, useState } from 'react';
import { ReviewCard } from './review-card';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
import { Star } from 'lucide-react';

interface Review {
  id: string;
  reviewer_full_name: string;
  reviewee_full_name: string;
  rating: number;
  comment: string | null;
  job_title: string;
  created_at: string;
}

interface ReviewSectionProps {
  userId?: string; // userId is now optional
}

export function ReviewSection({ userId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      // Determine the API endpoint based on whether userId is provided
      const endpoint = userId ? `/api/reviews/for-user/${userId}` : '/api/reviews/';
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (userId) {
          // If fetching for a specific user, the response has a different structure
          setReviews(data.reviews);
          setAverageRating(data.average_rating);
          setReviewCount(data.review_count);
        } else {
          // For generic reviews, the response is a simple array
          setReviews(data.slice(0, 4)); // Show a limited number of reviews on the homepage
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReviews();
  }, [userId]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Reviews</h2>
          <p className="text-center">Loading reviews...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Reviews</h2>
          <p className="text-center text-red-500">Error loading reviews: {error}</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0 && !userId) {
    return null; // Don't show the section on homepage if no reviews
  }

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>

        {userId && reviewCount > 0 ? (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-lg">({reviewCount} reviews)</span>
            </div>
          </div>
        ) : userId && (
          <p className="text-center text-lg mb-8">No reviews yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
