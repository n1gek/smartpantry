// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkNFT9HAAWWVmCXjX16AAz6grcWyT82Vw",
  authDomain: "inventory-management-4cdf4.firebaseapp.com",
  projectId: "inventory-management-4cdf4",
  storageBucket: "inventory-management-4cdf4.appspot.com",
  messagingSenderId: "26255272676",
  appId: "1:26255272676:web:d3e79b92c296e021d51af1",
  measurementId: "G-5TE7XLBYHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}
