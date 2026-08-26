// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIiIdYmbzcmqsfRxvU3jO2nV9JYQdTSe8",
  authDomain: "verhuurapp-5b652.firebaseapp.com",
  projectId: "verhuurapp-5b652",
  storageBucket: "verhuurapp-5b652.firebasestorage.app",
  messagingSenderId: "208905142234",
  appId: "1:208905142234:web:8be4c653b0faba973d0ae3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);