'use client';

import React from 'react';
import { useStudent } from '@/context/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, QrCode, Search, GraduationCap, Award, BookOpen, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StudentCoursesPage() {
  const { enrolledSubjects, joinCourse } = useStudent();
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-extrabold text-[#1D1D35]">My Enrolled Courses 🎓</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your active studies and join new modules.</p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsJoinModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          Join New Course
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledSubjects.map((subject, i) => (
          <motion.div 
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-start mb-6 shrink-0 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <BookOpen size={28} />
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-3 py-1.5 rounded-full">
                Enrolled
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-black text-[#1D1D35] mb-1 group-hover:text-emerald-600 transition-colors">{subject.name}</h3>
              <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">{subject.code}</p>

              <div className="flex items-center gap-6 mb-8">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Credits</span>
                    <span className="text-lg font-black text-[#1D1D35]">{subject.credits}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-100"></div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                    <span className="text-sm font-bold text-emerald-600">Active</span>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                    <Book size={16} /> Course Info
                 </button>
              </div>
            </div>
          </motion.div>
        ))}

        {enrolledSubjects.length === 0 && (
          <div className="col-span-full py-24 text-center bg-slate-200/20 rounded-[3rem] border-2 border-dashed border-slate-200">
            <GraduationCap size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-black text-slate-500">No courses joined yet</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">Click the button above and enter an enrollment code shared by your faculty to get started.</p>
          </div>
        )}
      </div>

      {/* Join Course Modal (Duplicated for availability on this page) */}
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
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} />
                </div>
                <h2 className="text-2xl font-black text-[#1D1D35]">Enroll in a Module</h2>
                <p className="text-slate-500 font-medium mt-1">Join the academic journey with your course code.</p>
              </div>

              <form onSubmit={handleJoinCourse} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Enrollment Code
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. CS101-2024"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-black placeholder:text-slate-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all uppercase"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    disabled={isJoining || !courseCode.trim()}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isJoining ? <Loader2 className="animate-spin" /> : "Verify & Enroll"}
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
