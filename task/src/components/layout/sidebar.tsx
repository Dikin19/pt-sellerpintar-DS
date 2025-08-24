'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Tag, 
  LogOut, 
  User,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navigation = [
    {
      name: 'Articles',
      href: '/dashboard',
      icon: FileText,
      current: pathname === '/dashboard',
    },
    ...(user?.role === 'Admin' ? [
      {
        name: 'Categories',
        href: '/dashboard/categories',
        icon: Tag,
        current: pathname.startsWith('/dashboard/categories'),
      },
    ] : []),
  ];

  return (
    <div className={cn('flex flex-col h-full bg-blue-600 text-white', className)}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-blue-500">
        <Home className="h-8 w-8 mr-3" />
        <span className="text-xl font-bold">Logoipsum</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                item.current
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="px-4 py-4 border-t border-blue-500">
        <div className="flex items-center mb-4">
          <User className="h-8 w-8 mr-3 p-1 bg-blue-500 rounded-full" />
          <div>
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-blue-200">{user?.role}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}