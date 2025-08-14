"use client";
import { AboutUsContent } from "@/components/about-us-content";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as api from "@/lib/api";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  reviewer: {
    username: string;
    profile_picture_url: string;
  };
  rating: number;
  comment: string;
}

export default function AboutPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.getReviewsByProfileId("all"); // Assuming 'all' fetches all reviews
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <AboutUsContent />
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <img
                        src={review.reviewer.profile_picture_url}
                        alt={review.reviewer.username}
                        className="w-24 h-24 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold">{review.reviewer.username}</h3>
                      <div className="flex items-center mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-center text-gray-600 mt-4">
                        "{review.comment}"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
