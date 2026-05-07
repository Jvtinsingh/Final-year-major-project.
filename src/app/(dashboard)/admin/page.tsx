'use client';

import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, GraduationCap, User, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboardOverview() {
  const { userData } = useAuth();
  const { users } = useAdmin();

  // Metrics
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const facultyCount = users.filter((u) => u.role === 'faculty').length;
  const studentCount = users.filter((u) => u.role === 'student').length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.length - activeCount;

  // Chart Data
  const roleChartData = {
    labels: ['Admins', 'Faculty', 'Students'],
    datasets: [
      {
        label: 'User Demographics',
        data: [adminCount, facultyCount, studentCount],
        backgroundColor: ['#0B4CEB', '#818CF8', '#C7D2FE'],
        borderRadius: 8,
      },
    ],
  };

  const statusChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [activeCount, inactiveCount],
        backgroundColor: ['#34D399', '#F43F5E'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 pb-20 w-full max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold text-[#1D1D35] tracking-tight">
          Welcome back, {userData?.displayName?.split(' ')[0] || 'Administrator'}
        </h1>
        <p className="text-slate-500 mt-1">Here's what is happening across the institution today.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0B4CEB] flex items-center justify-center shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Admins</p>
            <p className="text-3xl font-extrabold text-[#1D1D35]">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Faculty</p>
            <p className="text-3xl font-extrabold text-[#1D1D35]">{facultyCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <User size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Students</p>
            <p className="text-3xl font-extrabold text-[#1D1D35]">{studentCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300">
          <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-extrabold text-[#1D1D35]">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Analytics Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-[#1D1D35] mb-6">User Demographics</h2>
          <div className="h-[300px] w-full">
            <Bar data={roleChartData} options={chartOptions} />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-[#1D1D35] mb-6">System Status Activity</h2>
          <div className="flex-1 min-h-[300px] w-full flex items-center justify-center relative">
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-extrabold text-[#1D1D35]">{Math.round((activeCount/users.length)*100)}%</span>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Active Health</span>
             </div>
             <Doughnut 
               data={statusChartData} 
               options={{
                 ...chartOptions, 
                 cutout: '75%', 
                 plugins: { legend: { position: 'bottom' }} 
               }} 
             />
          </div>
        </section>
      </div>

    </motion.div>
  );
}
