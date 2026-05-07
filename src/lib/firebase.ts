import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignIn, 
  createUserWithEmailAndPassword as firebaseCreateUser,
  onAuthStateChanged as firebaseOnAuth,
  signOut as firebaseSignOut,
  GoogleAuthProvider as FirebaseGoogleProvider,
  signInWithPopup as firebasePopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc as firebaseDoc, 
  getDoc as firebaseGetDoc, 
  setDoc as firebaseSetDoc, 
  collection as firebaseCollection,
  onSnapshot as firebaseSnapshot,
  addDoc as firebaseAddDoc,
  updateDoc as firebaseUpdateDoc,
  deleteDoc as firebaseDeleteDoc,
  getDocs as firebaseGetDocs,
  query as firebaseQuery,
  where as firebaseWhere
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { MOCK_USERS, MOCK_COURSES } from './mock-data';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000:web:000',
};

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Initialize Firebase (Gracefully handle empty config)
let app: any = null;
let auth: any = IS_MOCK ? { 
  currentUser: null,
  onAuthStateChanged: (cb: any) => {
    // Simulate initial load
    setTimeout(() => cb(null), 500);
    return () => {};
  },
  signOut: async () => { console.log('[Mock-Auth] Signed out'); }
} : null;
let db: any = IS_MOCK ? { appId: 'mock-db' } : null;
let storage: any = {};

if (!IS_MOCK) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[Firebase-Client] Live Firebase initialized.');
  } catch (error) {
    console.warn('[Firebase-Client] Initialization failed. Falling back to Mock.');
  }
} else {
  console.log('[Firebase-Client] 🛠️ MOCK MODE ENABLED. Bypassing SDK init.');
}

// Custom Wrappers to Intercept SDK Calls
export const signInWithEmailAndPassword = async (a: any, email: string, p: string) => {
  if (IS_MOCK) {
    console.log('[Mock-Auth] Attempting login for:', email);
    const user = (MOCK_USERS as any)[email];
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_user', JSON.stringify(user));
        // Trigger auth state change immediately
        triggerAuthListeners(user);
      }
      return { user };
    }
    throw new Error('Mock authentication failed: User not found in MOCK_USERS');
  }
  return firebaseSignIn(auth, email, p);
};

export const createUserWithEmailAndPassword = async (a: any, email: string, p: string) => {
  if (IS_MOCK) {
    const user = { uid: `mock-${Date.now()}`, email };
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_user', JSON.stringify(user));
      triggerAuthListeners(user);
    }
    return { user };
  }
  return firebaseCreateUser(auth, email, p);
};

let authListeners: any[] = [];
const triggerAuthListeners = (user: any) => {
  authListeners.forEach(cb => cb(user));
};

export const onAuthStateChanged = (a: any, cb: any) => {
  if (IS_MOCK) {
    authListeners.push(cb);
    // Initial check
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_user');
      const user = stored ? JSON.parse(stored) : null;
      setTimeout(() => cb(user), 500);
    } else {
      setTimeout(() => cb(null), 500);
    }
    return () => {
      authListeners = authListeners.filter(l => l !== cb);
    };
  }
  return firebaseOnAuth(auth, cb);
};

export const signOut = async (a: any) => {
  if (IS_MOCK) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_user');
      triggerAuthListeners(null);
    }
    return;
  }
  return firebaseSignOut(auth);
};

export const signInWithPopup = async (a: any, p: any) => {
  if (IS_MOCK) {
    const user = (MOCK_USERS as any)['student@academetrics.io'];
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_user', JSON.stringify(user));
      triggerAuthListeners(user);
    }
    return { user };
  }
  return firebasePopup(auth, p);
};

// --- Firestore Wrappers ---

// --- In-Memory Store with LocalStorage Persistence for Mock Mode ---
const getInitialStore = () => {
  const base = {
    users: Object.values(MOCK_USERS),
    subjects: MOCK_COURSES,
    exams: [],
    faculty_materials: [],
    announcements: [],
    student_exams: []
  };
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('academetrics_mock_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return base;
      }
    }
  }
  return base;
};

let MOCK_STORE: Record<string, any[]> = getInitialStore();

const saveStore = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('academetrics_mock_store', JSON.stringify(MOCK_STORE));
  }
};

const LISTENERS: Record<string, Function[]> = {};

const triggerListeners = (path: string) => {
  saveStore();
  if (LISTENERS[path]) {
    const data = MOCK_STORE[path] || [];
    const snapshot = {
      docs: data.map(d => ({ id: d.id || d.uid, data: () => d }))
    };
    LISTENERS[path].forEach(cb => cb(snapshot));
  }
};

// --- Cross-Tab Sync for Mock Mode ---
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'academetrics_mock_store' && e.newValue) {
      try {
        const newData = JSON.parse(e.newValue);
        // Update local MOCK_STORE
        Object.assign(MOCK_STORE, newData);
        // Trigger all active listeners to refresh UI in this tab
        Object.keys(LISTENERS).forEach(path => {
          const data = MOCK_STORE[path] || [];
          const snapshot = {
            docs: data.map(d => ({ id: d.id || d.uid, data: () => d }))
          };
          LISTENERS[path].forEach(cb => cb(snapshot));
        });
      } catch (err) {
        console.error('Failed to sync mock store across tabs:', err);
      }
    }
  });
}

// --- Firestore Wrappers ---

export const doc = (d: any, coll: string, id: string) => {
  if (IS_MOCK) return { type: 'mock-doc', coll, id };
  return firebaseDoc(db, coll, id);
};

export const getDoc = async (docRef: any) => {
  if (IS_MOCK && docRef.type === 'mock-doc') {
    const data = MOCK_STORE[docRef.coll] || [];
    const item = data.find(u => (u.id || u.uid) === docRef.id);
    return {
      exists: () => !!item,
      data: () => item || {},
    };
  }
  return firebaseGetDoc(docRef);
};

export const setDoc = async (docRef: any, data: any) => {
  if (IS_MOCK) {
    const coll = docRef.coll;
    if (!MOCK_STORE[coll]) MOCK_STORE[coll] = [];
    const index = MOCK_STORE[coll].findIndex(item => (item.id || item.uid) === docRef.id);
    const newData = { ...data, id: docRef.id };
    if (index > -1) {
      MOCK_STORE[coll][index] = newData;
    } else {
      MOCK_STORE[coll].push(newData);
    }
    triggerListeners(coll);
    return;
  }
  return firebaseSetDoc(docRef, data);
};

export const collection = (d: any, path: string) => {
  if (IS_MOCK) return { type: 'mock-coll', path };
  return firebaseCollection(db, path);
};

export const onSnapshot = (ref: any, cb: any) => {
  if (IS_MOCK) {
    const path = ref.path || ref.coll;
    if (!LISTENERS[path]) LISTENERS[path] = [];
    
    const wrappedCb = (snapshot: any) => {
      // Apply filters if any
      if (ref.constraints) {
        let filteredDocs = snapshot.docs;
        ref.constraints.forEach((c: any) => {
          if (c.field && c.op === '==' ) {
            filteredDocs = filteredDocs.filter((d: any) => d.data()[c.field] === c.value);
          }
        });
        cb({ docs: filteredDocs });
      } else {
        cb(snapshot);
      }
    };

    LISTENERS[path].push(wrappedCb);
    
    // Initial trigger
    const data = MOCK_STORE[path] || [];
    setTimeout(() => {
      let initialData = data;
      if (ref.constraints) {
        ref.constraints.forEach((c: any) => {
          if (c.field && c.op === '==' ) {
            initialData = initialData.filter((d: any) => d[c.field] === c.value);
          }
        });
      }
      cb({
        docs: initialData.map(d => ({ id: d.id || d.uid, data: () => d }))
      });
    }, 100);
    
    return () => {
      LISTENERS[path] = LISTENERS[path].filter(l => l !== wrappedCb);
    };
  }
  return firebaseSnapshot(ref, cb);
};

export const addDoc = async (collRef: any, data: any) => {
  if (IS_MOCK) {
    const path = collRef.path;
    if (!MOCK_STORE[path]) MOCK_STORE[path] = [];
    const newDoc = { ...data, id: `mock-${Date.now()}` };
    MOCK_STORE[path].push(newDoc);
    triggerListeners(path);
    return { id: newDoc.id };
  }
  return firebaseAddDoc(collRef, data);
};

export const updateDoc = async (docRef: any, data: any) => {
  if (IS_MOCK) {
    const coll = docRef.coll;
    if (!MOCK_STORE[coll]) return;
    const index = MOCK_STORE[coll].findIndex(item => (item.id || item.uid) === docRef.id);
    if (index > -1) {
      MOCK_STORE[coll][index] = { ...MOCK_STORE[coll][index], ...data };
      triggerListeners(coll);
    }
    return;
  }
  return firebaseUpdateDoc(docRef, data);
};

export const deleteDoc = async (docRef: any) => {
  if (IS_MOCK) {
    const coll = docRef.coll;
    if (!MOCK_STORE[coll]) return;
    MOCK_STORE[coll] = MOCK_STORE[coll].filter(item => (item.id || item.uid) !== docRef.id);
    triggerListeners(coll);
    return;
  }
  return firebaseDeleteDoc(docRef);
};

export const getDocs = async (ref: any) => {
  if (IS_MOCK) {
    const path = ref.path || ref.coll;
    let data = MOCK_STORE[path] || [];
    
    // Apply filters
    if (ref.constraints) {
      ref.constraints.forEach((c: any) => {
        if (c.field && c.op === '==' ) {
          data = data.filter((d: any) => d[c.field] === c.value);
        }
      });
    }

    return {
      empty: data.length === 0,
      docs: data.map(d => ({ id: d.id || d.uid, data: () => d }))
    };
  }
  return firebaseGetDocs(ref);
};

export const query = (ref: any, ...constraints: any[]) => {
  if (IS_MOCK) return { ...ref, constraints: constraints.filter(c => c && c.field) };
  return firebaseQuery(ref, ...constraints);
};

export const where = (field: string, op: string, value: any) => {
  if (IS_MOCK) return { field, op, value };
  return firebaseWhere(field, op as any, value);
};

export const GoogleAuthProvider = IS_MOCK ? class {} : FirebaseGoogleProvider;

export { auth, db, storage };
