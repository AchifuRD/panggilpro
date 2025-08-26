// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "panggilpro-platform.firebaseapp.com",
  projectId: "panggilpro-platform",
  storageBucket: "panggilpro-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions
export const registerUser = async (email, password, displayName, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, { displayName });
    
    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      phone,
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      location: null,
      preferences: {
        language: 'ms',
        notifications: true
      }
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// User data functions
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw error;
  }
};

export const updateUserData = async (uid, data) => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    throw error;
  }
};

// Booking functions
export const createBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserBookings = (userId, callback) => {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, callback);
};