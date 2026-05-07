'use client';

import React from 'react';
import { useStudent } from '@/context/StudentContext';
import { motion } from 'framer-motion';
import { Megaphone, AlertCircle, Calendar } from 'lucide-react';

export default function AnnouncementsPage() {
  const { announcements } = useStudent();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
               <Megaphone size={28} />
             </div>
             Notice Board
           </h1>
           <p className="text-slate-500 font-medium mt-2 leading-relaxed">Stay updated with the latest instructions and alerts.</p>
         </motion.div>
      </div>

      <div className="space-y-4 pt-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {announcements.map((acc, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              key={acc.id} 
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 overflow-hidden z-10 transition-transform group-hover:scale-110">
                {acc.priority === 'high' ? <AlertCircle className="text-rose-500" size={20} /> : <Megaphone className="text-amber-500" size={20} />}
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)]  p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all bg-white relative overflow-hidden">
                {acc.priority === 'high' && <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>}
                {acc.priority !== 'high' && <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>}
                
                <div className="flex justify-between items-start mb-3 ml-2">
                  <h4 className={`font-bold text-lg leading-tight ${acc.priority === 'high' ? 'text-rose-600' : 'text-[#1D1D35]'}`}>{acc.title}</h4>
                  {acc.priority === 'high' && <span className="bg-rose-100 text-rose-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ring-1 ring-rose-500/20 shrink-0 ml-2 animate-pulse">Urgent</span>}
                </div>
                <p className="text-sm text-slate-600 mb-4 ml-2 leading-relaxed">{acc.content}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 ml-2 text-xs font-bold text-slate-400">
                  <span className="capitalize text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">From: {acc.senderName || "Faculty"}</span>
                  <div className="flex items-center gap-1.5">
                     <Calendar size={14} />
                     {new Date(acc.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {announcements.length === 0 && (
             <div className="py-16 text-center text-slate-400 font-medium">
                <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
                <p>No new announcements.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
