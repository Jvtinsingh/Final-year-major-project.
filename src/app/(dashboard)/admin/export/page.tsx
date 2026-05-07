'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { DownloadCloud, Info, Database } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

export default function AdminExportPage() {
  const { users, semesters, subjects, sections } = useAdmin();
  const [exportType, setExportType] = useState('all_data');

  const exportData = () => {
    const wb = XLSX.utils.book_new();

    if (exportType === 'all_data' || exportType === 'all_users') {
      const usersSheet = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(wb, usersSheet, "All Users");
    } else if (exportType === 'students') {
      const filtered = users.filter(u => u.role === 'student');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filtered), "Students");
    } else if (exportType === 'faculty') {
      const filtered = users.filter(u => u.role === 'faculty');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filtered), "Faculty");
    } else if (exportType === 'admins') {
      const filtered = users.filter(u => u.role === 'admin');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filtered), "Admins");
    }

    // Include platform configurations only if 'all_data' is selected
    if (exportType === 'all_data') {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(semesters), "Semesters");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(subjects), "Subjects");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sections), "Sections");
    }

    // Write file
    XLSX.writeFile(wb, `AcadeMetrics_Export_${exportType.toUpperCase()}.xlsx`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 w-full max-w-7xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-extrabold text-[#1D1D35] tracking-tight">Data Management</h1>
        <p className="text-slate-500 mt-1">Export institutional data for local archiving or reporting.</p>
      </header>

      <div className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white p-8 max-w-3xl hover:shadow-2xl transition-all duration-500">
         <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B4CEB] flex items-center justify-center shrink-0">
               <DownloadCloud size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-[#1D1D35]">Data Export Tool</h2>
               <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                 Generate an `.xlsx` workbook containing your selected data records.
               </p>
            </div>
         </div>
         
         <div className="mb-8 space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
               <Database size={16} className="text-blue-500"/> Select Export Target
            </label>
            <select 
               value={exportType} 
               onChange={(e) => setExportType(e.target.value)}
               className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-black cursor-pointer"
            >
               <option value="all_data">Full Platform Backup (Users, Sections, Subjects, etc.)</option>
               <option value="all_users">All Users (Admin, Faculty, Student)</option>
               <option value="students">Only Student Data</option>
               <option value="faculty">Only Faculty Data</option>
               <option value="admins">Only Admin Data</option>
            </select>
         </div>

         <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 mb-8 shadow-inner shadow-slate-100/50">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-slate-600 leading-relaxed">
               <strong>Note:</strong> Data exported in Mock Mode represents the local front-end state. For permanent backups, a production deployment connected to a verified secure database is required.
            </div>
         </div>

         <button 
           onClick={exportData}
           className="w-full bg-gradient-to-r from-[#0B4CEB] to-indigo-600 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/40 flex justify-center items-center gap-3 text-lg"
         >
           <DownloadCloud size={22} className="animate-bounce-subtle" />
           Download Selected Express Record
         </button>
      </div>
    </motion.div>
  );
}
