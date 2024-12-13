// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';  // Import getApps to check Firebase create?
import { getStorage } from 'firebase/storage';  // Import Firebase Storage

// Firebase config của bạn
const firebaseConfig = {
    apiKey: "AIzaSyCg3vwEKQk-BOBo9wmYrqZSZGQt4tgVhxk",
    authDomain: "final-project-30e16.firebaseapp.com",
    databaseURL: "https://final-project-30e16-default-rtdb.firebaseio.com",
    projectId: "final-project-30e16",
    storageBucket: "final-project-30e16.appspot.com",
    messagingSenderId: "13004024643",
    appId: "1:13004024643:web:6ff746ea32636861251df6"
};

// Initialize Firebase if not already initialized
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];  // use app if already initialized
}

// Initialize Firebase Storage and export
const storage = getStorage(app);  // Initialize Firebase Storage

export { storage };  // Export storage instance
