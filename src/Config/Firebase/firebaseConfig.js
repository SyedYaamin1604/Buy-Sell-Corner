import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCd1KxHT9GIfL0ZQs2zbZKkCE8rBF32AZc",
  authDomain: "buy-sell-corner01.firebaseapp.com",
  projectId: "buy-sell-corner01",
  storageBucket: "buy-sell-corner01.firebasestorage.app",
  messagingSenderId: "55305307301",
  appId: "1:55305307301:web:28d20ae11a2b8fb033794c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);