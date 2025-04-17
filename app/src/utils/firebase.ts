// firebase.js - Firebase configuration
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

// Your Firebase configuration - replace with your actual Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyBEfNdR0xmbQLs2nmjWgz56GXzcSFUq8pk",
  authDomain: "hackgenx-4e89b.firebaseapp.com",
  databaseURL: "https://hackgenx-4e89b-default-rtdb.firebaseio.com",
  projectId: "hackgenx-4e89b",
  storageBucket: "hackgenx-4e89b.firebasestorage.app",
  messagingSenderId: "559110230845",
  appId: "1:559110230845:web:f5cba366f0d1387fe92b54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get };
