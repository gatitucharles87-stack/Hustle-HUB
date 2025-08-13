import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockApi'; // Import mockUsers

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('search');
  const category = searchParams.get('category');
  const location = searchParams.get('location');

  // Filter mock data based on query parameters
  let filteredFreelancers = mockUsers.filter(user => user.user_type === 'freelancer');

  if (keywords) {
    const lowerCaseKeywords = keywords.toLowerCase();
    filteredFreelancers = filteredFreelancers.filter(
      (f) =>
        f.first_name.toLowerCase().includes(lowerCaseKeywords) ||
        f.last_name.toLowerCase().includes(lowerCaseKeywords) ||
        f.bio.toLowerCase().includes(lowerCaseKeywords) ||
        f.skills.some(skill => skill.toLowerCase().includes(lowerCaseKeywords))
    );
  }

  if (category && category !== 'All Categories') {
    const lowerCaseCategory = category.toLowerCase();
    filteredFreelancers = filteredFreelancers.filter((f) =>
      f.skills.some(skill => skill.toLowerCase().includes(lowerCaseCategory))
    );
  }

  if (location) {
    const lowerCaseLocation = location.toLowerCase();
    filteredFreelancers = filteredFreelancers.filter(
      (f) =>
        f.county.toLowerCase().includes(lowerCaseLocation) ||
        f.sub_county.toLowerCase().includes(lowerCaseLocation) ||
        f.ward.toLowerCase().includes(lowerCaseLocation)
    );
  }

  return NextResponse.json(filteredFreelancers);
}
