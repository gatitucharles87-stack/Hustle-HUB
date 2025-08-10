'use client';

import { AboutUsContent } from "@/components/about-us-content";
import Head from 'next/head';

export default function AuthenticatedAboutPage() {
    return (
        <>
            <Head>
                <title>About HustleHub - Connect Talent & Opportunity</title>
                <meta name="description" content="HustleHub is a revolutionary platform connecting skilled freelancers with innovative employers. Learn about our mission, vision, and impact." />
                <meta property="og:title" content="About HustleHub" />
                <meta property="og:description" content="HustleHub is a revolutionary platform connecting skilled freelancers with innovative employers. Learn about our mission, vision, and impact." />
                <meta property="og:image" content="data:image/svg+xml;base64,PHN2ZyB2aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHrectCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMwMDdCRjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjUwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Ib2xkaW5nIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==" />
                {/* For authenticated pages, the URL might be dynamic, so we might omit og:url or set it dynamically if possible */}
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <AboutUsContent />
        </>
    )
}
