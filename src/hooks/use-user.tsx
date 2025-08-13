
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/api'; // Corrected import

interface User {
  id: string; 
  email: string;
  fullName: string; 
  role: string;
  date_joined: string;
  last_login: string;
  avatar?: string; 
  username?: string; 
  referral_code?: string; 
  xp_points?: number; 
  level?: number; 
  bio?: string; 
  skills?: string[]; 
  service_areas?: string[] | string; 
  is_freelancer?: boolean;
  is_employer?: boolean;
  first_name: string;
  last_name: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return; 
    }

    try {
      const response = await getUserProfile(); 
      setUser({
          ...response.data,
          fullName: response.data.full_name, 
          avatar: response.data.avatar, 
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '', 
          is_freelancer: response.data.is_freelancer,
          is_employer: response.data.is_employer,
      });
    } catch (error: any) {
      console.error('Failed to fetch user', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
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
    setUser(null); 
    router.push('/login');
  };

  const mutateUser = (newData: Partial<User>, revalidate: boolean = true) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...newData };
    });
    if (revalidate) {
      fetchUser(); 
    }
  };

  return { user, loading, logout, mutateUser };
}
