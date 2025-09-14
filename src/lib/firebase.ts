// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Firebase config - Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB5i6-7GJT9cYSSxcGzx5cHzst35iv2J1Q",
  authDomain: "ecotrack-ai-733e5.firebaseapp.com",
  projectId: "ecotrack-ai-733e5",
  storageBucket: "ecotrack-ai-733e5.firebasestorage.app",
  messagingSenderId: "942610983008",
  appId: "1:942610983008:web:29b6ec84d68c987cc83b05",
  measurementId: "G-DCTRBV4QNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Firebase: Google sign-in error', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error('Firebase: Email sign-in error', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error('Firebase: Email sign-up error', error);
    throw error;
  }
};

export const logout = () => {
  return signOut(auth);
};

// User data functions
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Activity data functions
export const saveActivity = async (userId: string, activity: any) => {
  try {
    await addDoc(collection(db, 'activities'), {
      ...activity,
      userId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error saving activity:', error);
    throw error;
  }
};

export const getUserActivities = async (userId: string) => {
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
    console.error('Error getting user activities:', error);
    throw error;
  }
};

export const updateActivity = async (activityId: string, updates: any) => {
  try {
    await updateDoc(doc(db, 'activities', activityId), {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (activityId: string) => {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};