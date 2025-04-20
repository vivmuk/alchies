import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project details
// You can get these by creating a free Firebase project at https://console.firebase.google.com/
const firebaseConfig = {
    apiKey: "AIzaSyBOD92Z4Td2T0pJS-2FFqWqHGFdp2Y6OVo",
    authDomain: "alchies-web.firebaseapp.com",
    projectId: "alchies-web",
    storageBucket: "alchies-web.firebasestorage.app",
    messagingSenderId: "331540359179",
    appId: "1:331540359179:web:b41dfb174c0abac5c97f0e",
    measurementId: "G-TSJG8FV1HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db }; 