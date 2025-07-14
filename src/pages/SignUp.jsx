import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      formDataCopy.avatarUrl = null;

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      //toast.success("Sign Up was successful");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration");
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold text-dark-olive">
        Sign Up
      </h1>

      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-1/2 lg:w-2/5 mb-12 md:mb-6">
          <img
            src="https://media.istockphoto.com/id/494347130/photo/friends-having-dinner.webp?b=1&s=170667a&w=0&k=20&c=w1YQQ0xFgIyzNHnp0_zuprqB_YtPmAlSub8f8BousLk="
            alt="Sign Up"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-2/5 lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Full name"
              className="mb-6 w-full px-4 py-2 text-x1 text-dark-olive bg-cream border-golden-yellow rounded-2xl transition ease-in-out"
            />

            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              className="mb-6 w-full px-4 py-2 text-x1 text-dark-olive bg-cream border-golden-yellow rounded-2xl transition ease-in-out"
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-x1 text-dark-olive bg-cream border-golden-yellow rounded-2xl transition ease-in-out"
              />
              {showPassword ? (
                <FaEyeSlash
                  className="absolute right-3 top-3 text-x1 cursor-pointer"
                  onClick={() =>
                    setShowPassword((prevState) => !prevState)
                  }
                />
              ) : (
                <FaEye
                  className="absolute right-3 top-3 text-x1 cursor-pointer"
                  onClick={() =>
                    setShowPassword((prevState) => !prevState)
                  }
                />
              )}
            </div>

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6 text-dark-olive">
                Have an account?
                <Link
                  to="/sign-in"
                  className="text-golden-yellow hover:text-burnt-orange transition duration-200 ease-in-out ml-1"
                >
                  Sign In
                </Link>
              </p>
              <p className="text-dark-olive">
                <Link
                  to="/forgot-password"
                  className="text-olive-green hover:text-dark-olive transition duration-200 ease-in-out ml-1"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button className="w-full bg-olive-green text-white px-7 py-3 text-sm font-medium uppercase rounded-2xl hover:bg-dark-olive">
              Sign Up
            </button>
            <div className="flex items-center  my-4 before:border-t before:flex-1 before:border-golden-yellow after:border-t after:flex-1 after:border-golden-yellow">
              <p className="text-center font-semibold mx-4 text-dark-olive">
                OR
              </p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}


