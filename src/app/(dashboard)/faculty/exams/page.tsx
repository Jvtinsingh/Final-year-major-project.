'use client';

import React, { useState, useRef } from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { motion } from 'framer-motion';
import { FileEdit, Plus, Calendar, Clock, BookOpen, Hash, Copy, CheckCircle, Eye, Trash2, ToggleLeft, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

type ViewState = 'list' | 'details' | 'questions';

export default function ExamsPage() {
  const { exams, subjects, addExam, deleteExam, toggleExamStatus, publishResults } = useFaculty();
  const [view, setView] = useState<ViewState>('list');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'multiple_choice',
    subjectId: subjects[0]?.id || '',
    durationMinutes: 60,
    totalMarks: 100,
    startDate: '',
    endDate: '',
    questions: [] as any[]
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (code: string | undefined) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    let needsReset = false;
    if (formData.questions.length === 0) {
      needsReset = true;
    } else {
      // If type changed, old questions array might not have appropriate fields
      const q = formData.questions[0];
      if ((formData.type === 'multiple_choice' || formData.type === 'quiz') && !q.options) needsReset = true;
      if (formData.type === 'coding' && !q.testCases) needsReset = true;
    }

    if (needsReset) {
       let templates: any[] = [];
       if (formData.type === 'multiple_choice' || formData.type === 'quiz') {
          templates = [{ id: 1, title: '', marks: 10, options: ['', '', '', ''], correctOption: 0 }];
       } else if (formData.type === 'coding') {
          templates = [{ id: 1, title: '', marks: 50, testCases: [{ input: '', output: '' }] }];
       } else {
          templates = [{ id: 1, title: '', marks: 20 }];
       }
       
       setFormData({ ...formData, questions: templates });
       setView('questions');
       return;
    }
    
    setView('questions');
  };

  const handleDeploy = () => {
    // Validate
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question.');
      return;
    }

    addExam({
      title: formData.title,
      type: formData.type,
      subjectId: formData.subjectId,
      durationMinutes: formData.durationMinutes,
      totalMarks: formData.totalMarks,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'published',
      questionsCount: formData.questions.length,
      questions: formData.questions
    });

    toast.success('Exam successfully deployed & published!');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'multiple_choice',
      subjectId: subjects[0]?.id || '',
      durationMinutes: 60,
      totalMarks: 100,
      startDate: '',
      endDate: '',
      questions: []
    });
    setView('list');
    setImportText('');
  };

  const handleBulkImport = () => {
    if (!importText.trim()) {
      toast.error('Please enter some questions to import');
      return;
    }

    const lines = importText.trim().split('\n');
    const newQuestions: any[] = [];
    let skippedLines = 0;

    lines.forEach((line) => {
      const parts = line.split('|').map(p => p.trim());
      
      // Expected format: Question | Opt1 | Opt2 | Opt3 | Opt4 | CorrectIndex (0-3)
      if (parts.length >= 6) {
        const title = parts[0];
        const options = parts.slice(1, 5);
        const correctOption = parseInt(parts[5]);

        if (title && options.every(o => o) && !isNaN(correctOption) && correctOption >= 0 && correctOption <= 3) {
          newQuestions.push({
            id: Math.random(),
            title,
            marks: 10,
            options,
            correctOption
          });
        } else {
          skippedLines++;
        }
      } else if (line.trim()) {
        skippedLines++;
      }
    });

    if (newQuestions.length > 0) {
      setFormData({
        ...formData,
        questions: [...formData.questions, ...newQuestions]
      });
      toast.success(`Successfully imported ${newQuestions.length} questions!`);
      if (skippedLines > 0) {
        toast.error(`Skipped ${skippedLines} lines due to invalid format.`);
      }
      setIsImportModalOpen(false);
      setImportText('');
    } else {
      toast.error('No valid questions found in the provided text.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      toast.error('Please upload a .txt or .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(prev => prev ? prev + '\n' + content : content);
        toast.success(`Loaded content from ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
             <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
               <FileEdit size={28} />
             </div>
             Exam Management
           </h1>
           <p className="text-slate-500 font-medium mt-2">Deploy, manage, and distribute your academic assessments.</p>
        </div>
        {view === 'list' && (
          <button 
            onClick={() => setView('details')}
            className="bg-[#0B4CEB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Create Exam
          </button>
        )}
      </div>

      {view === 'list' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden"
        >
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold">
                      <th className="p-5 font-bold">Title</th>
                      <th className="p-5 font-bold">Code</th>
                      <th className="p-5 font-bold">Type</th>
                      <th className="p-5 font-bold">Subject</th>
                      <th className="p-5 font-bold">Questions</th>
                      <th className="p-5 font-bold">Duration</th>
                      <th className="p-5 font-bold">Marks</th>
                      <th className="p-5 font-bold">Status</th>
                      <th className="p-5 font-bold text-center">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   {exams.map(exam => {
                      const subject = subjects.find(s => s.id === exam.subjectId);
                      return (
                         <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-5 font-bold text-[#1D1D35]">{exam.title}</td>
                            <td className="p-5">
                               {exam.examCode ? (
                                  <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100/50 font-mono text-xs font-bold tracking-widest">
                                     {exam.examCode}
                                     <button onClick={() => handleCopy(exam.examCode)} className="text-indigo-400 hover:text-indigo-600 transition" title="Copy Code">
                                        <Copy size={14} />
                                     </button>
                                  </div>
                               ) : (
                                  <span className="text-slate-400 font-medium">-</span>
                               )}
                            </td>
                            <td className="p-5">
                               <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                  {exam.type === 'multiple_choice' ? 'MCQ' : exam.type}
                               </span>
                            </td>
                            <td className="p-5 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{subject?.name || 'N/A'}</td>
                            <td className="p-5 text-slate-600 font-medium">{exam.questionsCount || 0}</td>
                            <td className="p-5 text-slate-600 font-medium">{exam.durationMinutes} min</td>
                            <td className="p-5 text-slate-600 font-medium">{exam.totalMarks}</td>
                            <td className="p-5">
                               <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${exam.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {exam.status === 'published' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                  {exam.status === 'published' ? 'Published' : 'Draft'}
                               </span>
                            </td>
                            <td className="p-5">
                               <div className="flex flex-col gap-1.5 items-center">
                                  <button onClick={() => toast("View Exam Mode not implemented in mockup")} className="w-24 py-1.5 bg-[#0B4CEB] hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition">Edit/View</button>
                                  <button onClick={() => toggleExamStatus(exam.id)} className="w-24 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded shadow-sm transition">
                                     {exam.status === 'published' ? 'Unpublish' : 'Publish'}
                                  </button>
                                  {exam.status === 'published' && !exam.resultsPublished && (
                                     <button 
                                       onClick={() => { if(confirm('Publish results for all students?')) publishResults(exam.id) }} 
                                       className="w-24 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded shadow-sm transition"
                                     >
                                        Publish Results
                                     </button>
                                  )}
                                  <button onClick={() => { if(confirm('Delete this exam?')) deleteExam(exam.id) }} className="w-24 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow-sm transition">Delete</button>
                               </div>
                            </td>
                         </tr>
                      );
                   })}
                   {exams.length === 0 && (
                      <tr>
                         <td colSpan={9} className="p-12 text-center text-slate-400 font-medium">No exams configured yet.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </motion.div>
      )}

      {view === 'details' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
             <h2 className="text-xl font-bold text-[#1D1D35]">Step 1: Exam Details</h2>
             <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1"><ArrowLeft size={16}/> Cancel</button>
          </div>
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Exam Title</label>
                 <input type="text" required placeholder="e.g., Midterm Evaluation" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder:text-slate-600 font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Exam Type</label>
                 <select className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium cursor-pointer" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                   <option value="multiple_choice">Multiple Choice</option>
                   <option value="quiz">Quiz Form</option>
                   <option value="coding">Coding Assessment</option>
                   <option value="subjective">Subjective / Essay</option>
                 </select>
               </div>
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-bold text-slate-700">Subject Area</label>
                 <select className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium cursor-pointer" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Duration (mins)</label>
                 <input type="number" min="1" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Total Marks</label>
                 <input type="number" min="1" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Start Window</label>
                 <input type="datetime-local" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">End Window</label>
                 <input type="datetime-local" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
               </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
               <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-[#1D1D35] hover:bg-black transition shadow-lg">
                 Next: Draft Questions
               </button>
            </div>
          </form>
        </motion.div>
      )}

      {view === 'questions' && (
         <motion.div 
           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
           className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto"
         >
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <div>
                  <h2 className="text-xl font-bold text-[#1D1D35]">Step 2: Exam Builder</h2>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">{formData.type.replace('_', ' ')} Format</p>
               </div>
               <button onClick={() => setView('details')} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1"><ArrowLeft size={16}/> Back</button>
            </div>

            <div className="space-y-6">
               {formData.questions.map((q, qIndex) => (
                  <div key={q.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                     
                     <div className="flex gap-4">
                       <div className="flex-1 space-y-4">
                         {/* Question Title */}
                         <div>
                            <label className="text-xs font-bold text-slate-500">Question {qIndex + 1}</label>
                            <input type="text" placeholder="Enter question description..." className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder:text-slate-600 font-medium" value={q.title} onChange={e => {
                               const qs = [...formData.questions];
                               qs[qIndex].title = e.target.value;
                               setFormData({...formData, questions: qs});
                            }}/>
                         </div>

                         {/* MCQ specific format */}
                         {(formData.type === 'multiple_choice' || formData.type === 'quiz') && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                               {(q.options || []).map((opt: string, oIndex: number) => (
                                 <div key={oIndex} className="flex items-center gap-2">
                                   <input type="radio" name={`correct-${qIndex}`} checked={q.correctOption === oIndex} onChange={() => {
                                      const qs = [...formData.questions];
                                      qs[qIndex].correctOption = oIndex;
                                      setFormData({...formData, questions: qs});
                                   }} className="w-4 h-4 text-emerald-500 focus:ring-emerald-500" />
                                   <input type="text" placeholder={`Option ${oIndex + 1}`} className="flex-1 text-sm bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder:text-slate-600 font-medium" value={opt} onChange={e => {
                                      const qs = [...formData.questions];
                                      qs[qIndex].options[oIndex] = e.target.value;
                                      setFormData({...formData, questions: qs});
                                   }}/>
                                 </div>
                               ))}
                            </div>
                         )}

                         {/* Coding specific format */}
                         {formData.type === 'coding' && (
                            <div className="space-y-3 pt-2">
                               <div className="p-4 bg-slate-900 rounded-xl space-y-3">
                                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">
                                     <span>Test Cases Array</span>
                                     <button type="button" className="text-emerald-400 hover:text-emerald-300" onClick={() => {
                                        const qs = [...formData.questions];
                                        qs[qIndex].testCases.push({ input: '', output: '' });
                                        setFormData({...formData, questions: qs});
                                     }}>+ Add Case</button>
                                  </div>
                                  {(q.testCases || []).map((tc: any, tcIndex: number) => (
                                     <div key={tcIndex} className="flex gap-4">
                                        <input type="text" placeholder="Expected Input (e.g., [2,7,11,15], 9)" className="flex-1 bg-slate-800 border border-slate-700 text-emerald-400 placeholder:text-emerald-800 font-mono text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={tc.input} onChange={e => {
                                          const qs = [...formData.questions];
                                          qs[qIndex].testCases[tcIndex].input = e.target.value;
                                          setFormData({...formData, questions: qs});
                                        }}/>
                                        <input type="text" placeholder="Expected Output (e.g., [0,1])" className="flex-1 bg-slate-800 border border-slate-700 text-emerald-400 placeholder:text-emerald-800 font-mono text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={tc.output} onChange={e => {
                                          const qs = [...formData.questions];
                                          qs[qIndex].testCases[tcIndex].output = e.target.value;
                                          setFormData({...formData, questions: qs});
                                        }}/>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         )}

                       </div>
                       
                       <div className="w-24 shrink-0">
                         <label className="text-xs font-bold text-slate-500">Marks</label>
                         <input type="number" min="1" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold text-black" value={q.marks} onChange={e => {
                            const qs = [...formData.questions];
                            qs[qIndex].marks = parseInt(e.target.value);
                            setFormData({...formData, questions: qs});
                         }}/>
                       </div>
                     </div>
                     
                     <button type="button" onClick={() => {
                        const qs = formData.questions.filter((_, i) => i !== qIndex);
                        setFormData({...formData, questions: qs});
                     }} className="absolute -right-3 -top-3 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow hover:bg-rose-500 hover:text-white">
                        <Trash2 size={14}/>
                     </button>
                  </div>
               ))}
               
                <div className="flex gap-4">
                  <button type="button" className="flex-1 py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition flex justify-center items-center gap-2" onClick={() => {
                     const qs = [...formData.questions];
                     if (formData.type === 'multiple_choice' || formData.type === 'quiz') qs.push({ id: Math.random(), title: '', marks: 10, options: ['', '', '', ''], correctOption: 0 });
                     else if (formData.type === 'coding') qs.push({ id: Math.random(), title: '', marks: 50, testCases: [{ input: '', output: '' }] });
                     else qs.push({ id: Math.random(), title: '', marks: 20 });
                     setFormData({...formData, questions: qs});
                  }}>
                     <Plus size={20}/>
                     Append Question block
                  </button>
                  
                  {(formData.type === 'multiple_choice' || formData.type === 'quiz') && (
                    <button 
                      type="button" 
                      onClick={() => setIsImportModalOpen(true)}
                      className="flex-1 py-4 border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-600 font-bold hover:bg-emerald-50 hover:border-emerald-400 transition flex justify-center items-center gap-2"
                    >
                      <Copy size={20}/>
                      Bulk Import MCQs
                    </button>
                  )}
                </div>
             </div>

             {/* Bulk Import Modal */}
             {isImportModalOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
                 >
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-slate-800">Bulk Import Questions</h3>
                     <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                       <Plus className="rotate-45" size={24} />
                     </button>
                   </div>
                   
                   <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-slate-500">
                        Paste your questions or upload a file:
                      </p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Upload size={14} />
                        Upload .txt / .csv
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".txt,.csv" 
                        className="hidden" 
                      />
                   </div>
                   
                   <p className="text-[10px] text-slate-400 mb-2 font-mono bg-slate-50 p-2 rounded border border-slate-100 uppercase tracking-tight">
                      Format: Question | Opt1 | Opt2 | Opt3 | Opt4 | CorrectIndex(0-3)
                   </p>
                   
                   <textarea
                     className="w-full h-64 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium text-sm"
                     placeholder="What is the capital of France? | Paris | London | Berlin | Rome | 0&#10;Which planet is known as the Red Planet? | Earth | Mars | Jupiter | Saturn | 1"
                     value={importText}
                     onChange={(e) => setImportText(e.target.value)}
                   />
                   
                   <div className="flex justify-end gap-3 mt-6">
                     <button 
                       onClick={() => setIsImportModalOpen(false)}
                       className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleBulkImport}
                       className="px-6 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                     >
                       Import Questions
                     </button>
                   </div>
                 </motion.div>
               </div>
             )}

            <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
               <button onClick={handleDeploy} className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                 Deploy Exam
               </button>
            </div>
         </motion.div>
      )}

    </div>
  );
}
