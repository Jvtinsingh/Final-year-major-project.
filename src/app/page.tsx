'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Settings, 
  GraduationCap, 
  User, 
  FileEdit, 
  ShieldCheck, 
  LineChart, 
  Cloud,
  CheckCircle2,
  Share2,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFF] text-[#1E1E2F] selection:bg-blue-600/30 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-700 tracking-tight">AcadeMetrics</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
            Log In
          </Link>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-pink-100/50 text-[#523C5E] text-xs font-bold tracking-wide">
            Institutional Excellence Redefined
          </span>
          <h1 className="text-5xl md:text-[64px] font-extrabold leading-[1.1] text-[#1D1D35] tracking-tight">
            Measure <br /> Progress with <br />
            <span className="text-blue-600 italic">Precision.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            The unified assessment platform for higher education. Streamline grading, ensure academic integrity, and derive actionable insights with Scholarly Curators' flagship evaluator.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-center transition-all shadow-lg shadow-blue-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: 20, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[600px] aspect-[4/3] rounded-2xl bg-[#0F172A] shadow-2xl overflow-hidden border border-slate-700 relative transform rotate-1 hover:rotate-0 transition-transform duration-500"
          >
            {/* Mock Dashboard UI built with CSS to replace the image */}
            <div className="h-8 bg-[#1E293B] border-b border-slate-700 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-rose-500"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-slate-700 rounded"></div>
                  <div className="h-8 w-8 rounded-full bg-blue-600"></div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-800 rounded-lg"></div>
                  <div className="h-24 bg-slate-800 rounded-lg"></div>
                  <div className="h-24 bg-slate-800 rounded-lg"></div>
               </div>
               <div className="h-40 bg-slate-800 rounded-lg max-w-sm mx-auto"></div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Tailored Access Section */}
      <section className="bg-white py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1D1D35] mb-4">Tailored Access</h2>
          <p className="text-slate-500">Specific tools designed for every stakeholder in the educational ecosystem.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admins */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col h-full">
            <div className="w-12 h-12 bg-[#F0EEFA] rounded-xl flex items-center justify-center mb-6">
              <Settings className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D35] mb-6">Admins</h3>
            <ul className="space-y-4 mb-8 flex-1">
              {['Institutional oversight & audit trails', 'Secure department-level permissioning', 'Centralized curriculum reporting'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="w-full block text-center bg-[#F0EEFA] hover:bg-[#EBE9F8] text-[#4A4568] py-3 rounded-lg font-semibold transition-colors">
              Admin Portal
            </Link>
          </div>

          {/* Faculty */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 shadow-[0_12px_40px_rgba(0,77,230,0.1)] flex flex-col h-full relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-blue-600 rounded-b-lg"></div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D35] mb-6">Faculty</h3>
            <ul className="space-y-4 mb-8 flex-1">
              {['Automated grading & rubric builder', 'AI-assisted plagiarism detection', 'Real-time class performance analytics'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-md shadow-blue-600/20">
              Faculty Login
            </Link>
          </div>

          {/* Students */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col h-full">
            <div className="w-12 h-12 bg-[#F0EEFA] rounded-xl flex items-center justify-center mb-6">
              <User className="text-[#A26A87]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D35] mb-6">Students</h3>
            <ul className="space-y-4 mb-8 flex-1">
              {['Seamless multi-device exam portal', 'Instant results & corrective feedback', 'Personalized study progress tracking'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="w-full block text-center bg-[#F0EEFA] hover:bg-[#EBE9F8] text-[#4A4568] py-3 rounded-lg font-semibold transition-colors">
              Student Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Built for the Modern Campus Section */}
      <section className="bg-[#FBFBFF] py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 pt-4">
            <h2 className="text-3xl font-bold text-[#1D1D35] mb-4">Built for the Modern Campus</h2>
            <p className="text-slate-500 mb-8 max-w-sm">
              Beyond standard testing. A robust infrastructure that supports pedagogy first.
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded"></div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                icon: <FileEdit className="text-blue-600" size={20} />, 
                title: 'Diverse Exam Types', 
                desc: 'From objective multiple-choice to open-ended essay assessments with contextual grading support.' 
              },
              { 
                icon: <ShieldCheck className="text-blue-600" size={20} />, 
                title: 'Military-Grade Security', 
                desc: 'Lock-down browsers, biometrics, and end-to-end encryption for every assessment session.' 
              },
              { 
                icon: <LineChart className="text-blue-600" size={20} />, 
                title: 'Deep Analytics', 
                desc: 'Actionable data visualizations that identify learning gaps across cohorts in real-time.' 
              },
              { 
                icon: <Cloud className="text-blue-600" size={20} />, 
                title: 'Cloud-Based Scale', 
                desc: 'Always available, always syncing. Host thousands of simultaneous exams without latency.' 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-[#EBE9F8]/60 rounded-2xl p-6 hover:bg-[#EBE9F8] transition-colors border border-transparent hover:border-indigo-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-[#1D1D35] mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-lg font-bold text-blue-700 tracking-tight block mb-1">AcadeMetrics</span>
            <p className="text-xs text-slate-400">© 2024 Scholarly Curator. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
            <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-600">Cookie Settings</Link>
            <Link href="#" className="hover:text-blue-600">Contact</Link>
          </div>
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-[#F0EEFA] flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                <Share2 size={14} />
             </div>
             <div className="w-8 h-8 rounded-full bg-[#F0EEFA] flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                <Mail size={14} />
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
