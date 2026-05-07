'use client';

import { useAdmin } from '@/context/AdminContext';
import { useState } from 'react';
import { Search, Filter, Pencil, Trash2, X, Check, ToggleLeft as DeactivateIcon, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const { users, updateUser, deleteUser, updateUserStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'faculty' | 'student'>('all');
  const [editingUser, setEditingUser] = useState<any>(null);

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || (user as any).displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) return toast.error('Name and Email are required.');
    
    await updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role
    });
    
    toast.success('User updated successfully');
    setEditingUser(null);
  };

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkRole, setBulkRole] = useState('student');
  const [isUploading, setIsUploading] = useState(false);

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) return toast.error('Please select a file.');
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', bulkFile);
    formData.append('role', bulkRole);

    try {
      const response = await api.post('/auth/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${response.data.created} users created successfully!`);
      setIsBulkModalOpen(false);
      setBulkFile(null);
    } catch (error: any) {
      toast.error('Bulk upload failed. Please check the file format.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 w-full max-w-7xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-extrabold text-[#1D1D35] tracking-tight">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage all registered accounts on the platform.</p>
        <div className="mt-4">
           <button 
             onClick={() => setIsBulkModalOpen(true)}
             className="bg-[#0B4CEB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200"
           >
              <Upload size={18} />
              Bulk Upload (Excel)
           </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full bg-[#f8f6ff] border border-transparent focus:ring-4 focus:ring-blue-500/20 focus:border-[#0B4CEB] focus:bg-white transition-all rounded-xl pl-10 pr-4 py-2.5 text-sm text-black placeholder:text-slate-600 font-medium outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
           
           <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                {(['all', 'admin', 'faculty', 'student'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${selectedRole === role ? 'bg-white text-[#0B4CEB] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {role}
                  </button>
                ))}
             </div>
           </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 text-[10px]">User Details</th>
                <th className="p-4 text-[10px]">Role / joined</th>
                <th className="p-4 text-[10px]">Status</th>
                <th className="p-4 text-right pr-6 text-[10px]">Administrative actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                       <span className="font-bold text-[#1D1D35] group-hover:text-[#0B4CEB] transition-colors">{user.name || (user as any).displayName || 'Unknown'}</span>
                       <span className="text-[11px] font-medium text-slate-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider w-fit
                        ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 
                          user.role === 'faculty' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-slate-200 text-slate-600'
                        }`}>
                        {user.role}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{user.joinedDate}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider
                      ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Pencil size={15} />
                      </button>
                      
                      {user.status === 'active' ? (
                         <button 
                           onClick={() => { if(confirm(`Deactivate ${user.name || 'this user'}?`)) updateUserStatus(user.id, 'inactive') }}
                           className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-[11px] font-bold"
                           title="Deactivate"
                         >
                           <DeactivateIcon size={15} />
                         </button>
                      ) : (
                         <button 
                           onClick={() => updateUserStatus(user.id, 'active')}
                           className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-[11px] font-bold"
                           title="Activate"
                         >
                           <Check size={15} />
                         </button>
                      )}

                      <button 
                        onClick={() => { if(confirm(`Permanently delete ${user.name}? This cannot be undone.`)) deleteUser(user.id) }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                   <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D35]/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-[#1D1D35]">Edit User Profile</h3>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Display Name</label>
                    <input 
                      type="text" 
                      value={editingUser.name} 
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#0B4CEB] focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm text-black font-bold outline-none transition-all"
                    />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={editingUser.email} 
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#0B4CEB] focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm text-black font-bold outline-none transition-all"
                    />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Assignment Role</label>
                    <select 
                      value={editingUser.role} 
                      onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#0B4CEB] focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm text-black font-bold outline-none transition-all appearance-none cursor-pointer"
                    >
                    <option value="admin">Administrator</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-black transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-3 bg-[#0B4CEB] hover:bg-blue-700 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-600/20"
                  >
                    Update Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D35]/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-[#1D1D35]">Bulk User Upload</h3>
                <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleBulkUpload} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Role</label>
                  <div className="grid grid-cols-3 gap-2">
                     {['student', 'faculty', 'admin'].map(role => (
                       <button
                         key={role}
                         type="button"
                         onClick={() => setBulkRole(role)}
                         className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${bulkRole === role ? 'bg-blue-50 border-[#0B4CEB] text-[#0B4CEB]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                       >
                         {role}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Excel/CSV File</label>
                  <label className="group block cursor-pointer">
                    <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-[#0B4CEB] group-hover:bg-blue-50/30 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#0B4CEB] transition-colors">
                          <Upload size={24} />
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-bold text-slate-600 group-hover:text-[#1D1D35] transition-colors">
                             {bulkFile ? bulkFile.name : 'Select data file'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">Support: .xlsx, .xls, .csv</p>
                       </div>
                       <input 
                         type="file" 
                         className="hidden" 
                         accept=".xlsx,.xls,.csv"
                         onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                       />
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    disabled={isUploading}
                    type="submit" 
                    className="w-full px-4 py-4 bg-[#0B4CEB] hover:bg-blue-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <>Start Processing <Check size={18}/></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
