"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppHeader from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from "@/components/ui/skeleton";

const FREELANCER_DASHBOARD = '/dashboard/freelancer';
const EMPLOYER_DASHBOARD = '/dashboard/employer';

// Define paths that are specific to a role
const EMPLOYER_SPECIFIC_PATHS = [
  EMPLOYER_DASHBOARD,
  '/dashboard/employer/applicants',
  '/hire',
  '/dashboard/post-job',
  '/skill-barter/employer', // Employer's main skill barter
  '/skill-barter/employer/my-applications', // Employer's barter applications
];

const FREELANCER_SPECIFIC_PATHS = [
  FREELANCER_DASHBOARD,
  '/jobs',
  '/my-gigs',
  '/portfolio-management',
  '/recommended-jobs',
  '/skill-barter', // Freelancer's main skill barter
  '/skill-barter/my-applications', // Freelancer's barter applications
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initial state is loading

  useEffect(() => {
    console.log("AppLayout useEffect: Running for pathname:", pathname);
    const storedUserRole = sessionStorage.getItem('userRole'); 
    console.log("AppLayout useEffect: storedUserRole:", storedUserRole);
    
    if (!storedUserRole) {
      console.log("AppLayout useEffect: User not authenticated, redirecting to /login");
      // Use setTimeout to allow current render cycle to complete before navigating
      setTimeout(() => {
        router.replace('/login'); 
      }, 0);
      return; 
    }

    // If authenticated, proceed to set state and check role-based redirection
    setIsAuthenticated(true);
    setUserRole(storedUserRole);
    setLoading(false); // Authentication check completed, set loading to false
    console.log("AppLayout useEffect: Authenticated, setting loading to false. userRole:", storedUserRole);

    // Enforce role-based redirection
    if (storedUserRole === 'freelancer') {
      if (EMPLOYER_SPECIFIC_PATHS.some(path => pathname.startsWith(path))) {
        console.log("AppLayout useEffect: Freelancer on employer path, redirecting to freelancer dashboard");
        setTimeout(() => {
          router.replace(FREELANCER_DASHBOARD);
        }, 0);
        return; 
      }
    } else if (storedUserRole === 'employer') {
      const isFreelancerPath = FREELANCER_SPECIFIC_PATHS.some(path => pathname.startsWith(path));
      const isEmployerSkillBarterPath = pathname.startsWith('/skill-barter/employer');

      if (isFreelancerPath && !isEmployerSkillBarterPath) {
        console.log("AppLayout useEffect: Employer on freelancer path, redirecting to employer dashboard");
        setTimeout(() => {
          router.replace(EMPLOYER_DASHBOARD);
        }, 0);
        return; 
      }
    }
    console.log("AppLayout useEffect: No redirect needed, displaying content.");
  }, [router, pathname]); // Depend on router and pathname for re-evaluation

  // If not authenticated (and redirect is happening), or still loading, show appropriate UI
  if (loading || !isAuthenticated) {
    console.log("AppLayout Render: Showing loading/skeleton. loading:", loading, "isAuthenticated:", isAuthenticated);
    if (!isAuthenticated && !loading) { 
        console.log("AppLayout Render: Not authenticated and not loading, returning null for fast redirect.");
        return null; 
    }
    // Otherwise, show skeleton for initial load *while* authenticated
    return (
        <SidebarProvider>
            <div className="flex flex-col min-h-screen">
                <AppHeader /> 
                <div className="flex flex-1">
                    <AppSidebar />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <Skeleton className="h-[50px] w-full mb-4" />
                        <Skeleton className="h-[200px] w-full" />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
  }

  // If authenticated and not loading, render the main app content
  console.log("AppLayout Render: Showing main authenticated content.");
  return (
    <SidebarProvider> 
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
