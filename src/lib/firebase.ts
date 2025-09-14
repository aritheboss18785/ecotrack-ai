// Firebase configuration and initialization with development mode
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Development mode toggle - set to false when Firebase is properly configured
const DEVELOPMENT_MODE = true;

const firebaseConfig = {
  apiKey: "AIzaSyB5i6-7GJT9cYSSxcGzx5cHzst35iv2J1Q",
  authDomain: "ecotrack-ai-733e5.firebaseapp.com",
  projectId: "ecotrack-ai-733e5",
  storageBucket: "ecotrack-ai-733e5.firebasestorage.app",
  messagingSenderId: "942610983008",
  appId: "1:942610983008:web:29b6ec84d68c987cc83b05",
  measurementId: "G-DCTRBV4QNX"
};

// Mock user for development
const MOCK_USER = {
  uid: 'dev-user-123',
  email: 'dev@ecotrack.ai',
  displayName: 'Development User',
  photoURL: null
};

let app: any = null;
let analytics: any = null;
export let auth: any = null;
export let db: any = null;

if (!DEVELOPMENT_MODE) {
  // Initialize Firebase only in production
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
}

// Auth providers
let googleProvider: GoogleAuthProvider | null = null;
if (!DEVELOPMENT_MODE) {
  googleProvider = new GoogleAuthProvider();
}
export { googleProvider };

// Development mode auth functions
const mockAuthSuccess = () => {
  return Promise.resolve({
    user: MOCK_USER,
    credential: null,
    operationType: 'signIn'
  });
};

// Auth functions with development mode support
export const signInWithGoogle = async () => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock Google sign-in successful');
    return mockAuthSuccess();
  }
  if (!googleProvider || !auth) {
    throw new Error('Firebase not initialized');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock email sign-in successful');
    return mockAuthSuccess();
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock email sign-up successful');
    return mockAuthSuccess();
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock logout successful');
    return Promise.resolve();
  }
  return signOut(auth);
};

// User data functions with development mode support
export const createUserProfile = async (userId: string, userData: any) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock user profile created:', userData);
    return Promise.resolve();
  }
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock user profile retrieved');
    return {
      email: MOCK_USER.email,
      name: MOCK_USER.displayName,
      photoURL: MOCK_USER.photoURL,
      settings: {
        dailyCarbonBudget: 12.0,
        units: 'metric',
        notifications: true
      },
      stats: {
        totalActivities: 5,
        totalCO2Saved: 25.3,
        streak: 3,
        level: 1
      }
    };
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw error;
  }
};

// Activity data functions with development mode support
let mockActivities: any[] = [
  {
    id: 'mock-1',
    category: 'food',
    amount: 0.15,
    unit: 'kg',
    co2Impact: 9.4,
    date: new Date().toISOString().split('T')[0],
    time: '12:30',
    itemName: 'Cheeseburger and fries',
    confidence: 85
  },
  {
    id: 'mock-2', 
    category: 'transport',
    amount: 25,
    unit: 'miles',
    co2Impact: 10.2,
    date: new Date().toISOString().split('T')[0],
    time: '08:15',
    itemName: 'Drove to work',
    confidence: 92
  }
];

export const saveActivity = async (userId: string, activity: any) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock activity saved:', activity);
    mockActivities.push({ ...activity, userId, createdAt: new Date() });
    return Promise.resolve();
  }
  try {
    await addDoc(collection(db, 'activities'), {
      ...activity,
      userId,
      createdAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};

export const getUserActivities = async (userId: string) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock activities retrieved');
    return mockActivities.filter(activity => activity.userId === userId || !activity.userId);
  }
  try {
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const updateActivity = async (activityId: string, updates: any) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock activity updated:', updates);
    const index = mockActivities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      mockActivities[index] = { ...mockActivities[index], ...updates };
    }
    return Promise.resolve();
  }
  try {
    await updateDoc(doc(db, 'activities', activityId), {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteActivity = async (activityId: string) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock activity deleted');
    mockActivities = mockActivities.filter(a => a.id !== activityId);
    return Promise.resolve();
  }
  try {
    await deleteDoc(doc(db, 'activities', activityId));
  } catch (error) {
    throw error;
  }
};

// Auth state listener with development mode support
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (DEVELOPMENT_MODE) {
    console.log('🔧 Development Mode: Mock auth state listener');
    // Simulate immediate auth state change in development
    setTimeout(() => {
      callback(MOCK_USER);
    }, 100);
    // Return a cleanup function
    return () => console.log('🔧 Development Mode: Auth listener cleanup');
  }
  return onAuthStateChanged(auth, callback);
};