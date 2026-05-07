'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  db,
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from '@/lib/firebase';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// Type Definitions
export interface Exam {
  id: string;
  title: string;
  type: string;
  subjectId: string;
  durationMinutes: number;
  totalMarks: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  examCode?: string; // Newly added code
  status: 'published' | 'draft';
  questionsCount: number;
  questions?: any[];
  resultsPublished?: boolean;
}

// ... skipped unneeded interfaces up to Exam interface ...
export interface Material {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  url: string;
  type: 'file' | 'video';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  senderName?: string;
  senderRole?: string;
  subjectId?: string; // Optional: Link to a specific course/subject
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  credits: number;
}

interface FacultyContextProps {
  exams: Exam[];
  materials: Material[];
  announcements: Announcement[];
  subjects: Subject[];
  submissions: any[];
  addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'examCode'>) => void;
  deleteExam: (id: string) => void;
  toggleExamStatus: (id: string) => void;
  publishResults: (id: string) => void;
  addMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  stats: {
    totalExams: number;
    publishedCount: number;
    draftCount: number;
    totalSubjects: number;
    totalSubmissions: number;
    gradedCount: number;
    totalMaterials: number;
    announcementCount: number;
    topPerformers: any[];
    needsAttention: any[];
    averageScore: number;
    participationRate: number;
  }
}

const FacultyContext = createContext<FacultyContextProps | undefined>(undefined);

export function FacultyProvider({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  // Mock Data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (!userData) return;

    const unsubExams = onSnapshot(collection(db, 'exams'), (snap: any) => setExams(snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as any)));
    const unsubMaterials = onSnapshot(collection(db, 'faculty_materials'), (snap: any) => setMaterials(snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as any)));
    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snap: any) => setAnnouncements(snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as any)));

    // Filter subjects by the logged-in faculty
    const subjectsQuery = query(collection(db, 'subjects'), where('facultyId', '==', userData.uid));
    const unsubSubjects = onSnapshot(subjectsQuery, (snap: any) => setSubjects(snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as any)));

    const unsubSubmissions = onSnapshot(collection(db, 'student_exams'), (snap: any) => setSubmissions(snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as any)));

    return () => { unsubExams(); unsubMaterials(); unsubAnnouncements(); unsubSubjects(); unsubSubmissions(); };
  }, [userData]);

  const addExam = async (exam: Omit<Exam, 'id' | 'createdAt' | 'examCode'>) => {
    try {
      // Direct Firestore call now that emails are removed
      const examCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await addDoc(collection(db, 'exams'), {
        ...exam,
        examCode,
        examsCount: 0,
        resultsPublished: false,
        createdAt: new Date().toISOString()
      });
      toast.success('Exam successfully created and published!');
    } catch (error: any) {
      console.error('[FacultyContext] addExam error:', error);
      toast.error('Failed to create exam.');
    }
  };

  const addMaterial = async (material: Omit<Material, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'faculty_materials'), { ...material, createdAt: new Date().toISOString() });
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'announcements'), {
      ...announcement,
      createdAt: new Date().toISOString(),
      senderName: userData?.displayName || 'Faculty Member',
      senderRole: 'Faculty'
    });
  };
  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
  };
  const deleteExam = async (id: string) => {
    await deleteDoc(doc(db, 'exams', id));
  };

  const toggleExamStatus = async (id: string) => {
    const exam = exams.find(e => e.id === id);
    if (exam) {
      await updateDoc(doc(db, 'exams', id), { status: exam.status === 'published' ? 'draft' : 'published' });
    }
  };

  const publishResults = async (id: string) => {
    await updateDoc(doc(db, 'exams', id), { resultsPublished: true });
  };

  const stats = {
    totalExams: exams.length,
    publishedCount: exams.filter(e => e.status === 'published').length,
    draftCount: exams.filter(e => e.status === 'draft').length,
    totalSubjects: subjects.length,
    totalSubmissions: submissions.filter(s => s.status === 'completed').length,
    gradedCount: submissions.filter(s => s.status === 'completed').length, // All are auto-graded for now
    totalMaterials: materials.length,
    announcementCount: announcements.length,
    topPerformers: [...submissions]
      .filter(s => s.status === 'completed')
      .sort((a, b) => (b.score / b.totalMarks) - (a.score / a.totalMarks))
      .slice(0, 3),
    needsAttention: submissions.filter(s => s.status === 'completed' && (s.score / s.totalMarks) < 0.4),
    averageScore: submissions.filter(s => s.status === 'completed').length > 0
      ? (submissions.filter(s => s.status === 'completed').reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / submissions.filter(s => s.status === 'completed').length) * 100
      : 0,
    participationRate: 100 // Mock for now
  };

  return (
    <FacultyContext.Provider value={{ exams, materials, announcements, subjects, submissions, addExam, deleteExam, toggleExamStatus, publishResults, addMaterial, addAnnouncement, deleteAnnouncement, stats }}>
      {children}
    </FacultyContext.Provider>
  );
}

export function useFaculty() {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error('useFaculty must be used within a FacultyProvider');
  }
  return context;
}