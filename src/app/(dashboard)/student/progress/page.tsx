'use client';

import React from 'react';
import { useStudent } from '@/context/StudentContext';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Target, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressPage() {
  const { stats, performance } = useStudent();

  const metrics = [
    { label: 'Completed Exams', value: stats.completedExams, icon: Target, color: 'text-indigo-500' },
    { label: 'Average Score', value: `${stats.averageScore}%`, icon: Activity, color: 'text-emerald-500' },
    { label: 'Highest Marks', value: `${stats.highestScore}%`, icon: Award, color: 'text-amber-500' },
    { label: 'Lowest Marks', value: `${stats.lowestMarks}%`, icon: TrendingUp, color: 'text-rose-500' },
  ];

  const chartData = {
    labels: performance.map(p => p.subject),
    datasets: [
      {
        label: 'Your Score',
        data: performance.map(p => p.score),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald 500
        borderRadius: 8,
      },
      {
        label: 'Class Average',
        data: performance.map(p => p.classAverage),
        backgroundColor: 'rgba(99, 102, 241, 0.3)', // Indigo 500
        borderRadius: 8,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
           font: { family: 'inherit', weight: 'bold' as const }
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
           color: 'rgba(0,0,0,0.04)'
        }
      },
      x: {
         grid: {
            display: false
         }
      }
    },
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
               <BarChart3 size={28} />
             </div>
             Progress Report
           </h1>
           <p className="text-slate-500 font-medium mt-2 leading-relaxed">Detailed analytics of your academic trajectory.</p>
         </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {metrics.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center text-center justify-center gap-3"
            >
               <div className={`p-4 rounded-full bg-slate-50 ${m.color}`}>
                  <m.icon size={28} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-[#1D1D35]">{m.value}</h2>
                 <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{m.label}</p>
               </div>
            </motion.div>
         ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col h-[500px]">
         <h2 className="text-xl font-bold flex items-center gap-2 text-[#1D1D35] mb-6">
            <TrendingUp className="text-purple-500" size={24} />
            Subject Comparison Analytics
         </h2>
         <div className="flex-1 w-full min-h-0 relative">
            <Bar data={chartData} options={chartOptions} />
         </div>
      </motion.div>
    </div>
  );
}
