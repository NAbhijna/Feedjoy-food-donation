import React from 'react';
import { useState } from "react";
import OAuth from "../components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from "react-toastify";

export default function ForgotPassword() {
 const [email, setEmail]=useState("");
  function onChange(e){
  setEmail(e.target.value);
  }

  async function onSubmit(e)
  {
    e.preventDefault();
    try{
     const auth = getAuth();
     await sendPasswordResetEmail(auth,email); 
     toast.success("Email was sent");
    }catch{
      toast.error("Could not send reset password");
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold text-dark-olive">Forgot Password</h1>
    <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
      <div className="md:w-1/2 lg:w-2/5 mb-12 md:mb-6">
        <img src="https://media.istockphoto.com/id/494347130/photo/friends-having-dinner.webp?b=1&s=170667a&w=0&k=20&c=w1YQQ0xFgIyzNHnp0_zuprqB_YtPmAlSub8f8BousLk="alt="Share Food" 
        className="w-full rounded-2xl"/>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 lg:ml-20">
        <form onSubmit={onSubmit}>
          <input type="email" id="email" value={email} onChange={onChange}
          placeholder="Email address"
          className="mb-6 w-full px-4 py-2 text-xl text-dark-olive bg-cream border-golden-yellow rounded-2xl transition ease-in-out"/>
          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
            <p className="mb-6 text-dark-olive">Don't have an account?
            <Link to="/sign-up" className="text-golden-yellow hover:text-burnt-orange transition duration-200 ease-in-out ml-1">Register
            </Link>
            </p>
            <p>
              <Link to="/sign-in"className="text-olive-green hover:text-dark-olive
               transition duration-200 ease-in-out ml-1">Sign In instead</Link>
            </p>
          </div>
          <button className="w-full bg-olive-green text-white px-7 py-3 text-sm font-medium uppercase rounded-2xl shadow-md hover:bg-dark-olive"
        type="submit">Send reset Password</button>
       <div className="flex items-center  my-4 before:border-t before:flex-1 before:border-golden-yellow after:border-t after:flex-1 after:border-golden-yellow">
              <p className="text-center font-semibold mx-4 text-dark-olive">OR</p>
            </div>
            <OAuth />
        </form>
        
      </div>
    </div>
    </section>
  )
}

