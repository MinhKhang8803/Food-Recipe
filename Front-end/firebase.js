// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';  // Import getApps để kiểm tra xem Firebase đã được khởi tạo chưa
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

// Initialize Firebase nếu chưa được khởi tạo
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];  // Sử dụng app đã được khởi tạo trước đó
}

// Initialize Firebase Storage và export nó
const storage = getStorage(app);  // Initialize Firebase Storage

export { storage };  // Export storage instance
