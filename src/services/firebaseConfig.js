import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3YjrvnPMq_54ei8xlpP6d8LCsBN9JLTk",
  authDomain: "centro-deportivo-univers-9f056.firebaseapp.com",
  projectId: "centro-deportivo-univers-9f056",
  storageBucket: "centro-deportivo-univers-9f056.firebasestorage.app",
  messagingSenderId: "580534872168",
  appId: "1:580534872168:web:26fa79377f213d866473dd"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app);