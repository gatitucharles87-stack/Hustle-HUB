
"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  date_joined: string;
  last_login: string;
  profilePictureUrl?: string; // Added optional profile picture URL
  username?: string; // Added optional username
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<User>('/auth/me'); // Changed to /auth/me as per API_ENDPOINTS.md
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userRole');
    router.push('/login');
  };

  return { user, loading, logout };
}
