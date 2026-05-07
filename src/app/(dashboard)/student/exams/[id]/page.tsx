'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import { doc, getDoc, db } from '@/lib/firebase';
import CodeEditor from '@/components/ui/CodeEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, CheckCircle2, XCircle, ArrowLeft, Loader2, List, Send, Trophy } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ExamTakingEnvironment() {
  const params = useParams();
  const router = useRouter();
  const { submitExam } = useStudent();
  const id = params?.id as string;
  
  const [examInfo, setExamInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  
  // MCQ state
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Security & Progress
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchExam = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'exams', id)) as any;
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExamInfo(data);
          if (data && data.questions && data.questions.length > 0) {
             setQuestions(data.questions);
          }
        }
      } catch (error) {
         console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFull = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFull);
      if (hasStarted && !isCurrentlyFull && !isSubmitted) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [hasStarted, isSubmitted]);

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        setShowWarning(false);
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
      toast.error('Browser blocked full-screen. Please enable it to start.');
    }
  };

  const startExam = async () => {
    await enterFullscreen();
    setHasStarted(true);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!examInfo || questions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
         <p className="text-slate-500 font-bold">No questions found for this exam.</p>
         <Link href="/student/exams" className="text-indigo-500 hover:underline">Go Back</Link>
      </div>
    );
  }

  // Pre-Exam Instruction Screen
  if (!hasStarted && !isSubmitted) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} />
          </div>
          <h1 className="text-3xl font-black text-[#1D1D35] mb-4">Exam Ready: {examInfo.title}</h1>
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> Important Instructions:
            </h3>
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5 font-medium">
              <li>This exam will be conducted in <b>Full-Screen Mode</b>.</li>
              <li>Exiting full-screen will <b>pause</b> your assessment immediately.</li>
              <li>Ensure you have a stable internet connection.</li>
              <li>Duration: <b>{examInfo.durationMinutes} Minutes</b></li>
              <li>Total Marks: <b>{examInfo.totalMarks}</b></li>
            </ul>
          </div>
          <button 
            onClick={startExam}
            className="w-full bg-[#1D1D35] text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            Start Assessment <Send size={20} />
          </button>
          <p className="text-slate-400 text-xs font-bold mt-6 uppercase tracking-widest">AcadeMetrics Secure Assessment Environment</p>
        </motion.div>
      </div>
    );
  }

  const activeQuestion = questions[currentQuestionIdx];
  const isCoding = examInfo.type === 'coding';
  const isMCQ = examInfo.type === 'multiple_choice' || examInfo.type === 'quiz';

  const handleOptionSelect = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedOptions({ ...selectedOptions, [currentQuestionIdx]: optIndex });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
       if (selectedOptions[idx] === q.correctOption) {
          score += q.marks || 1;
       }
    });
    return score;
  };

  const handleSubmit = async () => {
    if(!id) return;
    // Removed confirm for smoother demo experience

    try {
      let finalScore = 0;
      let finalTotal = 0;

      if (isMCQ) {
        finalScore = calculateScore();
        finalTotal = questions.reduce((acc, q) => acc + (q.marks || 1), 0);
      } else {
        // For coding, we use the results from the last run if available
        finalScore = results?.passedCount || 0;
        finalTotal = results?.totalCount || 100; // Fallback or use a better scale
      }

      await submitExam(id, finalScore, finalTotal);
      setIsSubmitted(true);
      setResults({ score: finalScore, total: finalTotal });
      
      toast.success('Exam submitted successfully!');
      
      // Small delay for UX before redirect
      setTimeout(() => {
        router.push('/student/exams');
      }, 2000);

    } catch (error) {
      toast.error('Failed to submit exam. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Full-screen Warning Overlay - Disabled for Demo */}
      <AnimatePresence>
        {false && showWarning && !isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-white rounded-[2rem] p-8 max-w-md text-center shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#1D1D35] mb-2">Full-Screen Required!</h2>
              <p className="text-slate-500 font-medium mb-6">Exiting full-screen is not allowed during this assessment. Please return to full-screen to continue.</p>
              <button 
                onClick={enterFullscreen}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                Return to Full-screen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between shrink-0">
        <Link href="/student/exams" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition">
          <ArrowLeft size={20} />
          Back to Exams
        </Link>
        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500" /> Live Assessment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 code-scroll">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1D1D35]">
              {isCoding ? <Code className="text-indigo-500" size={20} /> : <List className="text-indigo-500" size={20} />}
              Question {currentQuestionIdx + 1} of {questions.length}
            </h2>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <h3 className="font-bold text-[#1D1D35]">{activeQuestion.title || 'Question'}</h3>
              {activeQuestion.description && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{activeQuestion.description}</p>}
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-500 uppercase tracking-wider">
                <span>Time Remaining:</span>
                <span className="bg-indigo-100 px-2 py-1 rounded-md">{examInfo.durationMinutes}m 00s</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1D1D35]">
               {isMCQ ? 'Exam Status' : 'Submission Status'}
            </h2>
            {isMCQ ? (
               <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                     {questions.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setCurrentQuestionIdx(idx)}
                          className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                             currentQuestionIdx === idx ? 'bg-blue-600 text-white shadow-md' :
                             selectedOptions[idx] !== undefined ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                           {idx + 1}
                        </button>
                     ))}
                  </div>
                  {isSubmitted && (
                     <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-4 text-center">
                        <h3 className="text-emerald-700 font-extrabold text-lg">Exam Submitted!</h3>
                        {examInfo.resultsPublished ? (
                           <p className="text-emerald-600 font-medium">Score: {results.score} / {results.total}</p>
                        ) : (
                           <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">Results Pending Publication</p>
                        )}
                     </div>
                  )}
                  {!isSubmitted && (
                     <button onClick={handleSubmit} className="w-full mt-4 bg-[#1D1D35] text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg flex items-center justify-center gap-2">
                        <Send size={16}/> Submit Exam
                     </button>
                  )}
               </div>
            ) : (
                // Coding Status
                <div className="space-y-4">
                  {results ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-500">Test Cases Passed</span>
                        <span className="text-sm font-extrabold text-emerald-500">{results.passedCount}/{results.totalCount}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-500" 
                          style={{ width: `${(results.passedCount / results.totalCount) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        {results.results.map((res: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-start gap-3 border border-slate-100">
                             {/* Only show pass/fail during submission, hide details after finalize unless published */}
                            {res.isPassed ? <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />}
                            <div>
                              <h4 className="text-xs font-bold text-[#1D1D35]">Case {idx + 1}</h4>
                              {!res.isPassed && (isSubmitted ? examInfo.resultsPublished : true) && (
                                <p className="text-[10px] text-rose-500 mt-1 font-mono break-all line-clamp-2">Expected: {res.expectedOutput}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium">No submissions yet. Run your code to see results.</p>
                  )}

                  {!isSubmitted && (
                    <button onClick={handleSubmit} className="w-full mt-2 bg-[#1D1D35] text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg flex items-center justify-center gap-2">
                      <Trophy size={16}/> Finalize & Submit
                    </button>
                  )}
                  {isSubmitted && (
                     <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-4 text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        <h3 className="text-emerald-700 font-extrabold">Finalized!</h3>
                     </div>
                  )}
                </div>
            )}
            
          </div>
        </div>

        {/* Main Area - 8 Cols */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800 relative">
           
           {isCoding ? (
             <>
               <div className="h-12 bg-slate-950 flex items-center px-4 justify-between shrink-0">
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                 </div>
                 <span className="text-slate-400 text-xs font-mono font-bold uppercase tracking-widest">javascript Environment</span>
               </div>
               
               <div className="flex-1 min-h-0">
                <CodeEditor 
                  questionId={activeQuestion.id || 'q1'} 
                  language="javascript"
                  onRun={(data) => setResults(data)}
                />
               </div>
             </>
           ) : (
             <div className="flex-1 bg-white p-8 md:p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-8">
                   <div className="space-y-4">
                     <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Multiple Choice</span>
                     <h1 className="text-2xl md:text-3xl font-extrabold text-[#1D1D35] leading-tight mt-2">{activeQuestion.title}</h1>
                     <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
                   </div>

                   <div className="space-y-4 pt-4">
                      {activeQuestion.options?.map((opt: string, idx: number) => {
                         const isSelected = selectedOptions[currentQuestionIdx] === idx;
                         const showResults = isSubmitted && examInfo.resultsPublished;
                         const showCorrect = showResults && activeQuestion.correctOption === idx;
                         const showWrong = showResults && isSelected && activeQuestion.correctOption !== idx;
                         
                         let stateClass = "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md";
                         if (isSelected && !isSubmitted) stateClass = "bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm";
                         if (showCorrect) stateClass = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-emerald-800";
                         if (showWrong) stateClass = "bg-rose-50 border-rose-500 ring-1 ring-rose-500 text-rose-800";

                         return (
                           <button 
                             key={idx}
                             onClick={() => handleOptionSelect(idx)}
                             disabled={isSubmitted}
                             className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${stateClass}`}
                           >
                              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                 isSelected && !isSubmitted ? 'bg-blue-600 text-white' : 
                                 showCorrect ? 'bg-emerald-500 text-white' :
                                 showWrong ? 'bg-rose-500 text-white' :
                                 'bg-slate-100 text-slate-500'
                              }`}>
                                 {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="font-medium text-lg">{opt}</span>
                              
                              {showCorrect && <CheckCircle2 className="ml-auto text-emerald-500" size={24}/>}
                              {showWrong && <XCircle className="ml-auto text-rose-500" size={24}/>}
                           </button>
                         )
                      })}
                   </div>

                   <div className="flex justify-between items-center pt-8 mt-12 border-t border-slate-100">
                      <button 
                        onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                        disabled={currentQuestionIdx === 0}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                         Previous
                      </button>
                      <button 
                        onClick={() => setCurrentQuestionIdx(Math.min(questions.length - 1, currentQuestionIdx + 1))}
                        disabled={currentQuestionIdx === questions.length - 1}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-200"
                      >
                         Next Question
                      </button>
                   </div>
                </div>
             </div>
           )}
           
        </div>

      </div>
    </div>
  );
}
