'use client';

import React from 'react';
import { useStudent } from '@/context/StudentContext';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Download } from 'lucide-react';

export default function MaterialsPage() {
  const { materials } = useStudent();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-teal-100 text-teal-600 p-2 rounded-xl">
               <BookOpen size={28} />
             </div>
             Study Materials
           </h1>
           <p className="text-slate-500 font-medium mt-2 leading-relaxed">Resources and guides provided by your professors.</p>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((mat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            key={mat.id} 
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
               <div className="flex items-start justify-between mb-4">
                 <div className={`p-3 rounded-xl ${mat.type === 'video' ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition'}`}>
                   {mat.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                 </div>
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                   {mat.subject}
                 </span>
               </div>
               
               <h4 className="font-bold text-[#1D1D35] text-lg leading-tight mb-2 group-hover:text-teal-600 transition-colors">{mat.title}</h4>
               <p className="text-xs text-slate-400 font-medium mb-6">Posted by {mat.postedBy}</p>
            </div>
            
            <a 
              href={mat.url} 
              target="_blank" 
              rel="noreferrer" 
              className="flex justify-center items-center gap-2 w-full bg-slate-50 border border-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors"
              onClick={(e) => {
                 if (mat.url === '#') {
                    e.preventDefault();
                    // mock download or open action
                 }
              }}
            >
              {mat.type === 'video' ? (
                <>Watch Lesson <Video size={16}/></>
              ) : (
                <>Read Document <Download size={16}/></>
              )}
            </a>
          </motion.div>
        ))}
        {materials.length === 0 && (
           <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No materials shared yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
