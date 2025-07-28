
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  PenSquare,
  Settings,
  LogOut,
  Users,
  Repeat,
  Gift,
  Award,
  DollarSign,
  CalendarCheck,
  Info,
  Star,
  UserSearch,
} from 'lucide-react';
import { Logo } from '../logo';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const employerMenuItems = [
  { href: '/dashboard/employer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/hire', label: 'Hire Freelancers', icon: UserSearch },
  { href: '/dashboard/post-job', label: 'Post a Job', icon: PenSquare },
  { href: '/loyalty', label: 'Loyalty', icon: Star },
];

const freelancerMenuItems = [
  { href: '/dashboard/freelancer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { href: '/my-gigs', label: 'My Gigs', icon: CalendarCheck },
  { href: '/skill-barter', label: 'Skill Barter', icon: Repeat },
  { href: '/referrals', label: 'Referrals', icon: Gift },
  { href: '/badges', label: 'My Badges', icon: Award },
  { href: '/commissions', label: 'My Commissions', icon: DollarSign },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('freelancer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole');
      if (role === 'employer' || role === 'freelancer') {
        setUserRole(role);
      }
    }
  }, [pathname]);

  const menuItems = userRole === 'employer' ? employerMenuItems : freelancerMenuItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="px-4 py-2">
            <p className="font-semibold text-sm">{userRole === 'employer' ? 'Employer Menu' : 'Freelancer Menu'}</p>
        </div>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/profile')} tooltip={{ children: 'Profile', side: 'right' }}>
              <Link href="/profile">
                <Users />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip={{ children: 'Settings', side: 'right' }}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/about')} tooltip={{ children: 'About Us', side: 'right' }}>
              <Link href="/about">
                <Info />
                <span>About Us</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Logout', side: 'right' }}>
              <Link href="/">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
