
import { toast } from "@/hooks/use-toast";

// Helper for simulating async operations
const simulateApiResponse = (data: any, success = true, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ data });
      } else {
        reject({ response: { status: 500, data: { detail: "Simulated error" } } });
      }
    }, delay);
  });
};

// Placeholder Data
export const mockJobCategories = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "Graphic Design" },
  { id: 3, name: "Content Writing" },
  { id: 4, name: "Digital Marketing" },
  { id: 5, name: "Video Editing" },
];

export const mockJobs = [
  {
    id: "job-1",
    title: "Build a Responsive E-commerce Website",
    description: "Looking for a skilled web developer to create a responsive e-commerce platform with payment gateway integration and product management features.",
    skills: ["React", "Node.js", "MongoDB", "Stripe API"],
    location: "Nairobi",
    budget: "Ksh 150,000",
    tags: ["Full-stack", "E-commerce"],
    job_type: "Full-time",
    county: "Nairobi County",
    sub_county: "Westlands",
    ward: "Kileleshwa",
    employer_id: "emp-1",
    status: "Open",
    created_at: "2023-10-26T10:00:00Z"
  },
  {
    id: "job-2",
    title: "Logo Design for a Tech Startup",
    description: "We need a modern, minimalist logo for our new AI-focused tech startup. The logo should convey innovation and professionalism.",
    skills: ["Adobe Illustrator", "Figma", "Branding"],
    location: "Remote",
    budget: "Ksh 25,000",
    tags: ["Logo", "Branding"],
    job_type: "Part-time",
    county: "Any",
    sub_county: "Any",
    ward: "Any",
    employer_id: "emp-2",
    status: "Open",
    created_at: "2023-10-25T14:30:00Z"
  },
  {
    id: "job-3",
    title: "SEO-Optimized Blog Post Writing",
    description: "Seeking a content writer to produce engaging and SEO-friendly blog posts on digital marketing trends. Minimum 1000 words per post.",
    skills: ["Content Writing", "SEO", "Keyword Research"],
    location: "Anywhere",
    budget: "Ksh 5,000 per post",
    tags: ["Content", "SEO"],
    job_type: "Contract",
    county: "Any",
    sub_county: "Any",
    ward: "Any",
    employer_id: "emp-1",
    status: "Closed",
    created_at: "2023-10-24T09:00:00Z"
  },
  {
    id: "job-4",
    title: "Mobile App UI/UX Redesign",
    description: "Redesign the user interface and user experience of an existing Android and iOS application to improve user engagement and aesthetics.",
    skills: ["UI/UX Design", "Figma", "Prototyping"],
    location: "Nairobi",
    budget: "Ksh 80,000",
    tags: ["UI/UX", "Mobile"],
    job_type: "Full-time",
    county: "Nairobi County",
    sub_county: "Lang'ata",
    ward: "Karen",
    employer_id: "emp-3",
    status: "Open",
    created_at: "2023-10-23T11:00:00Z"
  },
  {
    id: "job-5",
    title: "Social Media Campaign Management",
    description: "Manage and execute a comprehensive social media campaign across Instagram, Facebook, and Twitter for a new product launch.",
    skills: ["Social Media Marketing", "Content Creation", "Analytics"],
    location: "Remote",
    budget: "Ksh 40,000",
    tags: ["Marketing", "Social Media"],
    job_type: "Part-time",
    county: "Any",
    sub_county: "Any",
    ward: "Any",
    employer_id: "emp-2",
    status: "Open",
    created_at: "2023-10-22T16:00:00Z"
  },
];

export const mockSkillBarterPosts = [
  {
    id: "barter-1",
    title: "Graphic Design for Web Development Services",
    description: "I need a professional logo and website design. In exchange, I can offer my expertise in backend web development (Node.js, Python).",
    skills_offered: ["Node.js", "Python", "API Development"],
    skills_needed: ["Graphic Design", "UI/UX Design"],
    location: "Nairobi",
    user_id: "user-1",
    status: "Open",
    created_at: "2023-10-20T10:00:00Z",
    offers: [
      { id: "offer-1-1", user_id: "user-2", message: "I can help with logo design using Adobe Illustrator. Check my portfolio.", status: "Pending", created_at: "2023-10-20T11:00:00Z" },
      { id: "offer-1-2", user_id: "user-3", message: "I'm a UI/UX designer, interested in exchanging services for backend help.", status: "Accepted", created_at: "2023-10-20T12:00:00Z" },
    ]
  },
  {
    id: "barter-2",
    title: "Content Writing for Video Editing",
    description: "I can write engaging blog posts and articles for your business. I'm looking for someone to edit a short promotional video.",
    skills_offered: ["Content Writing", "SEO Optimization"],
    skills_needed: ["Video Editing", "Motion Graphics"],
    location: "Remote",
    user_id: "user-2",
    status: "Open",
    created_at: "2023-10-19T14:00:00Z",
    offers: []
  },
  {
    id: "barter-3",
    title: "Photography for Social Media Management",
    description: "Offering professional product photography services in exchange for social media content planning and management.",
    skills_offered: ["Product Photography", "Photo Editing"],
    skills_needed: ["Social Media Marketing", "Community Management"],
    location: "Mombasa",
    user_id: "user-3",
    status: "Closed",
    created_at: "2023-10-18T09:00:00Z",
    offers: [
      { id: "offer-3-1", user_id: "user-1", message: "I can manage your social media. Let's talk!", status: "Accepted", created_at: "2023-10-18T10:00:00Z" },
    ]
  },
];

export const mockReviews = [
  {
    id: "review-1",
    reviewer_name: "Jane Doe",
    rating: 5,
    comment: "Outstanding work! Delivered the project ahead of schedule and exceeded expectations. Highly recommend!",
    date: "2023-10-20",
    image: "https://via.placeholder.com/50",
    profile_id: "freelancer-1"
  },
  {
    id: "review-2",
    reviewer_name: "John Smith",
    rating: 4,
    comment: "Good communication and quality work. There were a few minor revisions needed, but overall satisfied.",
    date: "2023-09-15",
    image: "https://via.placeholder.com/50",
    profile_id: "freelancer-1"
  },
  {
    id: "review-3",
    reviewer_name: "Alice Johnson",
    rating: 5,
    comment: "Exceptional design skills! Brought my vision to life perfectly. Will definitely hire again.",
    date: "2023-10-22",
    image: "https://via.placeholder.com/50",
    profile_id: "freelancer-2"
  },
];

export const mockNotifications = [
  { id: "notif-1", message: "Your job post 'Build E-commerce Site' is now live!", timestamp: "2023-10-26T10:05:00Z", read: false },
  { id: "notif-2", message: "New application for 'Logo Design' from Alice.", timestamp: "2023-10-26T11:20:00Z", read: false },
  { id: "notif-3", message: "Your offer for 'Content Writing' was accepted!", timestamp: "2023-10-25T15:00:00Z", read: true },
  { id: "notif-4", message: "Reminder: Review your recent freelancer, John.", timestamp: "2023-10-24T09:30:00Z", read: true },
];

export const mockFreelancers = [
  {
    id: "freelancer-1",
    first_name: "Emily",
    last_name: "Roberts",
    bio: "Experienced full-stack developer with a passion for building scalable web applications. Specializing in React, Node.js, and cloud deployments.",
    profile_picture: "https://via.placeholder.com/150",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    portfolio_items: [
      { id: "port-1", title: "E-commerce Platform", description: "Developed a full-stack e-commerce solution.", image: "https://via.placeholder.com/300x200" },
      { id: "port-2", title: "SaaS Dashboard", description: "Designed and implemented a data visualization dashboard.", image: "https://via.placeholder.com/300x200" },
    ],
    reviews: [mockReviews[0], mockReviews[1]],
    average_rating: 4.5,
    completed_jobs: 12,
    job_type: "Full-time",
    preferred_job_type: "Full-time",
    is_freelancer: true,
    is_employer: false,
    county: "Nairobi County",
    sub_county: "Westlands",
    ward: "Kileleshwa",
    current_projects: 3,
    badges: [{name: "Top Rated", icon: "⭐", description: "Awarded for consistent 5-star ratings"}],
    is_available: true,
    contact_email: "emily.r@example.com",
    phone_number: "+254712345678",
    linkedin_url: "https://linkedin.com/in/emilyroberts",
    website_url: "https://emilyroberts.dev",
  },
  {
    id: "freelancer-2",
    first_name: "Daniel",
    last_name: "Muiruri",
    bio: "Creative graphic designer specializing in branding, UI/UX, and print media. Bringing ideas to life with stunning visuals.",
    profile_picture: "https://via.placeholder.com/150",
    skills: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "UI/UX Design"],
    portfolio_items: [
      { id: "port-3", title: "Brand Identity Kit", description: "Created a complete brand identity for a new startup.", image: "https://via.placeholder.com/300x200" },
      { id: "port-4", title: "Mobile App UI", description: "Designed the user interface for a fitness application.", image: "https://via.placeholder.com/300x200" },
    ],
    reviews: [mockReviews[2]],
    average_rating: 5.0,
    completed_jobs: 8,
    job_type: "Part-time",
    preferred_job_type: "Part-time",
    is_freelancer: true,
    is_employer: false,
    county: "Nairobi County",
    sub_county: "Lang'ata",
    ward: "Karen",
    current_projects: 1,
    badges: [{name: "Rising Star", icon: "✨", description: "Recognized for rapid growth and positive feedback"}],
    is_available: true,
    contact_email: "daniel.m@example.com",
    phone_number: "+254723456789",
    linkedin_url: "https://linkedin.com/in/danielmuiruri",
    website_url: "https://danielm-design.com",
  },
];

export const mockOffers = [
  {
    id: "offer-1",
    skill_barter_post_id: "barter-1",
    applicant_id: "user-2", // User offering graphic design
    message: "I can provide the graphic design services you need for your web development expertise. My portfolio link: [link]",
    status: "Pending",
    created_at: "2023-10-21T09:00:00Z"
  },
  {
    id: "offer-2",
    skill_barter_post_id: "barter-1",
    applicant_id: "user-3", // User offering UI/UX design
    message: "I'm a UI/UX designer with 5+ years experience. Interested in exchanging services for backend help. Let's connect!",
    status: "Accepted",
    created_at: "2023-10-21T11:30:00Z"
  },
];

export const mockApplicants = [
  {
    id: "applicant-1",
    job_id: "job-1",
    freelancer_id: "freelancer-1",
    status: "Pending",
    applied_at: "2023-10-26T12:00:00Z",
    freelancer_details: mockFreelancers[0]
  },
  {
    id: "applicant-2",
    job_id: "job-1",
    freelancer_id: "freelancer-2",
    status: "Interviewing",
    applied_at: "2023-10-26T13:00:00Z",
    freelancer_details: mockFreelancers[1]
  }
];

export const mockDashboardStats = {
  freelancer: {
    total_completed_jobs: 25,
    total_earnings: "Ksh 500,000",
    active_projects: 3,
    pending_applications: 5,
    average_rating: 4.8,
    upcoming_milestones: [
      { id: "milestone-1", title: "E-commerce backend completion", date: "2023-11-10" },
      { id: "milestone-2", title: "Mobile app UI final review", date: "2023-11-15" },
    ],
    job_applications_chart_data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Applications",
        data: [10, 15, 8, 20, 12, 18],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      }]
    }
  },
  employer: {
    total_jobs_posted: 15,
    active_job_posts: 5,
    pending_hires: 2,
    total_spent: "Ksh 850,000",
    average_time_to_hire: "7 days",
    recent_hires: [
      { id: "hire-1", job_title: "Lead React Developer", freelancer_name: "Emily Roberts", date: "2023-10-10" },
      { id: "hire-2", job_title: "UI/UX Designer", freelancer_name: "Daniel Muiruri", date: "2023-09-25" },
    ],
    job_postings_chart_data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Job Postings",
        data: [5, 7, 3, 8, 6, 9],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      }]
    }
  }
};

export const mockUser = {
  id: "user-1",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  is_freelancer: true,
  is_employer: true,
  bio: "A versatile professional skilled in both web development and project management.",
  profile_picture: "https://via.placeholder.com/150/0000FF/FFFFFF?text=JD",
  skills: ["Project Management", "React", "Node.js"],
  preferred_job_type: "Any",
  county: "Nairobi County",
  sub_county: "Westlands",
  ward: "Kileleshwa",
};

export const mockCommissions = [
  {
    id: "comm-1",
    type: "job_completion",
    amount: "Ksh 1000",
    date: "2023-10-15",
    description: "Commission for completing 'E-commerce Website' job",
  },
  {
    id: "comm-2",
    type: "referral_bonus",
    amount: "Ksh 500",
    date: "2023-09-20",
    description: "Bonus for referring Jane Doe",
  },
];

export const mockLoyaltyPoints = {
  total_points: 1250,
  level: "Gold",
  next_level_points: 2000,
  rewards: [
    { id: "rew-1", name: "10% off service fee", points_cost: 500 },
    { id: "rew-2", name: "Profile boost for 1 week", points_cost: 800 },
  ],
};

export const mockBadges = [
  {
    id: "badge-1",
    name: "Master Coder",
    badge_type: "skill",
    icon: "💻",
    description: "Awarded for exceptional coding skills.",
  },
  {
    id: "badge-2",
    name: "Communication Pro",
    badge_type: "soft_skill",
    icon: "🗣️",
    description: "Recognized for excellent communication with clients.",
  },
  {
    id: "badge-3",
    name: "Job Seeker",
    badge_type: "level",
    icon: "🥉",
    description: "Awarded for being active on job seeking.",
  },
];

// Mock API Functions
export const getMockCommissionHistory = async () => {
  return simulateApiResponse(mockCommissions);
};

export const getMockRecommendedJobs = async () => {
  return simulateApiResponse(mockJobs.filter(job => job.status === "Open").slice(0, 3)); // Return a subset
};

export const getMockJobCategories = async () => {
  return simulateApiResponse(mockJobCategories);
};

export const getMockJobs = async () => {
  return simulateApiResponse(mockJobs);
};

export const getMockJobById = async (id: string) => {
  const job = mockJobs.find(j => j.id === id);
  if (job) {
    return simulateApiResponse(job);
  } else {
    return simulateApiResponse(null, false); // Simulate 404
  }
};

export const postMockJob = async (jobData: any) => {
  const newJob = { ...jobData, id: `job-${mockJobs.length + 1}`, status: "Open", created_at: new Date().toISOString() };
  mockJobs.push(newJob);
  toast({ title: "Success", description: "Job posted successfully!" });
  return simulateApiResponse(newJob);
};

export const applyMockJob = async (jobId: string, applicationData: any) => {
  // Simulate successful application
  toast({ title: "Success", description: "Application submitted successfully!" });
  return simulateApiResponse({ message: "Application received" });
};

export const getMockSkillBarterPosts = async () => {
  return simulateApiResponse(mockSkillBarterPosts);
};

export const getMockSkillBarterPostById = async (id: string) => {
  const post = mockSkillBarterPosts.find(p => p.id === id);
  if (post) {
    return simulateApiResponse(post);
  } else {
    return simulateApiResponse(null, false);
  }
};

export const postMockSkillBarterPost = async (postData: any) => {
  const newPost = { ...postData, id: `barter-${mockSkillBarterPosts.length + 1}`, status: "Open", created_at: new Date().toISOString(), offers: [] };
  mockSkillBarterPosts.push(newPost);
  toast({ title: "Success", description: "Skill barter post created successfully!" });
  return simulateApiResponse(newPost);
};

export const applyMockSkillBarter = async (postId: string, offerData: any) => {
  toast({ title: "Success", description: "Offer sent successfully!" });
  return simulateApiResponse({ message: "Offer submitted" });
};

export const getMockReviewsByProfileId = async (profileId: string) => {
  return simulateApiResponse(mockReviews.filter(review => review.profile_id === profileId));
};

export const postMockReview = async (reviewData: any) => {
  const newReview = { ...reviewData, id: `review-${mockReviews.length + 1}`, date: new Date().toISOString().split('T')[0] };
  mockReviews.push(newReview);
  toast({ title: "Success", description: "Review posted successfully!" });
  return simulateApiResponse(newReview);
};

export const getMockNotifications = async () => {
  return simulateApiResponse(mockNotifications);
};

export const markMockNotificationAsRead = async (id: string) => {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    toast({ title: "Success", description: "Notification marked as read." });
    return simulateApiResponse({ message: "Updated" });
  }
  return simulateApiResponse(null, false);
};

export const getMockFreelancers = async () => {
  return simulateApiResponse(mockFreelancers);
};

export const getMockFreelancerById = async (id: string) => {
  const freelancer = mockFreelancers.find(f => f.id === id);
  if (freelancer) {
    return simulateApiResponse(freelancer);
  } else {
    return simulateApiResponse(null, false);
  }
};

export const getMockUserProfile = async () => {
  // This will be a real API call for authenticated user's own profile, but mock for others
  return simulateApiResponse(mockUser);
};

export const updateMockUserProfile = async (profileData: any) => {
  // Simulate updating the mock user profile
  Object.assign(mockUser, profileData);
  toast({ title: "Success", description: "Profile updated successfully!" });
  return simulateApiResponse(mockUser);
};

export const getMockDashboardStats = async (userType: 'freelancer' | 'employer') => {
  return simulateApiResponse(mockDashboardStats[userType]);
};

export const getMockApplicantsForJob = async (jobId: string) => {
  return simulateApiResponse(mockApplicants.filter(app => app.job_id === jobId));
};

export const generateMockJobPostAI = async (prompt: string) => {
  // Simple AI logic: return a job description based on prompt
  const baseDescription = "This is an AI-generated job description. ";
  let generatedDescription = baseDescription;

  if (prompt.toLowerCase().includes("web developer")) {
    generatedDescription += "Seeking a talented web developer to build a modern, scalable web application.";
  } else if (prompt.toLowerCase().includes("logo design")) {
    generatedDescription += "Looking for a creative graphic designer to craft a unique and memorable logo for our brand.";
  } else {
    generatedDescription += "Based on your request, we are looking for a skilled professional to assist with a new project.";
  }

  return simulateApiResponse({ description: generatedDescription });
};

export const getMockLoyaltyPoints = async () => {
  return simulateApiResponse(mockLoyaltyPoints);
}

export const getMockBadges = async () => {
  return simulateApiResponse(mockBadges);
}

export const getMockMyPosts = async (userId: string) => {
  return simulateApiResponse(mockSkillBarterPosts.filter(post => post.user_id === userId));
}

export const getMockMyApplications = async (userId: string) => {
  // Simulate fetching applications made by a user
  const applications = mockOffers.filter(offer => offer.applicant_id === userId);
  return simulateApiResponse(applications);
}

export const getMockEmployerApplications = async (employerId: string) => {
  // Simulate fetching applications for jobs posted by an employer
  const employerJobs = mockJobs.filter(job => job.employer_id === employerId);
  const applications = mockApplicants.filter(app => employerJobs.some(job => job.id === app.job_id));
  return simulateApiResponse(applications);
}

export const acceptMockOffer = async (offerId: string) => {
  toast({ title: "Success", description: "Offer accepted successfully!" });
  return simulateApiResponse({ message: "Offer accepted" });
}

export const rejectMockOffer = async (offerId: string) => {
  toast({ title: "Success", description: "Offer rejected successfully!" });
  return simulateApiResponse({ message: "Offer rejected" });
}

export const updateMockJob = async (jobId: string, jobData: any) => {
  const jobIndex = mockJobs.findIndex(job => job.id === jobId);
  if (jobIndex > -1) {
    mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...jobData };
    toast({ title: "Success", description: "Job updated successfully!" });
    return simulateApiResponse(mockJobs[jobIndex]);
  }
  return simulateApiResponse(null, false);
}

export const updateMockSkillBarterPost = async (postId: string, postData: any) => {
  const postIndex = mockSkillBarterPosts.findIndex(post => post.id === postId);
  if (postIndex > -1) {
    mockSkillBarterPosts[postIndex] = { ...mockSkillBarterPosts[postIndex], ...postData };
    toast({ title: "Success", description: "Skill barter post updated successfully!" });
    return simulateApiResponse(mockSkillBarterPosts[postIndex]);
  }
  return simulateApiResponse(null, false);
}

export const deleteMockJob = async (jobId: string) => {
  const initialLength = mockJobs.length;
  const filteredJobs = mockJobs.filter(job => job.id !== jobId);
  mockJobs.splice(0, mockJobs.length, ...filteredJobs); // Update the original array
  if (mockJobs.length < initialLength) {
    toast({ title: "Success", description: "Job deleted successfully!" });
    return simulateApiResponse({ message: "Job deleted" });
  }
  return simulateApiResponse(null, false);
}

export const deleteMockSkillBarterPost = async (postId: string) => {
  const initialLength = mockSkillBarterPosts.length;
  const filteredPosts = mockSkillBarterPosts.filter(post => post.id !== postId);
  mockSkillBarterPosts.splice(0, mockSkillBarterPosts.length, ...filteredPosts); // Update the original array
  if (mockSkillBarterPosts.length < initialLength) {
    toast({ title: "Success", description: "Post deleted successfully!" });
    return simulateApiResponse({ message: "Post deleted" });
  }
  return simulateApiResponse(null, false);
}
