'use client';

import React, { useState } from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExamCalendar() {
  const { exams } = useFaculty();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3)); // Defaulted to April 2026 as per screenshot

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = daysInMonth(month, year);
  const offset = firstDayOfMonth(month, year);

  const calendarDays = Array.from({ length: days }, (_, i) => i + 1);
  const offsetDays = Array.from({ length: offset }, (_, i) => null);

  const getExamsForDay = (day: number) => {
    return exams.filter(exam => {
       const d = new Date(exam.startDate);
       return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const totalExamsInMonth = exams.filter(exam => {
     const d = new Date(exam.startDate);
     return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-black text-[#1D1D35] flex items-center gap-2">
            <CalendarIcon className="text-blue-600" size={24} />
            Exam Calendar
         </h2>
         <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20}/></button>
            <span className="text-lg font-black text-[#1D1D35] min-w-[140px] text-center">{monthNames[month]} {year}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={20}/></button>
         </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-slate-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="p-4 bg-slate-50 border-r border-b border-slate-100 text-center font-bold text-xs text-slate-500 uppercase tracking-widest">{d}</div>
        ))}
        {offsetDays.map((_, i) => (
          <div key={`offset-${i}`} className="p-8 border-r border-b border-slate-100 bg-slate-50/20" />
        ))}
        {calendarDays.map(day => {
          const dayExams = getExamsForDay(day);
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
          
          return (
            <div key={day} className={`p-4 border-r border-b border-slate-100 min-h-[100px] relative transition-all group ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
               <span className={`text-sm font-black ${isToday ? 'text-blue-600 bg-white px-2 py-1 rounded-lg shadow-sm border border-blue-100' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  {day}
               </span>
               <div className="mt-2 space-y-1">
                  {dayExams.map(ex => (
                    <div key={ex.id} className="text-[9px] font-black bg-blue-600 text-white px-2 py-1 rounded shadow-sm truncate" title={ex.title}>
                       {ex.title}
                    </div>
                  ))}
               </div>
            </div>
          )
        })}
      </div>

      <div className="text-center pt-4">
         <p className="text-sm font-bold text-slate-400 mb-6">
           {totalExamsInMonth > 0 
             ? `${totalExamsInMonth} exam${totalExamsInMonth > 1 ? 's' : ''} scheduled this month` 
             : "No exams scheduled for this month"
            }
         </p>
         <Link href="/faculty/exams">
           <button className="bg-slate-100 hover:bg-slate-200 text-[#1D1D35] px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-sm hover:translate-y-[-2px]">
             Schedule an Exam
           </button>
         </Link>
      </div>
    </div>
  );
}
