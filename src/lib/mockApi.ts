import { toast } from "@/hooks/use-toast";

// --- Mock Data Structures ---

export const mockUsers = [
  {
    id: "user1",
    email: "freelancer@example.com",
    username: "freelancerUser",
    user_type: "freelancer",
    bio: "Experienced freelance developer specializing in web applications, React, and Node.js.",
    preferred_job_type: "Full-time",
    profile_picture: "/placeholder-avatar.jpg",
    first_name: "John",
    last_name: "Doe",
    skills: ["React", "Node.js", "JavaScript", "Web Development"],
    county: "Nairobi",
    sub_county: "Westlands",
    ward: "Kitisuru",
  },
  {
    id: "user2",
    email: "employer@example.com",
    username: "employerUser",
    user_type: "employer",
    bio: "Hiring manager looking for talented individuals.",
    profile_picture: "/placeholder-avatar.jpg",
    first_name: "Jane",
    last_name: "Smith",
    skills: [],
    county: "Nairobi",
    sub_county: "Langata",
    ward: "Karen",
  },
  {
    id: "user3",
    email: "freelancer2@example.com",
    username: "designPro",
    user_type: "freelancer",
    bio: "Creative UI/UX designer with a passion for user-centric design and Figma.",
    preferred_job_type: "Freelance",
    profile_picture: "/placeholder-avatar.jpg",
    first_name: "Alice",
    last_name: "Johnson",
    skills: ["UI/UX Design", "Figma", "Graphic Design", "Prototyping"],
    county: "Mombasa",
    sub_county: "Changamwe",
    ward: "Port Reitz",
  },
];

const mockJobs: any[] = [
  {
    id: "job1",
    title: "Frontend Developer Needed",
    description: "Looking for a skilled React developer for a 3-month project.",
    budget: "2000-3000",
    job_type: "Part-time",
    location: "Remote",
    category: { id: "cat1", name: "Web Development" }, // Changed to object
    employer: { id: "user2", username: "employerUser", profile_picture: "/placeholder-avatar.jpg" },
    posted_date: "2023-10-26T10:00:00Z",
    applicants: [],
    tags: ["React", "JavaScript", "Web Development"], // Added tags
    matched_skills: ["React", "JavaScript"], // Added matched_skills
    deadline: "2023-11-30T23:59:59Z", // Added deadline
  },
  {
    id: "job2",
    title: "UI/UX Designer",
    description: "Seeking a creative UI/UX designer to revamp our mobile app.",
    budget: "1500-2500",
    job_type: "Freelance",
    location: "New York, NY",
    category: { id: "cat3", name: "Design" }, // Changed to object
    employer: { id: "user2", username: "employerUser", profile_picture: "/placeholder-avatar.jpg" },
    posted_date: "2023-10-25T14:30:00Z",
    applicants: [],
    tags: ["UI/UX Design", "Figma", "Prototyping"], // Added tags
    matched_skills: ["UI/UX Design", "Figma"], // Added matched_skills
    deadline: "2023-12-15T23:59:59Z", // Added deadline
  },
];

const mockSkillBarterPosts: any[] = [
  {
    id: "barter1",
    title: "Learn Python for Graphic Design Services",
    description: "I can teach you Python programming in exchange for graphic design work for my portfolio.",
    user: { id: "user1", username: "freelancerUser", full_name: "John Doe", profile_picture: "/placeholder-avatar.jpg" }, // Changed author to user, added full_name
    posted_date: "2023-10-20T09:00:00Z",
    status: "active",
    offers: [],
    deadline: "2023-11-25T23:59:59Z", // Added deadline
  },
  {
    id: "barter2",
    title: "Website Review for English Tutoring",
    description: "I need someone to review my personal website and provide feedback. In return, I can offer English tutoring sessions.",
    user: { id: "user2", username: "employerUser", full_name: "Jane Smith", profile_picture: "/placeholder-avatar.jpg" }, // Changed author to user, added full_name
    posted_date: "2023-10-18T16:00:00Z",
    status: "active",
    offers: [],
    deadline: "2023-12-01T23:59:59Z", // Added deadline
  },
];

const mockReviews: any[] = [
  {
    id: "review1",
    reviewer: { id: "user2", username: "employerUser", profile_picture: "/placeholder-avatar.jpg" },
    reviewee: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    rating: 5,
    comment: "Excellent work! Very professional and delivered on time.",
    date: "2023-09-15T10:00:00Z",
  },
  {
    id: "review2",
    reviewer: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    reviewee: { id: "user2", username: "employerUser", profile_picture: "/placeholder-avatar.jpg" },
    rating: 4,
    comment: "Good communication and clear requirements. Enjoyed working on the project.",
    date: "2023-09-20T14:00:00Z",
  },
];

const mockNotifications: any[] = [
  {
    id: "notif1",
    title: "New Job Application",
    message: "John Doe has applied to your 'Frontend Developer' job.",
    read: false,
    date: "2023-10-26T11:00:00Z",
  },
  {
    id: "notif2",
    title: "Offer Received",
    message: "You have received an offer for your 'Learn Python' skill barter post.",
    read: true,
    date: "2023-10-25T15:00:00Z",
  },
];

const mockBadges: any[] = [
  {
    id: "badge1",
    name: "Early Bird",
    description: "Joined HustleHub within the first month.",
    icon: "/icons/early-bird.png",
    badge_type: "achievement",
  },
  {
    id: "badge2",
    name: "Top Rated Freelancer",
    description: "Achieved an average rating of 4.8 or higher.",
    icon: "/icons/top-rated.png",
    badge_type: "rating",
  },
];

const mockLoyaltyPoints = {
  points: 1250,
  level: "Gold",
  nextLevel: "Platinum",
  progress: 75,
};

const mockCommissionHistory: any[] = [
  {
    id: "comm1",
    type: "Job Commission",
    amount: 100,
    date: "2023-09-01",
    status: "Completed",
  },
  {
    id: "comm2",
    type: "Skill Barter Fee",
    amount: 10,
    date: "2023-09-10",
    status: "Completed",
  },
];

const mockJobCategories: any[] = [
  { id: "cat1", name: "Web Development" },
  { id: "cat2", name: "Mobile Development" },
  { id: "cat3", name: "Design" },
  { id: "cat4", name: "Writing & Translation" },
  { id: "cat5", name: "Digital Marketing" },
];

const mockApplicants: any[] = [
  {
    id: "app1",
    jobId: "job1",
    freelancer: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    status: "pending",
    cover_letter: "I am highly skilled in React and eager to contribute.",
    applied_date: "2023-10-27T09:00:00Z",
  },
];

const mockMyPosts: any[] = [
  {
    id: "barter1",
    title: "Learn Python for Graphic Design Services",
    description: "I can teach you Python programming in exchange for graphic design work for my portfolio.",
    author: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    posted_date: "2023-10-20T09:00:00Z",
    status: "active",
    offers: [],
  },
];

const mockMyApplications: any[] = [
  {
    id: "myapp1",
    job: {
      id: "job1",
      title: "Frontend Developer Needed",
      category: { id: "cat1", name: "Web Development" },
      job_type: "Part-time",
      location: "Remote",
      tags: ["React", "JavaScript"],
      description: "Looking for a skilled React developer for a 3-month project.",
      deadline: "2023-11-30T23:59:59Z",
      employer: { id: "user2", name: "Jane Smith" }, // Added employer name
    },
    applicant: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    status: "Accepted", // Changed status for testing upcoming gigs
    applied_date: "2023-10-21T10:00:00Z",
  },
  {
    id: "myapp2",
    job: {
      id: "job2",
      title: "UI/UX Designer",
      category: { id: "cat3", name: "Design" },
      job_type: "Freelance",
      location: "New York, NY",
      tags: ["UI/UX Design", "Figma"],
      description: "Seeking a creative UI/UX designer to revamp our mobile app.",
      deadline: "2023-12-15T23:59:59Z",
      employer: { id: "user2", name: "Jane Smith" },
    },
    applicant: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    status: "Pending",
    applied_date: "2023-10-25T14:00:00Z",
  },
];

const mockEmployerApplications: any[] = [
  {
    id: "empapp1",
    jobId: "job1",
    jobTitle: "Frontend Developer Needed",
    applicant: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" },
    status: "pending",
    cover_letter: "I am highly skilled in React and eager to contribute.",
    applied_date: "2023-10-27T09:00:00Z",
  },
];
const mockCounties = [
    { id: '1', name: 'Nairobi' },
    { id: '2', name: 'Mombasa' },
];

const mockSubCounties = [
    { id: '1', name: 'Westlands', county_id: '1' },
    { id: '2', name: 'Langata', county_id: '1' },
    { id: '3', name: 'Changamwe', county_id: '2' },
];

const mockWards = [
    { id: '1', name: 'Kitisuru', sub_county_id: '1' },
    { id: '2', name: 'Karen', sub_county_id: '2' },
    { id: '3', name: 'Port Reitz', sub_county_id: '3' },
];

const mockNeighborhoods = [
  { id: '1', name: 'Parklands', ward_id: '1' },
  { id: '2', name: 'Lavington', ward_id: '1' },
  { id: '3', name: 'Woodley', ward_id: '2' },
  { id: '4', name: 'New Nyali', ward_id: '3' },
];

const mockReferrals: any[] = [
  {
    id: "ref1",
    referrer: "user1",
    referred_user: { id: "user3", full_name: "Alice Johnson", username: "designPro" },
    is_successful: true,
    created_at: "2023-08-01T10:00:00Z",
  },
  {
    id: "ref2",
    referrer: "user1",
    referred_user: { id: "user4", full_name: "Bob White", username: "bobW" },
    is_successful: false,
    created_at: "2023-08-15T11:00:00Z",
  },
];

// --- Mock API Functions ---

export const getMockCommissionHistory = async () => {
  return Promise.resolve({ data: mockCommissionHistory });
};

export const getMockRecommendedJobs = async () => {
  return Promise.resolve({ data: mockJobs });
};

export const getMockJobCategories = async () => {
  return Promise.resolve({ data: mockJobCategories });
};

export const getMockJobs = async (params?: any) => {
  let filteredJobs = [...mockJobs];

  if (params && params.params) {
    const { search, category, county, subCounty, area } = params.params;

    if (search) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some((tag: string) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    if (category) {
      filteredJobs = filteredJobs.filter((job) => job.category.id === category);
    }

    // Note: Mock API doesn't fully support location filtering based on hierarchical data
    // For now, we'll just filter by a broad "location" string if specific location fields are provided.
    if (county) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(county.toLowerCase()));
    }
    if (subCounty) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(subCounty.toLowerCase()));
    }
    if (area) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(area.toLowerCase()));
    }
  }
  return Promise.resolve({ data: filteredJobs });
};

export const getMockJobById = async (id: string) => {
  const job = mockJobs.find((j) => j.id === id);
  if (job) {
    return Promise.resolve({ data: job });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Job not found" } } });
};

export const postMockJob = async (jobData: any) => {
  const newJob = {
    id: `job${mockJobs.length + 1}`,
    ...jobData,
    employer: { id: "user2", username: "employerUser", profile_picture: "/placeholder-avatar.jpg" }, // Mock employer
    posted_date: new Date().toISOString(),
    applicants: [],
  };
  mockJobs.push(newJob);
  toast({
    title: "Job Posted",
    description: "Your job has been posted successfully and is now live.",
  });
  return Promise.resolve({ data: newJob, status: 201 });
};

export const applyMockJob = async (jobId: string, applicationData: any) => {
  const job = mockJobs.find((j) => j.id === jobId);
  if (job) {
    const newApplication = {
      id: `app${job.applicants.length + 1}`,
      jobId: jobId,
      freelancer: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" }, // Mock applicant
      status: "pending",
      ...applicationData,
      applied_date: new Date().toISOString(),
    };
    job.applicants.push(newApplication);
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted to the employer.",
    });
    return Promise.resolve({ data: newApplication, status: 200 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Job not found" } } });
};

export const getMockSkillBarterPosts = async () => {
  return Promise.resolve({ data: mockSkillBarterPosts });
};

export const getMockSkillBarterPostById = async (id: string) => {
  const post = mockSkillBarterPosts.find((p) => p.id === id);
  if (post) {
    return Promise.resolve({ data: post });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Skill barter post not found" } } });
};

export const postMockSkillBarterPost = async (postData: any) => {
  const newPost = {
    id: `barter${mockSkillBarterPosts.length + 1}`,
    ...postData,
    author: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" }, // Mock author
    posted_date: new Date().toISOString(),
    status: "active",
    offers: [],
  };
  mockSkillBarterPosts.push(newPost);
  toast({
    title: "Skill Barter Post Created",
    description: "Your skill barter post has been created successfully.",
  });
  return Promise.resolve({ data: newPost, status: 201 });
};

export const applyMockSkillBarter = async (postId: string, offerData: any) => {
  const post = mockSkillBarterPosts.find((p) => p.id === postId);
  if (post) {
    const newOffer = {
      id: `offer${post.offers.length + 1}`,
      postId: postId,
      applicant: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" }, // Mock applicant
      status: "pending",
      ...offerData,
      applied_date: new Date().toISOString(),
    };
    post.offers.push(newOffer);
    toast({
      title: "Proposal Sent",
      description: "Your skill barter proposal has been sent successfully.",
    });
    return Promise.resolve({ data: newOffer, status: 200 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Skill barter post not found" } } });
};

export const getMockReviewsByProfileId = async (profileId: string) => {
  const filteredReviews = mockReviews.filter((r) => r.reviewee.id === profileId);
  return Promise.resolve({ data: filteredReviews });
};

export const postMockReview = async (reviewData: any) => {
  const newReview = {
    id: `review${mockReviews.length + 1}`,
    ...reviewData,
    reviewer: { id: "user1", username: "freelancerUser", profile_picture: "/placeholder-avatar.jpg" }, // Mock reviewer
    date: new Date().toISOString(),
  };
  mockReviews.push(newReview);
  toast({
    title: "Review Submitted",
    description: "Your review has been submitted successfully.",
  });
  return Promise.resolve({ data: newReview, status: 201 });
};

export const getMockNotifications = async () => {
  return Promise.resolve({ data: mockNotifications });
};

export const markMockNotificationAsRead = async (id: string) => {
  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
    toast({
      title: "Notification Marked as Read",
      description: "This notification has been marked as read.",
    });
    return Promise.resolve({ data: notification, status: 200 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Notification not found" } } });
};

export const getMockFreelancers = async () => {
  const freelancers = mockUsers.filter(u => u.user_type === 'freelancer');
  return Promise.resolve({ data: freelancers });
};

export const getMockFreelancerById = async (id: string) => {
  const freelancer = mockUsers.find((u) => u.id === id && u.user_type === 'freelancer');
  if (freelancer) {
    return Promise.resolve({ data: freelancer });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Freelancer not found" } } });
};

export const generateMockJobPostAI = async (prompt: string) => {
  const mockDescription = `This is an AI-generated job description based on your prompt: "${prompt}". We are looking for a highly motivated individual to join our team and contribute to exciting projects. Key responsibilities include: [list responsibilities based on prompt]. Ideal candidate will have: [list qualifications based on prompt].`;
  toast({
    title: "AI Generated Content",
    description: "A mock job description has been generated.",
  });
  return Promise.resolve({ data: { description: mockDescription } });
};

export const getMockLoyaltyPoints = async () => {
  return Promise.resolve({ data: mockLoyaltyPoints });
};

export const getMockBadges = async () => {
  return Promise.resolve({ data: mockBadges });
};

export const getMockDashboardStats = async (userType: 'freelancer' | 'employer') => {
  if (userType === 'freelancer') {
    return Promise.resolve({
      data: {
        total_jobs_completed: 15,
        total_earnings: 7500,
        active_applications: 3,
        pending_reviews: 2,
      },
    });
  } else if (userType === 'employer') {
    return Promise.resolve({
      data: {
        total_jobs_posted: 8,
        active_job_listings: 2,
        total_applicants: 12,
        hires_made: 5,
      },
    });
  }
  return Promise.reject({ response: { status: 400, data: { detail: "Invalid user type" } } });
};

export const getMockApplicantsForJob = async (jobId: string) => {
  const applicants = mockApplicants.filter(app => app.jobId === jobId);
  return Promise.resolve({ data: applicants });
};

export const getMockMyPosts = async (userId: string) => {
  const userPosts = mockSkillBarterPosts.filter(post => post.author.id === userId);
  return Promise.resolve({ data: userPosts });
};

export const getMockMyApplications = async (userId: string) => {
  // In a real scenario, you'd filter applications by the actual userId
  // For mock purposes, we'll return all mock applications if a userId is provided (assuming they belong to 'user1')
  // or filter based on a specific mock user.
  if (userId) {
    return Promise.resolve({ data: mockMyApplications.filter(app => app.applicant.id === userId) });
  }
  return Promise.resolve({ data: [] }); // Or some default if no user is provided
};

export const getMockEmployerApplications = async (employerId: string) => {
  // In a real scenario, you'd filter applications by the actual employerId
  // For mock purposes, we'll return all mock employer applications (assuming they belong to 'user2')
  if (employerId) {
    return Promise.resolve({ data: mockEmployerApplications.filter(app => app.job.employer.id === employerId) });
  }
  return Promise.resolve({ data: [] });
};

export const acceptMockOffer = async (offerId: string) => {
  toast({
    title: "Offer Accepted",
    description: "The offer has been successfully accepted.",
  });
  return Promise.resolve({ status: 200, data: { message: "Offer accepted" } });
};

export const rejectMockOffer = async (offerId: string) => {
  toast({
    title: "Offer Rejected",
    description: "The offer has been successfully rejected.",
  });
  return Promise.resolve({ status: 200, data: { message: "Offer rejected" } });
};

export const updateMockJob = async (jobId: string, jobData: any) => {
  const jobIndex = mockJobs.findIndex(job => job.id === jobId);
  if (jobIndex > -1) {
    mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...jobData };
    toast({
      title: "Job Updated",
      description: "The job listing has been updated successfully.",
    });
    return Promise.resolve({ data: mockJobs[jobIndex], status: 200 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Job not found" } } });
};

export const updateMockSkillBarterPost = async (postId: string, postData: any) => {
  const postIndex = mockSkillBarterPosts.findIndex(post => post.id === postId);
  if (postIndex > -1) {
    mockSkillBarterPosts[postIndex] = { ...mockSkillBarterPosts[postIndex], ...postData };
    toast({
      title: "Skill Barter Post Updated",
      description: "The skill barter post has been updated successfully.",
    });
    return Promise.resolve({ data: mockSkillBarterPosts[postIndex], status: 200 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Skill barter post not found" } } });
};

export const deleteMockJob = async (jobId: string) => {
  const initialLength = mockJobs.length;
  mockJobs.splice(mockJobs.findIndex(job => job.id === jobId), 1);
  if (mockJobs.length < initialLength) {
    toast({
      title: "Job Deleted",
      description: "The job listing has been deleted successfully.",
    });
    return Promise.resolve({ status: 204 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Job not found" } } });
};

export const deleteMockSkillBarterPost = async (postId: string) => {
  const initialLength = mockSkillBarterPosts.length;
  mockSkillBarterPosts.splice(mockSkillBarterPosts.findIndex(post => post.id === postId), 1);
  if (mockSkillBarterPosts.length < initialLength) {
    toast({
      title: "Skill Barter Post Deleted",
      description: "The skill barter post has been deleted successfully.",
    });
    return Promise.resolve({ status: 204 });
  }
  return Promise.reject({ response: { status: 404, data: { detail: "Skill barter post not found" } } });
};
export const getMockCounties = async () => {
    return Promise.resolve({ data: mockCounties });
};

export const getMockSubCounties = async (countyId: string) => {
    const filteredSubCounties = mockSubCounties.filter(sc => sc.county_id === countyId);
    return Promise.resolve({ data: filteredSubCounties });
};

export const getMockWards = async (subCountyId: string) => {
    const filteredWards = mockWards.filter(w => w.sub_county_id === subCountyId);
    return Promise.resolve({ data: filteredWards });
};

export const getMockNeighborhoods = async (wardId: string) => {
    const filteredNeighborhoods = mockNeighborhoods.filter(n => n.ward_id === wardId);
    return Promise.resolve({ data: filteredNeighborhoods });
};

export const getMockReferrals = async () => {
    return Promise.resolve({ data: mockReferrals });
};