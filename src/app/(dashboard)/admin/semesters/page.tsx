'use client';

import { useAdmin } from '@/context/AdminContext';
import { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Trash2, Play, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminSemestersPage() {
  const { semesters, addSemester, updateSemesterStatus, deleteSemester } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return toast.error('Please fill all fields.');
    
    addSemester({ name, startDate, endDate, status });
    toast.success('Semester created successfully!');
    
    // Reset
    setName(''); setStartDate(''); setEndDate(''); setStatus('upcoming');
    setShowForm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 w-full max-w-7xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] tracking-tight">Academic Semesters</h1>
           <p className="text-slate-500 mt-1">Manage institutional terms and timelines.</p>
        </div>
        <button 
           onClick={() => setShowForm(!showForm)}
           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm shadow-sm"
        >
          <PlusCircle size={18} />
          {showForm ? 'Cancel' : 'Create Semester'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100/50 mb-8 shadow-xl shadow-blue-900/5 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-[#1D1D35] mb-4">New Semester Details</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Semester Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Fall 2025" className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-slate-600 font-medium outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Start Date</label>
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">End Date</label>
                <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none" />
             </div>
             <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Status</label>
                <select value={status} onChange={e=>setStatus(e.target.value as any)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none cursor-pointer">
                   <option value="upcoming">Upcoming</option>
                   <option value="ongoing">Ongoing</option>
                   <option value="completed">Completed</option>
                </select>
             </div>
             <div className="md:col-span-2 flex justify-end mt-4">
                 <button type="submit" className="bg-[#1D1D35] hover:bg-black text-white px-8 py-2.5 rounded-xl font-semibold transition-colors text-sm shadow-md hover:-translate-y-0.5">
                   Save Semester
                 </button>
             </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {semesters.map((sem, i) => (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               key={sem.id} 
               className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 group"
            >
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                     <CalendarIcon size={24} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors
                      ${sem.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 
                        sem.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-600'}`}>
                      {sem.status}
                  </span>
               </div>
               <h3 className="font-extrabold text-xl text-[#1D1D35] mb-1">{sem.name}</h3>
               <p className="text-sm font-medium text-slate-500 mb-6">{sem.startDate} &rarr; {sem.endDate}</p>
                
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100/50">
                   {sem.status === 'upcoming' && (
                      <button 
                         onClick={() => updateSemesterStatus(sem.id, 'ongoing')}
                         className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                         <Play size={14} /> Start
                      </button>
                   )}
                   {sem.status === 'ongoing' && (
                      <button 
                         onClick={() => updateSemesterStatus(sem.id, 'completed')}
                         className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                         <CheckCircle size={14} /> Complete
                      </button>
                   )}
                   <button 
                      onClick={() => { if(confirm('Permanently delete this semester?')) deleteSemester(sem.id) }}
                      className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all"
                      title="Delete Semester"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
             </motion.div>
         ))}
      </div>
    </motion.div>
  );
}
