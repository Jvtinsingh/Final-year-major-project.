'use client';

import React from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { motion } from 'framer-motion';
import { Book, Users, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function FacultyCoursesPage() {
  const { subjects } = useFaculty();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-extrabold text-[#1D1D35]">My Courses 📚</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your active courses and enrollment codes.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, i) => (
          <motion.div 
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Book size={24} />
              </div>
              <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Active
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#1D1D35] mb-1 group-hover:text-indigo-600 transition-colors">{subject.name}</h3>
            <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">{subject.code}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Credits</p>
                <p className="text-lg font-black text-[#1D1D35]">{subject.credits}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Enrolled</p>
                <p className="text-lg font-black text-[#1D1D35]">--</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 mb-2">Enrollment Code:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 px-4 py-3 rounded-xl font-mono text-center font-bold text-[#1D1D35] tracking-widest border border-slate-200">
                  {subject.code}
                </div>
                <button 
                  onClick={() => copyToClipboard(subject.code)}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  title="Copy Enrollment Code"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1">
                <QrCode size={14} /> Get QR Code
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                View Students →
              </div>
            </div>
          </motion.div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Book size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No courses assigned yet.</h3>
            <p className="text-sm text-slate-400">Please contact the administrator to assign subjects to your account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
