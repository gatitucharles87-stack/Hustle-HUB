
"use client";

import { PublicHeader } from "@/components/layout/public-header";
import Head from 'next/head';
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutUsData {
  title: string;
  content: string;
  image_url: string;
}

export default function PublicAboutPage() {
    const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await api.get("/about-us/");
                setAboutData(response.data);
            } catch (error) {
                console.error("Failed to fetch about us data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    return (
        <>
            <Head>
                <title>{aboutData?.title || 'About HustleHub - Connect Talent & Opportunity'}</title>
                <meta name="description" content={aboutData?.content.substring(0, 160) || "HustleHub is a revolutionary platform connecting skilled freelancers with innovative employers. Learn about our mission, vision, and impact."} />
                <meta property="og:title" content={aboutData?.title || 'About HustleHub'} />
                <meta property="og:description" content={aboutData?.content.substring(0, 160) || "HustleHub is a revolutionary platform connecting skilled freelancers with innovative employers. Learn about our mission, vision, and impact."} />
                <meta property="og:image" content={aboutData?.image_url || "data:image/svg+xml;base64,PHN2ZyB2aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHrectCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMwMDdCRjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjUwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Ib2xkaW5nIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg=="} />
                <meta property="og:url" content="https://www.yourhustlehub.com/about" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <PublicHeader />
            <div className="container mx-auto py-12">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : aboutData ? (
                    <div className="prose lg:prose-xl dark:prose-invert">
                        <h1>{aboutData.title}</h1>
                        <img src={aboutData.image_url} alt={aboutData.title} className="w-full h-auto rounded-lg" />
                        <p>{aboutData.content}</p>
                    </div>
                ) : (
                    <div>Failed to load content.</div>
                )}
            </div>
        </>
    )
}
