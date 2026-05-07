'use client';

import React, { useState } from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Target, 
  Search, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function FacultyAnalyticsPage() {
  const { exams, submissions } = useFaculty();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Derived Data
  const completedSubmissions = submissions.filter(s => s.status === 'completed');
  
  const classStats = {
    totalSubmissions: completedSubmissions.length,
    avgScore: completedSubmissions.length > 0 
      ? (completedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedSubmissions.length).toFixed(1)
      : 0,
    highestScore: completedSubmissions.length > 0
      ? Math.max(...completedSubmissions.map(s => s.score || 0))
      : 0,
    passRate: completedSubmissions.length > 0
      ? ((completedSubmissions.filter(s => (s.score / s.totalMarks) >= 0.4).length / completedSubmissions.length) * 100).toFixed(0)
      : 0
  };

  const filteredSubmissions = completedSubmissions.filter(s => {
    const matchesSearch = s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = !selectedExamId || s.examId === selectedExamId;
    return matchesSearch && matchesExam;
  });

  const examPerformance = exams.map(exam => {
    const examSubs = completedSubmissions.filter(s => s.examId === exam.id);
    return {
      ...exam,
      count: examSubs.length,
      avg: examSubs.length > 0 
        ? (examSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / examSubs.length).toFixed(1)
        : 0
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 w-full max-w-7xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-center">
        <div>
          <Link href="/faculty" className="text-sm font-bold text-slate-400 hover:text-[#0B4CEB] flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-[#1D1D35] tracking-tight">Academic Analytics</h1>
          <p className="text-slate-500 font-medium">Insights into student performance and assessment efficacy.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
           <button 
             onClick={() => setSelectedExamId(null)}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!selectedExamId ? 'bg-[#1D1D35] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Global View
           </button>
           <select 
             value={selectedExamId || ''} 
             onChange={(e) => setSelectedExamId(e.target.value || null)}
             className="px-4 py-2 rounded-xl text-xs font-bold bg-transparent text-black outline-none cursor-pointer"
           >
             <option value="">All Exams</option>
             {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
           </select>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Submissions', value: classStats.totalSubmissions, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Average Score', value: `${classStats.avgScore}%`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Highest Mark', value: classStats.highestScore, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pass Rate', value: `${classStats.passRate}%`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
              <h3 className="text-xl font-black text-[#1D1D35]">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Exam List */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-black text-[#1D1D35] px-2">Performance by Exam</h2>
          <div className="space-y-3">
            {examPerformance.map((exam, i) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`w-full p-4 rounded-2xl border transition-all text-left group ${selectedExamId === exam.id ? 'bg-[#1D1D35] border-[#1D1D35] shadow-lg' : 'bg-white border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${selectedExamId === exam.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {exam.examCode || 'EXM'}
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${selectedExamId === exam.id ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <CheckCircle2 size={12} />
                    {exam.count} Subs
                  </div>
                </div>
                <h4 className={`font-bold text-sm mb-1 ${selectedExamId === exam.id ? 'text-white' : 'text-[#1D1D35]'}`}>{exam.title}</h4>
                <div className="flex items-center justify-between mt-3">
                   <div className="flex items-center gap-2">
                      <div className={`w-8 h-1 rounded-full ${selectedExamId === exam.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <div className="h-full bg-[#0B4CEB] rounded-full" style={{ width: `${exam.avg}%` }} />
                      </div>
                      <span className={`text-[10px] font-black ${selectedExamId === exam.id ? 'text-white' : 'text-slate-400'}`}>{exam.avg}%</span>
                   </div>
                   <ChevronRight size={14} className={selectedExamId === exam.id ? 'text-white' : 'text-slate-300 group-hover:translate-x-1 transition-transform'} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="text-lg font-black text-[#1D1D35]">Detailed Submissions</h2>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search student..." 
                   className="bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-black placeholder:text-slate-600 outline-none transition-all w-48"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th className="p-6">Student</th>
                    <th className="p-6">Assessment</th>
                    <th className="p-6">Score</th>
                    <th className="p-6">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredSubmissions.map((sub, i) => (
                      <motion.tr 
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1D1D35] group-hover:text-[#0B4CEB] transition-colors">{sub.studentName}</span>
                            <span className="text-[10px] font-medium text-slate-400">{sub.studentEmail}</span>
                          </div>
                        </td>
                        <td className="p-6">
                           <span className="text-xs font-bold text-slate-600">{sub.title}</span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                             <span className={`text-sm font-black ${(sub.score / sub.totalMarks) >= 0.7 ? 'text-emerald-600' : (sub.score / sub.totalMarks) >= 0.4 ? 'text-amber-600' : 'text-rose-600'}`}>
                               {sub.score}/{sub.totalMarks}
                             </span>
                             <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                <div 
                                  className={`h-full rounded-full ${(sub.score / sub.totalMarks) >= 0.7 ? 'bg-emerald-500' : (sub.score / sub.totalMarks) >= 0.4 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${(sub.score / sub.totalMarks) * 100}%` }}
                                />
                             </div>
                           </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Clock size={12} />
                             <span className="text-[10px] font-bold">
                               {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Dec 12, 2023'}
                             </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-400 font-bold italic">No matching submissions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
