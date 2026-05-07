'use client';

import { useAdmin } from '@/context/AdminContext';
import { useState } from 'react';
import { PlusCircle, Layers, Users, Trash2, ToggleLeft as DeactivateIcon, ToggleRight as ActivateIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSectionsPage() {
  const { sections, addSection, updateSectionStatus, deleteSection } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [faculty, setFaculty] = useState('Prof. Alan Turing');
  const [semester, setSemester] = useState('Fall 2026');
  const [capacity, setCapacity] = useState(60);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Section name is required.');
    
    // Using extended props for mock creation
    addSection({ name, capacity: Number(capacity), enrolled: 0, subject, faculty, semester } as any);
    toast.success('Section created successfully!');
    
    setName(''); setCapacity(60); setSubject('Data Structures'); setFaculty('Prof. Alan Turing'); setSemester('Fall 2026');
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
           <h1 className="text-3xl font-extrabold text-[#1D1D35] tracking-tight">Class Sections</h1>
           <p className="text-slate-500 mt-1">Organize students into logical evaluation units.</p>
        </div>
        <button 
           onClick={() => setShowForm(!showForm)}
           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm shadow-sm"
        >
          <PlusCircle size={18} />
          {showForm ? 'Cancel' : 'Create Section'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100/50 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-[#1D1D35] mb-4">New Section Details</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Section Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Section C" className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-slate-600 font-medium outline-none" required />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Subject</label>
                <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none cursor-pointer">
                   <option>Data Structures</option>
                   <option>Web Automation</option>
                   <option>Database Systems</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Assigned Faculty</label>
                <select value={faculty} onChange={e=>setFaculty(e.target.value)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none cursor-pointer">
                   <option>Prof. Alan Turing</option>
                   <option>Prof. Grace Hopper</option>
                   <option>Prof. Ada Lovelace</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Semester</label>
                <select value={semester} onChange={e=>setSemester(e.target.value)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none cursor-pointer">
                   <option>Fall 2026</option>
                   <option>Spring 2027</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Maximum Capacity</label>
                <input type="number" min="1" value={capacity} onChange={e=>setCapacity(Number(e.target.value))} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none" required />
             </div>
             
             <div className="md:col-span-2 flex justify-end mt-4">
                 <button type="submit" className="bg-[#1D1D35] hover:bg-black text-white px-8 py-2.5 rounded-xl font-semibold transition-all text-sm shadow-md hover:-translate-y-0.5">
                   Save Section
                 </button>
             </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {sections.map((sec, i) => (
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={sec.id} 
                className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-900/5 transition-all duration-300 group relative ${sec.status === 'inactive' ? 'opacity-60 saturate-50' : ''}`}
             >
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${sec.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {sec.status}
                  </span>
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${sec.status === 'active' ? 'bg-pink-50 text-pink-500 group-hover:bg-pink-500 group-hover:text-white' : 'bg-slate-50 text-slate-400 font-bold'}`}>
                   <Layers size={21} />
                </div>
                <h3 className="font-extrabold text-xl text-[#1D1D35] mb-1">{sec.name}</h3>
                {/* @ts-ignore */}
                {sec.subject && <p className="text-xs font-bold text-slate-500 mb-4">{sec.subject} • {sec.semester}</p>}
                
                <div className="space-y-2 mb-6">
                  {/* @ts-ignore */}
                  {sec.faculty && (
                    <div className="flex justify-between items-center text-xs font-bold bg-slate-50 p-2 rounded-lg mb-2">
                       <span className="text-slate-400">Assigned To</span>
                       {/* @ts-ignore */}
                       <span className="text-[#1D1D35]">{sec.faculty}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-slate-500">Enrollment Target</span>
                     <span className="text-[#0B4CEB]">{sec.enrolled} / {sec.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner flex shrink-0">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ease-out ${sec.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-[#0B4CEB]' : 'bg-slate-300'}`}
                       style={{ width: `${Math.min((sec.enrolled / sec.capacity) * 100, 100)}%` }}
                     />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100/50">
                  {sec.status === 'active' ? (
                    <button 
                      onClick={() => updateSectionStatus(sec.id, 'inactive')}
                      className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <DeactivateIcon size={14} /> Deactivate
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateSectionStatus(sec.id, 'active')}
                      className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <ActivateIcon size={14} /> Activate
                    </button>
                  )}
                  <button 
                    onClick={() => { if(confirm('Permanently remove this section?')) deleteSection(sec.id) }}
                    className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all"
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
