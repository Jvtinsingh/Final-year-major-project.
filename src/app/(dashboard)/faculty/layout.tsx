'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { FacultyProvider } from '@/context/FacultyContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, userData } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/faculty' },
    { name: 'Courses', href: '/faculty/courses' },
    { name: 'Exams', href: '/faculty/exams' },
    { name: 'Materials', href: '/faculty/materials' },
    { name: 'Announcements', href: '/faculty/announcements' },
  ];

  return (
    <FacultyProvider>
      <div className="min-h-screen bg-[#F1F5F9] font-sans">
        {/* Horizontal Navigation Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-3 sticky top-0 z-50">
           <div className="max-w-[1400px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-12">
                 {/* Logo */}
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0B4CEB] flex items-center justify-center text-white">
                       <LayoutDashboard size={18} />
                    </div>
                    <span className="text-xl font-black text-[#1D1D35] tracking-tight">AcadeMetrics</span>
                 </div>

                 {/* Desktop Nav Items */}
                 <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                       const isActive = pathname === item.href;
                       return (
                          <Link 
                            key={item.name} 
                            href={item.href}
                            className={`text-sm font-bold transition-all ${isActive ? 'text-[#0B4CEB]' : 'text-slate-500 hover:text-slate-800'}`}
                          >
                             {item.name}
                          </Link>
                       );
                    })}
                 </nav>
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-4">
                 <span className="text-sm font-bold text-slate-500 hidden sm:block">
                    {userData?.displayName || 'Dr. John Smith'} (faculty)
                 </span>
                 <button 
                   onClick={logout}
                   className="bg-[#EF4444] text-white px-5 py-2 rounded-lg text-sm font-black hover:bg-rose-600 transition-colors shadow-sm"
                 >
                   Logout
                 </button>
              </div>
           </div>
        </header>

        {/* Root Dashboard Container */}
        <main className="max-w-[1400px] mx-auto p-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
              {children}
           </motion.div>
        </main>
      </div>
    </FacultyProvider>
  );
}
