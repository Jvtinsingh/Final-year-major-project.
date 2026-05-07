'use client';

import { useAdmin } from '@/context/AdminContext';
import { useState } from 'react';
import { PlusCircle, BookOpen, Users as UsersIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminSubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject, users } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  
  const facultyList = users.filter(u => u.role === 'faculty');

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [credits, setCredits] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return toast.error('Please fill required fields.');
    
    if (editingSubjectId) {
      updateSubject(editingSubjectId, { code, name, facultyId, credits: Number(credits) });
      toast.success('Subject updated successfully!');
    } else {
      addSubject({ code, name, facultyId, credits: Number(credits) });
      toast.success('Subject created and assigned!');
    }
    
    resetForm();
  };

  const handleEdit = (sub: any) => {
    setEditingSubjectId(sub.id);
    setCode(sub.code);
    setName(sub.name);
    setFacultyId(sub.facultyId || '');
    setCredits(sub.credits || 3);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCode(''); 
    setName(''); 
    setFacultyId(''); 
    setCredits(3);
    setEditingSubjectId(null);
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
           <h1 className="text-3xl font-extrabold text-[#1D1D35] tracking-tight">Subjects & Curriculum</h1>
           <p className="text-slate-500 mt-1">Manage course offerings and assign faculty.</p>
        </div>
        <button 
           onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}
           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm shadow-sm"
        >
          <PlusCircle size={18} />
          {showForm ? 'Cancel' : 'Add Subject'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100/50 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-[#1D1D35] mb-4">
            {editingSubjectId ? 'Edit Subject Details' : 'New Subject Registration'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Subject Code</label>
                <input type="text" value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. CS101" className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-slate-600 font-medium outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Subject Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Intro to CS" className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-slate-600 font-medium outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Assign Faculty</label>
                <select value={facultyId} onChange={e=>setFacultyId(e.target.value)} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none cursor-pointer">
                   <option value="">Unassigned</option>
                   {facultyList.map(f => (
                     <option key={f.id} value={f.id}>{f.name}</option>
                   ))}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Credits</label>
                <input type="number" min="1" max="6" value={credits} onChange={e=>setCredits(Number(e.target.value))} className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl px-4 py-2.5 text-sm text-black font-medium outline-none" />
             </div>
             
             <div className="md:col-span-2 flex justify-end mt-4">
                  <button type="submit" className="bg-[#1D1D35] hover:bg-black text-white px-8 py-2.5 rounded-xl font-semibold transition-all text-sm shadow-md hover:-translate-y-0.5">
                    {editingSubjectId ? 'Update Subject' : 'Save Subject'}
                  </button>
             </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {subjects.map((sub, i) => {
            const faculty = users.find(u => u.id === sub.facultyId);
            return (
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 key={sub.id} 
                 className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 group relative"
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                       <BookOpen size={24} />
                    </div>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(sub)}
                          className="p-1.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          title="Edit Subject"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => { if(confirm('Permanently delete this subject?')) deleteSubject(sub.id) }}
                          className="p-1.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 size={14} />
                        </button>
                    </div>
                 </div>
                 <h3 className="font-extrabold text-xl text-[#1D1D35] mb-4 truncate" title={sub.name}>{sub.name}</h3>
                 
                 <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{sub.code}</span>
                        <div className="flex items-center gap-2 border-l border-slate-100 pl-2">
                           <UsersIcon size={14} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
                           <span className="text-xs font-bold text-slate-600">{faculty ? faculty.name : 'Unassigned'}</span>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{sub.credits} Credits</span>
                 </div>
              </motion.div>
            )
         })}
      </div>
    </motion.div>
  );
}
