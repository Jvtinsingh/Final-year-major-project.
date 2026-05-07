'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFaculty } from '@/context/FacultyContext';
import { motion } from 'framer-motion';
import { 
  FileEdit, 
  BookOpen, 
  Megaphone, 
  BarChart3, 
  Clock, 
  AlertCircle,
  Plus,
  Users,
  Trophy,
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import ExamCalendar from '@/components/dashboard/ExamCalendar';

export default function FacultyDashboard() {
  const { userData } = useAuth();
  const { stats, exams, submissions, announcements } = useFaculty();

  const statCards = [
    { 
      title: 'Total Exams', 
      value: stats.totalExams, 
      subValue: `${stats.publishedCount} Published - ${stats.draftCount} Draft`,
      color: 'text-purple-600', 
      bg: 'bg-purple-100', 
      icon: FileEdit 
    },
    { 
      title: 'Subjects Teaching', 
      value: stats.totalSubjects, 
      subValue: 'Manage',
      actionable: true,
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100', 
      icon: BookOpen 
    },
    { 
      title: 'Total Submissions', 
      value: stats.totalSubmissions, 
      subValue: 'All Graded ✓',
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      icon: BarChart3 
    },
    { 
      title: 'Study Materials', 
      value: stats.totalMaterials, 
      subValue: `${stats.announcementCount} Announcements`,
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100', 
      icon: BookOpen 
    },
  ];

  const quickActions = [
    { title: 'Create Exam', href: '/faculty/exams', icon: FileEdit, bgColor: 'bg-[#0B4CEB] text-white' },
    { title: 'Upload Material', href: '/faculty/materials', icon: BookOpen, bgColor: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
    { title: 'Post Announcement', href: '/faculty/announcements', icon: Megaphone, bgColor: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
    { title: 'View Analytics', href: '/faculty/analytics', icon: BarChart3, bgColor: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
      >
        <h1 className="text-3xl font-black text-[#1D1D35] tracking-tight">
          Welcome back, {userData?.displayName || 'Professor'}! 👋
        </h1>
        <p className="text-slate-500 font-medium mt-1">Here's what's happening with your courses today.</p>
      </motion.div>

      {/* Primary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col items-center text-center gap-2 group hover:shadow-md transition-all cursor-default"
          >
            <h4 className="text-3xl font-black text-[#1D1D35]">{stat.value}</h4>
            <p className="text-sm font-bold text-slate-400">{stat.title}</p>
            {stat.actionable ? (
              <button className="mt-2 px-6 py-1.5 bg-slate-100 text-slate-600 text-xs font-black rounded-lg hover:bg-slate-200 transition-colors">
                {stat.subValue}
              </button>
            ) : (
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-1">{stat.subValue}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-[#1D1D35] px-2 flex items-center gap-2">
          <Activity size={16} className="text-blue-600" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className={`flex items-center justify-center gap-3 p-5 rounded-2xl transition-all font-black text-sm shadow-sm hover:shadow-md hover:translate-y-[-2px] ${action.bgColor}`}>
              <action.icon size={18} />
              {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Overview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams List */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-black text-[#1D1D35]">Recent Exams</h3>
            <Link href="/faculty/exams" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 px-4 py-1.5 rounded-xl">View All</Link>
          </div>
          <div className="space-y-4">
            {exams.slice(0, 3).map(exam => (
              <div key={exam.id} className="p-5 bg-slate-50/50 rounded-2xl flex justify-between items-center group hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#1D1D35]">{exam.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">MCQ • {exam.questionsCount} Questions • 100 Marks</p>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${exam.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                     {exam.status}
                   </span>
                   <span className="text-[10px] font-bold text-slate-400 italic">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions List */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-[#1D1D35] px-2">Recent Submissions</h3>
          <div className="space-y-4">
            {submissions.filter(s => s.status === 'completed').slice(0, 3).map(sub => (
              <div key={sub.id} className="p-5 bg-slate-50/50 rounded-2xl flex justify-between items-center group hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
                      {sub.studentName?.charAt(0)}
                   </div>
                   <div className="space-y-1">
                     <h4 className="font-extrabold text-[#1D1D35]">{sub.studentName}</h4>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{sub.title}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-emerald-600">{sub.score}/{sub.totalMarks}</p>
                   <p className="text-[9px] font-bold text-slate-400">Invalid Date</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Banner */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4"
      >
        <div className="bg-emerald-500 text-white p-2 rounded-xl">
           <CheckCircle2 size={20} />
        </div>
        <div>
           <h4 className="font-black text-emerald-800 tracking-tight">All Systems Go!</h4>
           <p className="text-sm font-medium text-emerald-600 opacity-80">Everything is running smoothly. Keep up the great work!</p>
        </div>
        <span className="ml-auto text-[10px] font-bold text-emerald-400">Today</span>
      </motion.div>

      {/* Student Engagement Overview */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
          <TrendingUp className="text-blue-600" size={24} />
          <h2 className="text-xl font-black text-[#1D1D35]">Student Engagement Overview</h2>
        </div>
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Participation Rate', value: '100.0%', sub: '2 of 2 students', color: 'bg-blue-50 text-blue-600' },
              { label: 'Average Score', value: `${stats.averageScore.toFixed(1)}%`, sub: 'Excellent', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Submission Rate', value: '100.0%', sub: 'High engagement', color: 'bg-purple-50 text-purple-600' },
              { label: 'Avg. Completion', value: 'NaN min', sub: 'Time per exam', color: 'bg-amber-50 text-amber-600' },
            ].map((m, i) => (
              <div key={i} className={`p-6 rounded-2xl ${m.color.split(' ')[0]} space-y-1`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
                <h3 className={`text-2xl font-black ${m.color.split(' ')[1]}`}>{m.value}</h3>
                <p className="text-[10px] font-bold opacity-60">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-black text-[#1D1D35] flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" /> Top Performers
              </h4>
              <div className="space-y-2">
                {stats.topPerformers.map((p, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-dotted border-slate-200">
                     <div className="flex items-center gap-3">
                       <span className="text-lg">🥇</span>
                       <span className="text-xs font-extrabold text-slate-700">{p.studentName}</span>
                     </div>
                     <span className="text-xs font-black text-emerald-600 tracking-tighter">{(p.score/p.totalMarks * 100).toFixed(1)}%</span>
                   </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black text-[#1D1D35] flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-500" /> Needs Attention
              </h4>
              <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 text-center flex flex-col items-center justify-center min-h-[140px]">
                 <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                 <p className="text-xs font-black text-amber-800">All students performing well!</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-50">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span>Overall Class Progress</span>
                <span>100%</span>
             </div>
             <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-emerald-500 rounded-full" />
             </div>
          </div>
        </div>
      </div>

      {/* Reports & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-lg font-black text-[#1D1D35]">Score Distribution</h3>
           <div className="h-[200px] flex items-end justify-around gap-4 pb-12 pt-4 relative border-b border-slate-100">
              {[
                { label: '0-25%', height: '10%' },
                { label: '26-50%', height: '15%' },
                { label: '51-75%', height: '30%' },
                { label: '76-100%', height: '80%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <motion.div 
                     initial={{ height: 0 }} animate={{ height: bar.height }}
                     className="w-full max-w-[60px] bg-[#0B4CEB] rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity" 
                   />
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 absolute -bottom-8">{bar.label}</span>
                </div>
              ))}
              <div className="absolute top-0 right-0 flex items-center gap-2">
                 <div className="w-2 h-2 bg-[#0B4CEB] rounded-full" />
                 <span className="text-[10px] font-bold text-slate-400">Students</span>
              </div>
           </div>
        </div>

        {/* Exam Completion Status (Pie Chart Simulation) */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-lg font-black text-[#1D1D35]">Exam Completion Status</h3>
           <div className="h-[200px] flex items-center justify-center gap-12 pt-4">
              <div className="relative w-40 h-40">
                 <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="100 100" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs font-black text-emerald-600">Completed: 100%</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-black text-[#1D1D35]">Completed</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-slate-200 rounded-full" />
                    <span className="text-xs font-black text-slate-400">In Progress</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Performance Trends (Full Width) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-lg font-black text-[#1D1D35]">Performance Trends [Recent Exams]</h3>
        <div className="h-[240px] relative mt-4">
           {/* Simple Gridlines */}
           {[0, 1, 2, 3, 4].map(l => (
             <div key={l} className="absolute w-full h-px bg-slate-50" style={{ top: `${l * 25}%` }} />
           ))}
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center group cursor-pointer relative pt-20">
                 <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }}
                   className="w-4 h-4 bg-blue-600 border-4 border-white rounded-full shadow-lg mx-auto z-10 relative" 
                 />
                 <p className="text-[10px] font-black text-slate-400 uppercase mt-4">test exam</p>
                 
                 {/* Tooltip Simulation */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1D1D35] text-white px-4 py-2 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
                   Avg: 100% • 1 Submissions
                 </div>
              </div>
           </div>
           
           <div className="absolute -bottom-10 right-0 flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-4 h-1 bg-blue-600 rounded-full" />
                 <span className="text-[10px] font-bold text-slate-400">Average Score</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-4 h-1 bg-slate-300 rounded-full" />
                 <span className="text-[10px] font-bold text-slate-400">Submissions</span>
              </div>
           </div>
        </div>
      </div>

      {/* Exam Calendar (Bottom) */}
      <div className="pt-8">
        <div className="p-2 border-t border-slate-100 border-dotted mb-8" />
        <ExamCalendar />
      </div>
    </div>
  );
}

