import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaqplPeZizf49wReY8Y_MlRaEfjB_OJEw",
  authDomain: "game-library-app-b8e44.firebaseapp.com",
  projectId: "game-library-app-b8e44",
  storageBucket: "game-library-app-b8e44.appspot.com",
  messagingSenderId: "1047291909315",
  appId: "1:1047291909315:web:05cb636cebb543b17d7e76",
};

// 🔥 EVITA DUPLICAÇÃO
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
