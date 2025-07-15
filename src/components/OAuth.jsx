import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from 'react'
import {FcGoogle} from "react-icons/fc"
import {toast} from "react-toastify"
import { db, auth } from "../firebase"; // Import auth from firebase.js
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick()
  {
   try {
    const provider = new GoogleAuthProvider();
    const result=await signInWithPopup(auth, provider);
    const user= result.user;
    const docRef = doc(db, "users",user.uid);
    const docSnap = await getDoc(docRef);
    if(!docSnap.exists())
    {
    await setDoc(docRef, {
      name: user.displayName, 
      email: user.email,
      timestamp: serverTimestamp(),
      avatarUrl: user.photoURL,
    });
    }
    navigate("/");
   } catch (error) {
    toast.error("Could not authorize with Google");
   }
  }
  return (
    <button type="button" onClick={onGoogleClick} className="flex items-center justify-center w-full bg-[#ec9464] text-white px-7 py-3 uppercase text-sm font-medium hover:bg-[#d57a4b] active:bg-[#c06c3a] shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded-2xl"
    >
        <FcGoogle className="text-2xl  bg-white rounded-full mr-2"/>
        Continue with Google
    </button>
  );
}

