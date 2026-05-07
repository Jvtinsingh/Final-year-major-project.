'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  db, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from '@/lib/firebase';

// --- Types ---
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  facultyId: string; // references MockUser id
  credits: number;
}

export interface Section {
  id: string;
  name: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive';
}

interface AdminContextProps {
  users: MockUser[];
  semesters: Semester[];
  subjects: Subject[];
  sections: Section[];
  addUser: (user: Omit<MockUser, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<MockUser>) => void;
  deleteUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => void;
  addSemester: (sem: Omit<Semester, 'id'>) => void;
  updateSemesterStatus: (semId: string, status: 'upcoming' | 'ongoing' | 'completed') => void;
  deleteSemester: (semId: string) => void;
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (subId: string, updates: Partial<Subject>) => void;
  deleteSubject: (subId: string) => void;
  addSection: (sec: Omit<Section, 'id' | 'status'>) => void;
  updateSectionStatus: (secId: string, status: 'active' | 'inactive') => void;
  deleteSection: (secId: string) => void;
}

const initialUsers: MockUser[] = [];

const initialSemesters: Semester[] = [];

const initialSubjects: Subject[] = [];

const initialSections: Section[] = [];

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<MockUser[]>(initialUsers);
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [sections, setSections] = useState<Section[]>(initialSections);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap: any) => setUsers(snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any)));
    const unsubSem = onSnapshot(collection(db, 'semesters'), (snap: any) => setSemesters(snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any)));
    const unsubSub = onSnapshot(collection(db, 'subjects'), (snap: any) => setSubjects(snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any)));
    const unsubSec = onSnapshot(collection(db, 'sections'), (snap: any) => setSections(snap.docs.map((d: any) => ({id: d.id, ...d.data()}) as any)));
    return () => { unsubUsers(); unsubSem(); unsubSub(); unsubSec(); };
  }, []);

  const addUser = async (user: Omit<MockUser, 'id'>) => { await addDoc(collection(db, 'users'), user); };
  
  const updateUser = async (userId: string, updates: Partial<MockUser>) => {
    await updateDoc(doc(db, 'users', userId), updates);
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'inactive') => {
    await updateDoc(doc(db, 'users', userId), { status });
  };

  const addSemester = async (sem: Omit<Semester, 'id'>) => { await addDoc(collection(db, 'semesters'), sem); };
  
  const updateSemesterStatus = async (semId: string, status: 'upcoming' | 'ongoing' | 'completed') => {
    await updateDoc(doc(db, 'semesters', semId), { status });
  };

  const deleteSemester = async (semId: string) => {
    await deleteDoc(doc(db, 'semesters', semId));
  };

  const addSubject = async (sub: Omit<Subject, 'id'>) => { await addDoc(collection(db, 'subjects'), sub); };
  
  const updateSubject = async (subId: string, updates: Partial<Subject>) => {
    await updateDoc(doc(db, 'subjects', subId), updates);
  };

  const deleteSubject = async (subId: string) => {
    await deleteDoc(doc(db, 'subjects', subId));
  };

  const addSection = async (sec: Omit<Section, 'id' | 'status'>) => { 
    await addDoc(collection(db, 'sections'), { ...sec, status: 'active' }); 
  };

  const updateSectionStatus = async (secId: string, status: 'active' | 'inactive') => {
    await updateDoc(doc(db, 'sections', secId), { status });
  };

  const deleteSection = async (secId: string) => {
    await deleteDoc(doc(db, 'sections', secId));
  };

  return (
    <AdminContext.Provider value={{ 
      users, semesters, subjects, sections, 
      addUser, updateUser, deleteUser, updateUserStatus,
      addSemester, updateSemesterStatus, deleteSemester,
      addSubject, updateSubject, deleteSubject,
      addSection, updateSectionStatus, deleteSection 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
