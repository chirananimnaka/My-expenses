// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHaZtxRm9xEY-IqUZ_rXp0Z6MhD_EjE9I", // Note: This API Key is public and safe to expose in client-side code for Firebase
    authDomain: "my-expenses-828ed.firebaseapp.com",
    projectId: "my-expenses-828ed",
    storageBucket: "my-expenses-828ed.firebasestorage.app",
    messagingSenderId: "89735835977",
    appId: "1:89735835977:web:e324d531615c53b6af2a98",
    measurementId: "G-MRN7JKCS74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
