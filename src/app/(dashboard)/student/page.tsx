'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStudent } from '@/context/StudentContext';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  PlayCircle,
  FileCheck2,
  Bell,
  Calendar,
  Download,
  Plus,
  Loader2,
  X
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

export default function StudentDashboard() {
  const { userData } = useAuth();
  const { stats, announcements, exams, performance, joinCourse } = useStudent();
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  const [courseCode, setCourseCode] = React.useState('');
  const [isJoining, setIsJoining] = React.useState(false);

  const handleJoinCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim()) return;
    setIsJoining(true);
    try {
      await joinCourse(courseCode.trim().toUpperCase());
      toast.success("Successfully joined the course!");
      setCourseCode('');
      setIsJoinModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to join course.");
    } finally {
      setIsJoining(false);
    }
  };

  const exportProgress = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(performance);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Performance");
      XLSX.writeFile(wb, `${userData?.displayName || 'Student'}_Progress_Report.xlsx`);
      toast.success("Progress report exported successfully!");
    } catch (e) {
      toast.error("Failed to export progress.");
    }
  };

  const statCards = [
    { title: 'Enrolled Exams', value: stats.enrolledExams, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Average Score', value: `${stats.averageScore}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Highest Score', value: `${stats.highestScore}%`, icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'In Progress', value: stats.inProgressExams, icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  const quickActions = [
    { title: 'Join a Course', action: () => setIsJoinModalOpen(true), icon: Plus, color: 'text-indigo-600', bg: 'bg-indigo-50 hover:bg-indigo-100' },
    { title: 'Take Active Exam', href: '/student/exams/demo-question-1', icon: PlayCircle, color: 'text-rose-600', bg: 'bg-rose-50 hover:bg-rose-100' },
    { title: 'Study Materials', href: '/student/materials', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50 hover:bg-teal-100' },
    { title: 'View Progress', href: '/student/progress', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-extrabold text-[#1D1D35]">Welcome, {userData?.displayName || 'Student'}! 👋</h1>
          <p className="text-slate-500 font-medium mt-1">Here's your academic summary for today.</p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={exportProgress}
          className="bg-white border border-slate-200 text-[#1D1D35] px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition shadow-sm"
        >
          <Download size={18} className="text-emerald-500" />
          Export Curated Report
        </motion.button>
      </div>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400">{stat.title}</p>
              <h3 className="text-2xl lg:text-3xl font-black text-[#1D1D35] mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickActions.map((action, i) => (
          action.href ? (
            <Link key={i} href={action.href} className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-[#1D1D35] border border-transparent hover:border-slate-200 ${action.bg}`}>
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <action.icon size={20} className={action.color} />
              </div>
              <span className="text-sm md:text-base">{action.title}</span>
            </Link>
          ) : (
            <button key={i} onClick={action.action} className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-[#1D1D35] border border-transparent hover:border-slate-200 ${action.bg}`}>
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <action.icon size={20} className={action.color} />
              </div>
              <span className="text-sm md:text-base">{action.title}</span>
            </button>
          )
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Subject Performance & Calendar */}
        <div className="lg:col-span-2 space-y-8">
           {/* Subject Performance */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1D1D35] mb-6">
                 <TrendingUp className="text-purple-500" size={24} />
                 Subject Performance
              </h2>
              <div className="space-y-4">
                 {performance.map((perf, idx) => (
                   <div key={idx} className="space-y-2">
                     <div className="flex justify-between items-end">
                       <span className="font-bold text-[#1D1D35]">{perf.subject}</span>
                       <div className="text-right">
                         <span className="text-lg font-black text-emerald-500">{perf.score}%</span>
                         <span className="text-xs font-bold text-slate-400 ml-2">Class Avg: {perf.classAverage}%</span>
                       </div>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                       <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${perf.score}%` }}></div>
                     </div>
                   </div>
                 ))}
              </div>
           </motion.div>

           {/* Calendar Sync (Mock) */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1D1D35] mb-6">
                 <Calendar className="text-indigo-500" size={24} />
                 Upcoming Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {exams.filter(e => e.status === 'upcoming').map(exam => (
                    <div key={exam.id} className="flex gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                       <div className="bg-white text-indigo-600 font-bold rounded-xl p-3 flex flex-col items-center justify-center shrink-0 w-16 h-16 shadow-sm">
                          <span className="text-xs uppercase">{new Date(exam.startTime).toLocaleString('en-US', { month: 'short' })}</span>
                          <span className="text-xl">{new Date(exam.startTime).getDate()}</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-[#1D1D35] leading-tight mb-1">{exam.title}</h4>
                          <span className="text-xs font-bold text-slate-500 uppercase">{exam.subject} • {exam.durationMinutes}m</span>
                       </div>
                    </div>
                 ))}
                 {exams.filter(e => e.status === 'upcoming').length === 0 && (
                   <p className="text-sm font-medium text-slate-500">No upcoming exams in your calendar.</p>
                 )}
              </div>
           </motion.div>
        </div>

        {/* Right Column: High Priority Announcements */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-4 h-full">
          <div className="bg-gradient-to-b from-rose-50 to-white p-6 md:p-8 rounded-3xl border border-rose-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#1D1D35] mb-6">
              <Bell className="text-rose-500" size={24} />
              Important Alerts
            </h2>
            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className={`p-5 rounded-2xl border-l-4 ${ann.priority === 'high' ? 'bg-rose-100/50 border-rose-500' : 'bg-slate-50 border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#1D1D35] text-sm">{ann.title}</h4>
                    {ann.priority === 'high' && <span className="bg-rose-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm animate-pulse">Urgent</span>}
                  </div>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">{ann.content}</p>
                  <p className="text-[10px] font-bold text-slate-400 capitalize">From: {ann.senderName || 'Faculty'}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
      {/* Join Course Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100"
            >
              <button 
                onClick={() => setIsJoinModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-[#1D1D35] transition"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} />
                </div>
                <h2 className="text-2xl font-black text-[#1D1D35]">Join a Course</h2>
                <p className="text-slate-500 font-medium mt-1">Enter the enrollment code from your faculty.</p>
              </div>

              <form onSubmit={handleJoinCourse} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Enrollment Code
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. CS101-FALL"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-black placeholder:text-slate-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all uppercase"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    disabled={isJoining || !courseCode.trim()}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isJoining ? <Loader2 className="animate-spin" /> : "Verify & Enroll"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="w-full text-slate-500 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm"
                  >
                    Maybe later
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
