'use client';

import React, { useState } from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Link as LinkIcon, UploadCloud, Video, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MaterialsPage() {
  const { materials, subjects, addMaterial } = useFaculty();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: subjects[0]?.id || '',
    description: '',
    type: 'video' as 'video' | 'file',
    url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast.error('Title and file/URL are required');
      return;
    }
    
    addMaterial(formData);
    toast.success('Material uploaded successfully!');
    setFormData({
      title: '',
      subjectId: subjects[0]?.id || '',
      description: '',
      type: 'video',
      url: ''
    });
    setIsUploading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
               <BookOpen size={28} />
             </div>
             Study Materials
           </h1>
           <p className="text-slate-500 font-medium mt-2">Upload and manage course resources.</p>
        </div>
        {!isUploading && (
          <button 
            onClick={() => setIsUploading(true)}
            className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            <UploadCloud size={20} />
            Upload Material
          </button>
        )}
      </div>

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <h2 className="text-xl font-bold text-[#1D1D35] mb-6 border-b border-slate-100 pb-4">Add Course Material</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Material Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Week 1 Slides"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition text-black placeholder:text-slate-600 font-bold appearance-none cursor-pointer shadow-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Associated Subject</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition text-black placeholder:text-slate-600 font-bold appearance-none cursor-pointer shadow-sm"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition h-24 text-black placeholder:text-slate-600 font-bold shadow-sm"
                  placeholder="Brief description of the material..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Resource Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Resource Type</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition text-black font-bold appearance-none cursor-pointer shadow-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'video' | 'file'})}
                >
                  <option value="video">YouTube Video</option>
                  <option value="file">Document / PDF</option>
                </select>
              </div>

              {/* URL or Fake Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LinkIcon size={16} className="text-emerald-500"/> Resource URL
                </label>
                {formData.type === 'video' ? (
                  <input 
                    type="url" 
                    required
                    placeholder="https://youtube.com/..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition text-black placeholder:text-slate-600 font-bold shadow-sm"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                  />
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                    <p className="text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PPTX up to 10MB</p>
                    {/* Mock functionality for file upload URL */}
                    <input type="text" placeholder="Mock file link for UI (e.g., file.pdf)" className="mt-4 text-xs p-1 text-center bg-transparent outline-none w-full border-b text-black font-bold placeholder:text-slate-600" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} required/>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                Upload Resource
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Uploaded Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {materials.map(mat => {
          const subject = subjects.find(s => s.id === mat.subjectId);
          return (
            <motion.div 
              key={mat.id} 
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${mat.type === 'video' ? 'bg-rose-100 text-rose-500' : 'bg-blue-100 text-blue-500'}`}>
                  {mat.type === 'video' ? <Video size={20}/> : <FileText size={20}/>}
                </div>
                <div>
                  <h4 className="font-bold text-[#1D1D35] text-sm leading-tight">{mat.title}</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-wider mt-1 inline-block">
                    {subject?.code || 'Gen'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{mat.description}</p>
              
              <a href={mat.url} target="_blank" rel="noreferrer" className="block w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                View Resource
              </a>
            </motion.div>
          );
        })}
        {materials.length === 0 && (
           <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              No materials uploaded yet.
           </div>
        )}
      </div>
    </div>
  );
}
