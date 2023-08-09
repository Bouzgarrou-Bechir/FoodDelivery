import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported  } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";


const firebaseConfig = {
  apiKey:  process.env.FIREBASE_API_KEY,
  authDomain:  process.env.FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.FIREBASE_PROJECT_ID,
  storageBucket:  process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:  process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_databaseURL,
  databaseURL: process.env.FIREBASE_measurementId

};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const auth = getAuth(app);
const db = getFirestore(app);
const timestamp = serverTimestamp();


export { auth, db, timestamp };
