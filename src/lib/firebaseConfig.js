import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyCYxt4bGDpufe6xJxpd5lavJsjRWORX87s",
    authDomain: "saintkappa-svelte-todo.firebaseapp.com",
    projectId: "saintkappa-svelte-todo",
    storageBucket: "saintkappa-svelte-todo.appspot.com",
    messagingSenderId: "351889060887",
    appId: "1:351889060887:web:8bb111059c1bb7ab241852",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
