"use client";
import { FreelancerProfilePreviewCard } from "@/components/freelancer-profile-preview-card";

export default function JobApplicantsPage({ params }: { params: { id: string } }) {
    // This is a placeholder for fetching job applicants.
    // In a real application, you would fetch this data from your backend.
    const applicants = [
        {
            id: "1",
            fullName: "Alice Johnson",
            profilePictureUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            skills: ["UI/UX Design", "React", "Node.js"],
            serviceArea: "Nairobi",
            email: "alice@example.com",
            phone: "123-456-7890",
        },
        {
            id: "2",
            fullName: "Bob Williams",
            profilePictureUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
            skills: ["Graphic Design", "Illustration"],
            serviceArea: "Mombasa",
            email: "bob@example.com",
            phone: "234-567-8901",
        },
    ];

    const hiredApplicantId = "1"; // This would be determined by your application's logic

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Applicants</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applicants.map((applicant) => (
                    <FreelancerProfilePreviewCard
                        key={applicant.id}
                        freelancer={applicant}
                        isHired={applicant.id === hiredApplicantId}
                    />
                ))}
            </div>
        </div>
    );
}