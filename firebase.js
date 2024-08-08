// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3NiwVOtHXszi5drSgaqvgUYwa9rTsZcQ",
  authDomain: "inventory-management-4ced1.firebaseapp.com",
  projectId: "inventory-management-4ced1",
  storageBucket: "inventory-management-4ced1.appspot.com",
  messagingSenderId: "485505571179",
  appId: "1:485505571179:web:4d9ca1aa3c4c553b1fd42e",
  measurementId: "G-Y7TCTX3JRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}