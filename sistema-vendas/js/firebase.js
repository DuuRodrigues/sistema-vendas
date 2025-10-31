import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSc5iQUk76jzxCAuL_PDUBzxieaFsELA4",
  authDomain: "ssistema-vendas.firebaseapp.com",
  projectId: "ssistema-vendas",
  storageBucket: "ssistema-vendas.firebasestorage.app",
  messagingSenderId: "936264859828",
  appId: "1:936264859828:web:6f432b0096ecf5081cd7e1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
