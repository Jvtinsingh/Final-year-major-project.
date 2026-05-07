'use client';

import React, { useState } from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { motion } from 'framer-motion';
import { Megaphone, Plus, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, subjects } = useFaculty();
  const [isPosting, setIsPosting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
    subjectId: '' // Default to all students
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and message are required');
      return;
    }
    
    addAnnouncement(formData);
    toast.success('Announcement broadcasted!');
    setFormData({ title: '', content: '', priority: 'normal', subjectId: '' });
    setIsPosting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
               <Megaphone size={28} />
             </div>
             Broadcast Center
           </h1>
           <p className="text-slate-500 font-medium mt-2">Send updates and alerts to your students.</p>
        </div>
        {!isPosting && (
          <button 
            onClick={() => setIsPosting(true)}
            className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Post Update
          </button>
        )}
      </div>

      {isPosting && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  Announcement Subject
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Syllabus Change"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-black placeholder:text-slate-600 font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  Target Course
                </label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-black font-bold appearance-none cursor-pointer"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                >
                  <option value="">Broadcast to All Courses</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Message Content
              </label>
              <textarea 
                required
                placeholder="Write your announcement here..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-32 text-black placeholder:text-slate-600 font-bold"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Priority
              </label>
              <div className="flex gap-4">
                {['low', 'normal', 'high'].map(priority => (
                  <label key={priority} className={`flex-1 flex justify-center items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition capitalize font-extrabold text-sm ${formData.priority === priority ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>
                    <input type="radio" name="priority" value={priority} checked={formData.priority === priority} onChange={() => setFormData({...formData, priority: priority as any})} className="hidden" />
                    {priority}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Broadcast Now
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-bold text-[#1D1D35]">Recent Broadcasts</h3>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {announcements.map((acc, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              key={acc.id} 
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 overflow-hidden z-10">
                {acc.priority === 'high' ? <AlertCircle className="text-rose-500" size={18} /> : <Megaphone className="text-blue-500" size={18} />}
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-[#1D1D35]">{acc.title}</h4>
                    {acc.subjectId && (
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                        {subjects.find(s => s.id === acc.subjectId)?.name || 'Course Update'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {acc.priority === 'high' && <span className="bg-rose-100 text-rose-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ring-1 ring-rose-500/20">Urgent</span>}
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this announcement?')) {
                          deleteAnnouncement(acc.id);
                          toast.success('Announcement deleted');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3">{acc.content}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Calendar size={12} />
                  {new Date(acc.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
          {announcements.length === 0 && (
             <div className="py-12 text-center text-slate-400 font-medium">
                No announcements broadcasted yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
