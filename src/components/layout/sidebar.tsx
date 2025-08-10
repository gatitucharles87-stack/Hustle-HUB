'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider
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
  Handshake,
  Book,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../logo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user'; // Import the useUser hook

const employerMenuItems = [
  { href: '/dashboard/employer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/hire', label: 'Hire Freelancers', icon: UserSearch },
  { href: '/dashboard/post-job', label: 'Post a Job', icon: PenSquare },
  { href: '/skill-barter/employer', label: 'Skill Barter', icon: Repeat },
  { href: '/skill-barter/employer/my-applications', label: 'My Barter Applications', icon: Handshake },
  { href: '/loyalty', label: 'Loyalty', icon: Star },
];

const freelancerMenuItems = [
  { href: '/dashboard/freelancer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/recommended-jobs', label: 'Recommended Jobs', icon: Sparkles },
  { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { href: '/my-gigs', label: 'My Gigs', icon: CalendarCheck },
  { href: '/portfolio-management', 'label': 'Manage Portfolio', 'icon': Book },
  { href: '/skill-barter', label: 'Skill Barter', icon: Repeat },
  { href: '/skill-barter/my-applications', 'label': 'My Barter Applications', 'icon': Handshake },
  { href: '/referrals', label: 'Referrals', icon: Gift },
  { href: '/badges', label: 'My Badges', icon: Award },
  { href: '/commissions', label: 'My Commissions', icon: DollarSign },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, loading: userLoading, logout } = useUser(); // Get user and logout from hook
  const [userRole, setUserRole] = useState('freelancer'); // Default to freelancer

  useEffect(() => {
    if (user && user.role) { // Use user.role from the fetched user data
      setUserRole(user.role); // Assuming role is 'employer' or 'freelancer'
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userRole', user.role);
      }
    }
  }, [user]);

  const menuItems = userRole === 'employer' ? employerMenuItems : freelancerMenuItems;

  if (userLoading) {
    return null; // Or a loading spinner for the sidebar
  }

  return (
    <Sidebar collapsible="icon"> {/* Set collapsible to "icon" here */}
      <SidebarHeader className="relative">
        <Logo />
        <div className="absolute right-2 top-2">
            <SidebarTrigger />
        </div>
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
                isActive={pathname === item.href}
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
                <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip={{ children: 'Settings', side: 'right' }}>
                    <Link href="/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/about'} tooltip={{ children: 'About Us', side: 'right' }}>
                    <Link href="/dashboard/about">
                        <Info />
                        <span>About Us</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip={{ children: 'Logout', side: 'right' }}> {/* Use onClick with logout function */}
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
