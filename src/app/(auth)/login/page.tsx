'use client';

import { useState } from 'react';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  doc, 
  setDoc 
} from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Globe, 
  HelpCircle, 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  Settings, 
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const handleLogin = async (e?: React.FormEvent, directEmail?: string) => {
    if (e) e.preventDefault();
    setLoading(true);

    const loginEmail = directEmail || email;
    const loginPassword = password || 'demo';

    try {
      // Auto-Provisioning for Demo Accounts in Live Firebase
      if (loginEmail.endsWith('@academetrics.io')) {
        let role = 'student';
        if (loginEmail.startsWith('admin')) role = 'admin';
        if (loginEmail.startsWith('faculty')) role = 'faculty';

        try {
          await signInWithEmailAndPassword(auth, loginEmail, "demo123456");
          toast.success(`Welcome back, ${role}!`);
          router.push(`/${role}`);
          return;
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
             const cred = await createUserWithEmailAndPassword(auth, loginEmail, "demo123456");
             await setDoc(doc(db, 'users', cred.user.uid), {
                email: loginEmail,
                role: role,
                displayName: role.charAt(0).toUpperCase() + role.slice(1),
                status: 'active',
                joinedDate: new Date().toISOString()
             });
             toast.success(`Cloud Demo account auto-provisioned!`);
             router.push(`/${role}`);
             return;
          }
          throw err;
        }
      }

      // Standard Auth
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error: any) {
      toast.error(error.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      // Redirection is handled by the overall auth state usually, 
      // but we can force a push to student/faculty/admin based on the new userData
      // Since Google users default to 'student' in our provisioner:
      router.push('/student');
    } catch (error: any) {
      toast.error('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFF] text-[#1E1E2F] font-sans flex flex-col justify-between selection:bg-blue-600/30 overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center max-w-[1400px] mx-auto shrink-0 border-b border-transparent">
        <div className="text-2xl font-bold text-[#1D1D35] tracking-tight hover:text-blue-600 transition-colors">
          <Link href="/">AcadeMetrics</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <Globe size={20} className="hover:text-[#1D1D35] cursor-pointer transition-colors" />
          <HelpCircle size={20} className="hover:text-[#1D1D35] cursor-pointer transition-colors mr-2 hidden sm:block" />
          <button className="bg-[#004de6] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content Split */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-100"
        >
          
          {/* Left Column (Blue Branding) */}
          <div className="md:w-[45%] bg-[#0B4CEB] p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-[#0B4CEB]" size={24} />
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Unlock the <br className="hidden sm:block" /> Future of <br className="hidden sm:block" /> Education.
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed max-w-[280px]">
                Access the premier evaluation platform for modern academia. A sanctuary for learning, data-driven insights, and institutional excellence.
              </p>
            </div>

            <div className="relative z-10 mt-12 bg-white/20 backdrop-blur-md border border-white/20 p-2 pl-3 rounded-full flex items-center gap-3 w-max">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#0B4CEB] bg-emerald-400 flex items-center justify-center overflow-hidden"><span className="text-[10px] font-bold text-black/50">👩‍🏫</span></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#0B4CEB] bg-rose-400 flex items-center justify-center overflow-hidden"><span className="text-[10px] font-bold text-black/50">👨‍🎓</span></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#0B4CEB] bg-amber-400 flex items-center justify-center overflow-hidden"><span className="text-[10px] font-bold text-black/50">👩‍💼</span></div>
              </div>
              <span className="text-xs font-medium pr-4">Join 2,400+ educators today</span>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="md:w-[55%] p-8 sm:p-10 lg:p-14 bg-white flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1D1D35] mb-2">Welcome Back</h2>
              <p className="text-sm text-slate-500">Please enter your credentials to continue your journey.</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 shadow-sm active:scale-[0.98]"
              >
                <div className="w-5 h-5 rounded-full border-[3px] border-[#EA4335] border-t-[#FBBC05] border-r-[#34A853] border-b-[#4285F4]"></div>
                Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 border-t border-slate-100"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Or continue with email</span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <form onSubmit={(e) => handleLogin(e)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f8f6ff] border border-transparent rounded-lg pl-10 pr-4 py-3 text-sm text-black placeholder:text-slate-600 outline-none focus:bg-white focus:border-[#0B4CEB] transition-all font-medium"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>
 
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500">Password</label>
                  <Link href="#" className="text-xs font-bold text-[#0B4CEB] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f8f6ff] border border-transparent rounded-lg pl-10 pr-10 py-3 text-sm text-black placeholder:text-slate-600 outline-none focus:bg-white focus:border-[#0B4CEB] transition-all tracking-widest font-bold placeholder:tracking-normal placeholder:font-normal"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                     <Eye size={16} className="text-slate-400 hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#004de6] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm mt-2 shadow-md shadow-blue-600/20"
              >
                {loading ? 'Authenticating...' : 'Sign In to AcadeMetrics'}
              </button>
            </form>



            <div className="mt-8 text-center pt-2">
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account? <Link href="#" className="text-[#0B4CEB] font-bold hover:underline">Request Access</Link>
              </p>
            </div>

          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f8f6ff] border-t border-slate-100 py-6 px-8 shrink-0 mt-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-bold text-[#1D1D35]">
            AcadeMetrics
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold text-slate-400">
            <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Accessibility</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Contact Support</Link>
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            © 2024 AcadeMetrics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
