import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration using environment variables with fallbacks to ensure it works in any environment
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBOD92Z4Td2T0pJS-2FFqWqHGFdp2Y6OVo",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "alchies-web.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "alchies-web",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "alchies-web.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "331540359179",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:331540359179:web:b41dfb174c0abac5c97f0e",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-TSJG8FV1HN"
};

let db: Firestore;
let storage: FirebaseStorage;

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Initialize Storage
    storage = getStorage(app);
    
    // Debug output to help troubleshoot initialization issues
    console.log("Firebase initialized successfully with projectId:", firebaseConfig.projectId);
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Initialize with default empty instances to prevent app crashes
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
}

export { db, storage }; 