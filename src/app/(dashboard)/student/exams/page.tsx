'use client';

import React, { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { motion } from 'framer-motion';
import { FileCheck2, Hash, PlayCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ExamsPage() {
  const { exams, joinExam } = useStudent();
  const [examCode, setExamCode] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examCode.trim()) {
      toast.error('Please enter a valid exam code');
      return;
    }
    
    try {
      joinExam(examCode.toUpperCase());
      toast.success('Successfully enrolled in the exam via code!');
      setExamCode('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to join exam');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Join Code Section */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
               <FileCheck2 size={28} />
             </div>
             My Exams
           </h1>
           <p className="text-slate-500 font-medium mt-2 leading-relaxed">Access your enrolled assessments or join a new one using a code provided by your faculty.</p>
         </motion.div>

         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-[400px] shrink-0">
            <form onSubmit={handleJoin} className="bg-white p-2 border border-slate-200 rounded-2xl flex shadow-[0_4px_20px_rgb(0,0,0,0.03)] focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
               <div className="flex items-center pl-3 text-emerald-500">
                  <Hash size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Enter Exam Code (e.g., MATH101-X)" 
                 className="flex-1 px-3 py-3 bg-transparent outline-none font-bold text-black placeholder:text-slate-600 placeholder:font-medium"
                 value={examCode}
                 onChange={(e) => setExamCode(e.target.value)}
                 required
               />
               <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 font-bold rounded-xl transition">
                  Join
               </button>
            </form>
         </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#1D1D35] border-b border-slate-100 pb-2">Active & Upcoming</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.filter(e => e.status !== 'completed').map((exam, idx) => (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
               key={exam.id} 
               className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start mb-4">
                   <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md ${exam.status === 'in_progress' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {exam.status.replace('_', ' ')}
                   </span>
                   <span className="text-xs font-bold text-slate-400">{exam.subject}</span>
                </div>
                
                <h4 className="text-lg font-bold text-[#1D1D35] mb-4 leading-tight">{exam.title}</h4>
                
                <div className="space-y-2 mb-6">
                   <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Clock size={16} className="text-emerald-500" />
                      {new Date(exam.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <FileCheck2 size={16} className="text-emerald-500" />
                      {exam.durationMinutes} Minutes • {exam.type}
                   </div>
                </div>

                {exam.status !== 'completed' ? (
                   <Link href={`/student/exams/${exam.id}`} className="flex justify-center items-center gap-2 w-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors">
                      <PlayCircle size={18} />
                      Start Assessment
                   </Link>
                ) : null}
             </motion.div>
          ))}
          {exams.filter(e => e.status !== 'completed').length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-400 font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                You have no active or upcoming exams.
             </div>
          )}
        </div>
      </div>

      {/* Completed Exams */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-[#1D1D35] border-b border-slate-100 pb-2 bg-transparent text-slate-400">Past Exams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
          {exams.filter(e => e.status === 'completed').map((exam, idx) => (
             <div key={exam.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-[#1D1D35]">{exam.title}</h4>
                   <p className="text-xs text-slate-500 mt-1 font-medium">{new Date(exam.startTime).toLocaleDateString()} • {exam.subject}</p>
                </div>
                <div className="text-right">
                   <span className="text-sm font-bold text-slate-400 block mb-1">Score</span>
                   {exam.resultsPublished ? (
                      <span className="text-xl font-black text-emerald-600">{exam.score}/{exam.totalMarks}</span>
                   ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">Results Pending</span>
                   )}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
