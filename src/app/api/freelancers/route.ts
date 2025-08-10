import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('search');
  const category = searchParams.get('category');
  const location = searchParams.get('location');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  let apiUrl = `${backendUrl}/api/freelancers/?role=freelancer`;

  if (keywords) {
    apiUrl += `&search=${keywords}`;
  }
  if (category && category !== 'All Categories') {
    // Assuming category can be mapped to skills or a specific field in the backend
    // You might need to adjust this based on how categories are handled for freelancers
    apiUrl += `&skills=${category}`;
  }
  if (location) {
    apiUrl += `&location=${location}`;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary authentication headers if your backend requires them
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from backend: ${response.status} - ${errorText}`);
      return NextResponse.json({ message: 'Failed to fetch freelancers', error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching freelancers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
