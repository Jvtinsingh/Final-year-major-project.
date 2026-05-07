'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileCheck2, 
  BookOpen, 
  Megaphone, 
  TrendingUp,
  LogOut,
  Bell
} from 'lucide-react';
import { StudentProvider } from '@/context/StudentContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, userData } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'Courses', href: '/student/courses', icon: BookOpen },
    { name: 'Exams', href: '/student/exams', icon: FileCheck2 },
    { name: 'Materials', href: '/student/materials', icon: BookOpen },
    { name: 'Announcements', href: '/student/announcements', icon: Megaphone },
    { name: 'Progress', href: '/student/progress', icon: TrendingUp },
  ];

  return (
    <StudentProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 p-3 sm:p-4 gap-4 relative overflow-hidden">
        
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-teal-400/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Floating Sidebar */}
        <motion.aside 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-64 bg-white/80 backdrop-blur-xl border border-white filter drop-shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl flex flex-col justify-between hidden md:flex shrink-0 relative z-20"
        >
          <div>
            <div className="p-6 flex items-center gap-3 mb-2 text-[#1D1D35]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 text-white flex items-center justify-center font-bold text-lg">
                A
              </div>
              <div>
                 <h2 className="font-extrabold tracking-tight text-lg leading-tight">AcadeMetrics</h2>
                 <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Student Hub</p>
              </div>
            </div>

            <nav className="px-4 flex flex-col gap-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
                // Ensure exactly matching /student for dashboard
                const isExactDashboard = item.href === '/student' && pathname === '/student';
                const showActive = isExactDashboard || (item.href !== '/student' && isActive);

                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm overflow-hidden ${
                      showActive 
                        ? 'text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {showActive && (
                       <motion.div 
                          layoutId="student-sidebar-pill"
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                       />
                    )}
                    <item.icon size={18} className={`relative z-10 transition-transform duration-300 ${showActive ? 'text-white' : 'text-slate-400 group-hover:scale-110 group-hover:text-emerald-500'}`} />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 space-y-4">
             <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-default">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-100 to-white flex items-center justify-center text-emerald-700 font-bold shrink-0 border border-emerald-50">
                  {userData?.displayName?.charAt(0) || 'S'}
                </div>
                <div className="overflow-hidden">
                   <p className="text-sm font-bold text-slate-800 truncate">{userData?.displayName || 'Student User'}</p>
                   <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">Candidate</p>
                </div>
             </div>
             <button 
                onClick={logout}
                className="group flex items-center justify-center w-full gap-2 px-4 py-3 rounded-2xl text-rose-500 font-bold hover:bg-rose-50 transition-colors text-sm border border-transparent hover:border-rose-100"
              >
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-32px)] bg-white/60 backdrop-blur-3xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden relative z-10">
            
            {/* Elegant Topbar */}
            <header className="h-20 border-b border-slate-100/50 bg-white/40 flex items-center justify-between px-8 sm:px-10 shrink-0 sticky top-0 z-50 backdrop-blur-md">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                  <div>
                     <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h1>
                     <p className="text-lg font-extrabold text-[#1D1D35]">Student Hub</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all relative">
                     <Bell size={18} />
                     <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="md:hidden">
                    <button onClick={logout} className="p-2 text-rose-500 bg-rose-50 rounded-xl"><LogOut size={18}/></button>
                  </div>
               </div>
            </header>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-6 lg:p-8 scroll-smooth code-scroll">
               {children}
            </div>
        </main>
      </div>
    </StudentProvider>
  );
}
