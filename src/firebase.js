// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC6p3fKtV8gU6kAj-BHzCX0ltxDZkjUMCg',
  authDomain: 'comp6251-465d8.firebaseapp.com',
  databaseURL: 'https://comp6251-465d8-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'comp6251-465d8',
  storageBucket: 'comp6251-465d8.appspot.com',
  messagingSenderId: '66104500400',
  appId: '1:66104500400:web:6ab1f7663a88d8c05d1b75',
  measurementId: 'G-KWSSJRFF34'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
export const storage = getStorage(app)
export const database = getDatabase(app)
export const auth = getAuth(app)
