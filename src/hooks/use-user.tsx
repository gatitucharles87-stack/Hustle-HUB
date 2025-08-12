
"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string; // Changed to string to match UUID
  email: string;
  fullName: string; 
  role: string;
  date_joined: string;
  last_login: string;
  avatar?: string; // Changed from profilePictureUrl to avatar
  username?: string; 
  referral_code?: string; 
  xp_points?: number; 
  level?: number; 
  bio?: string; // Added bio
  skills?: string[]; // Added skills
  service_areas?: string[] | string; // Added service_areas
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<any>('/auth/me'); 
      setUser({
          ...response.data,
          fullName: response.data.full_name, 
          avatar: response.data.avatar, // Ensure this maps correctly
      });
    } catch (error) {
      console.error('Failed to fetch user', error);
      // Optionally redirect to login if auth token is invalid
      // if (error.response && error.response.status === 401) {
      //   logout();
      // }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userRole');
    setUser(null); // Clear user state on logout
    router.push('/login');
  };

  // Function to manually update user data in state (e.g., after a successful API call)
  const mutateUser = (newData: Partial<User>, revalidate: boolean = true) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...newData };
    });
    if (revalidate) {
      fetchUser(); // Re-fetch from API to ensure consistency
    }
  };

  return { user, loading, logout, mutateUser };
}
