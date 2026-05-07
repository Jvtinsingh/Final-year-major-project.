'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  onSnapshot, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc 
} from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

// Type Definitions
export interface StudentExam {
  id: string;
  title: string;
  type: string;
  subject: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  startTime: string;
  durationMinutes: number;
  score?: number;
  totalMarks?: number;
  resultsPublished?: boolean;
}

// ... skipped unneeded interfaces ...
export interface StudentAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  senderName?: string;
  senderRole?: string;
}

export interface StudentMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'video' | 'file';
  url: string;
  postedBy: string;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  classAverage: number;
}

interface StudentContextProps {
  exams: StudentExam[];
  announcements: StudentAnnouncement[];
  materials: StudentMaterial[];
  performance: SubjectPerformance[];
  stats: {
    enrolledExams: number;
    averageScore: number;
    highestScore: number;
    completedExams: number;
    inProgressExams: number;
    lowestMarks: number;
  };
  joinExam: (code: string) => Promise<void>;
  joinCourse: (code: string) => Promise<void>;
  submitExam: (examId: string, score: number, totalMarks: number) => Promise<void>;
  enrolledSubjectIds: string[];
  enrolledSubjects: any[];
}

const StudentContext = createContext<StudentContextProps | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  // Mock Data
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [announcements, setAnnouncements] = useState<StudentAnnouncement[]>([]);
  const [materials, setMaterials] = useState<StudentMaterial[]>([]);
  const [performance, setPerformance] = useState<SubjectPerformance[]>([]);
  const [enrolledSubjectIds, setEnrolledSubjectIds] = useState<string[]>([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState<any[]>([]);

  useEffect(() => {
    if (!userData) {
      setExams([]);
      setAnnouncements([]);
      setMaterials([]);
      return;
    }

    // Enrollments Listener
    const enrollQuery = query(collection(db, 'enrollments'), where('studentId', '==', userData.uid));
    const unsubEnroll = onSnapshot(enrollQuery, async (snap: any) => {
      const ids = snap.docs.map((d: any) => d.data().subjectId);
      setEnrolledSubjectIds(ids);
      
      // Fetch full subject details for each ID
      if (ids.length > 0) {
        const subjectsData = await Promise.all(ids.map(async (sid: string) => {
          const sDoc = await getDoc(doc(db, 'subjects', sid)) as any;
          return sDoc.exists() ? { id: sDoc.id, ...sDoc.data() } : null;
        }));
        setEnrolledSubjects(subjectsData.filter(s => s !== null));
      } else {
        setEnrolledSubjects([]);
      }
    });

    const q = query(collection(db, 'student_exams'), where('studentId', '==', userData.uid));
    const unsubStudentExams = onSnapshot(q, async (snap: any) => {
      const studentExamsData = snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any);
      const enrichedExams = await Promise.all(studentExamsData.map(async (se: any) => {
        const examDoc = await getDoc(doc(db, 'exams', se.examId)) as any;
        return { ...se, resultsPublished: examDoc.exists() ? examDoc.data().resultsPublished : false };
      }));
      setExams(enrichedExams);
    });

    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snap: any) => {
      const all = snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any);
      const filtered = all.filter((a: any) => !a.subjectId || enrolledSubjectIds.includes(a.subjectId));
      setAnnouncements(filtered);
    });

    const unsubMaterials = onSnapshot(collection(db, 'student_materials'), (snap: any) => {
      const all = snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any);
      const filtered = all.filter((m: any) => !m.subjectId || enrolledSubjectIds.includes(m.subjectId));
      setMaterials(filtered);
    });
    
    return () => { unsubStudentExams(); unsubAnnouncements(); unsubMaterials(); unsubEnroll(); };
  }, [userData, enrolledSubjectIds]);

  useEffect(() => {
    // Calculate performance based on published results
    const perfMap: Record<string, { totalScore: number; count: number; totalMax: number }> = {};
    
    exams.filter(e => e.status === 'completed' && e.resultsPublished).forEach(e => {
       if (!perfMap[e.subject]) {
          perfMap[e.subject] = { totalScore: 0, count: 0, totalMax: 0 };
       }
       perfMap[e.subject].totalScore += e.score || 0;
       perfMap[e.subject].totalMax += e.totalMarks || 100;
       perfMap[e.subject].count += 1;
    });

    const newPerformance = Object.entries(perfMap).map(([subject, data]) => ({
       subject,
       score: Math.round((data.totalScore / data.totalMax) * 100),
       classAverage: 75 // Mock class average
    }));

    setPerformance(newPerformance);
  }, [exams]);

  const stats = {
    enrolledExams: exams.length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    inProgressExams: exams.filter(e => e.status === 'in_progress').length,
    averageScore: exams.filter(e => e.status === 'completed' && e.resultsPublished).length > 0
      ? exams.filter(e => e.status === 'completed' && e.resultsPublished).reduce((acc, curr) => acc + (curr.score || 0), 0) / exams.filter(e => e.status === 'completed' && e.resultsPublished).length
      : 0,
    highestScore: exams.filter(e => e.status === 'completed' && e.resultsPublished).length > 0
      ? Math.max(...exams.filter(e => e.status === 'completed' && e.resultsPublished).map(e => e.score || 0))
      : 0,
    lowestMarks: exams.filter(e => e.status === 'completed' && e.resultsPublished).length > 0
      ? Math.min(...exams.filter(e => e.status === 'completed' && e.resultsPublished).map(e => e.score || 0))
      : 0,
  };

  const joinExam = async (code: string) => {
    if (!code || !userData) throw new Error('Exam code and active session are required.');
    
    // Look up the actual exam from the faculty's 'exams' collection
    const q = query(collection(db, 'exams'), where('examCode', '==', code));
    const snapshot = await getDocs(q) as any;
    
    if (snapshot.empty) {
      throw new Error('Invalid exam code! Please check and try again.');
    }
    
    const foundDoc = snapshot.docs[0];
    const foundExam = foundDoc.data();
    const docId = `${userData.uid}_${foundDoc.id}`;
    
    // Check if enrolled
    if (exams.some(e => e.id === foundDoc.id)) {
      throw new Error("You are already enrolled in this exam!");
    }
    
    // Enroll the student by writing a cloned metadata document to student_exams
    const newExam: StudentExam = {
      id: foundDoc.id,
      title: foundExam.title || 'Untitled Exam',
      type: foundExam.type || 'multiple_choice',
      subject: 'External',
      status: 'upcoming',
      startTime: foundExam.startDate || new Date().toISOString(),
      durationMinutes: foundExam.durationMinutes || 60,
      totalMarks: foundExam.totalMarks || 100,
      resultsPublished: foundExam.resultsPublished || false
    };
    
    await setDoc(doc(db, 'student_exams', docId), { 
      ...newExam, 
      studentId: userData.uid, 
      studentName: userData.displayName, 
      studentEmail: userData.email,
      examId: foundDoc.id 
    });
  };

  const joinCourse = async (code: string) => {
    if (!code || !userData) throw new Error('Course code and active session are required.');
    const q = query(collection(db, 'subjects'), where('code', '==', code));
    const snap = await getDocs(q) as any;
    if (snap.empty) throw new Error('Invalid course code!');
    const subjectId = snap.docs[0].id;
    if (enrolledSubjectIds.includes(subjectId)) throw new Error('Already enrolled!');
    await addDoc(collection(db, 'enrollments'), {
      studentId: userData.uid,
      subjectId,
      joinedAt: new Date().toISOString()
    });
  };

  const submitExam = async (examId: string, score: number, totalMarks: number) => {
    if (!userData) return;
    const docId = `${userData.uid}_${examId}`;
    await updateDoc(doc(db, 'student_exams', docId), {
      status: 'completed',
      score,
      totalMarks,
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <StudentContext.Provider value={{ exams, announcements, materials, performance, stats, joinExam, joinCourse, submitExam, enrolledSubjectIds, enrolledSubjects }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
