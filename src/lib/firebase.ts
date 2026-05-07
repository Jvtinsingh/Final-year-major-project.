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
    if (user) return { user };
    throw new Error('Mock authentication failed: User not found in MOCK_USERS');
  }
  return firebaseSignIn(auth, email, p);
};

export const createUserWithEmailAndPassword = async (a: any, email: string, p: string) => {
  if (IS_MOCK) return { user: { uid: `mock-${Date.now()}`, email } };
  return firebaseCreateUser(auth, email, p);
};

export const onAuthStateChanged = (a: any, cb: any) => {
  if (IS_MOCK) return auth.onAuthStateChanged(cb);
  return firebaseOnAuth(auth, cb);
};

export const signOut = async (a: any) => {
  if (IS_MOCK) return auth.signOut();
  return firebaseSignOut(auth);
};

export const signInWithPopup = async (a: any, p: any) => {
  if (IS_MOCK) return { user: (MOCK_USERS as any)['student@academetrics.io'] };
  return firebasePopup(auth, p);
};

// --- Firestore Wrappers ---

export const doc = (d: any, coll: string, id: string) => {
  if (IS_MOCK) return { type: 'mock-doc', coll, id };
  return firebaseDoc(db, coll, id);
};

export const getDoc = async (docRef: any) => {
  if (IS_MOCK && docRef.type === 'mock-doc') {
    const user = Object.values(MOCK_USERS).find(u => u.uid === docRef.id);
    return {
      exists: () => !!user,
      data: () => user || {},
    };
  }
  return firebaseGetDoc(docRef);
};

export const setDoc = async (docRef: any, data: any) => {
  if (IS_MOCK) return console.log('[Mock-DB] Saved doc:', docRef.id, data);
  return firebaseSetDoc(docRef, data);
};

export const collection = (d: any, path: string) => {
  if (IS_MOCK) return { type: 'mock-coll', path };
  return firebaseCollection(db, path);
};

export const onSnapshot = (ref: any, cb: any) => {
  if (IS_MOCK) {
    console.log('[Mock-DB] Snapshot listener for:', ref.path || ref.coll);
    let data: any[] = [];
    if (ref.path === 'users' || ref.coll === 'users') data = Object.values(MOCK_USERS);
    if (ref.path === 'subjects' || ref.coll === 'subjects') data = MOCK_COURSES;
    
    setTimeout(() => {
      cb({
        docs: data.map(d => ({ id: d.id || d.uid, data: () => d }))
      });
    }, 100);
    return () => {};
  }
  return firebaseSnapshot(ref, cb);
};

export const addDoc = async (collRef: any, data: any) => {
  if (IS_MOCK) return console.log('[Mock-DB] Added to', collRef.path, ':', data);
  return firebaseAddDoc(collRef, data);
};

export const updateDoc = async (docRef: any, data: any) => {
  if (IS_MOCK) return console.log('[Mock-DB] Updated doc', docRef.id, ':', data);
  return firebaseUpdateDoc(docRef, data);
};

export const deleteDoc = async (docRef: any) => {
  if (IS_MOCK) return console.log('[Mock-DB] Deleted doc', docRef.id);
  return firebaseDeleteDoc(docRef);
};

export const getDocs = async (ref: any) => {
  if (IS_MOCK) {
    let data: any[] = [];
    if (ref.path === 'subjects' || ref.coll === 'subjects') data = MOCK_COURSES;
    return {
      docs: data.map(d => ({ id: d.id || d.uid, data: () => d }))
    };
  }
  return firebaseGetDocs(ref);
};

export const query = (ref: any, ...constraints: any[]) => {
  if (IS_MOCK) return { ...ref, constraints };
  return firebaseQuery(ref, ...constraints);
};

export const where = (field: string, op: string, value: any) => {
  if (IS_MOCK) return { field, op, value };
  return firebaseWhere(field, op as any, value);
};

export const GoogleAuthProvider = IS_MOCK ? class {} : FirebaseGoogleProvider;

export { auth, db, storage };
