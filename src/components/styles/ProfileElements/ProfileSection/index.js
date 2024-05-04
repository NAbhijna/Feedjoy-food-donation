import React from "react";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  collection,
  doc,
  getDocs,
  orderBy, // Ensure this import is consistent
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { useEffect } from "react";
import { db } from "../../../../firebase";
const ProfileSection = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  }
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  return (
    <>
      <div>
        <div className="  max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
          <div className="rounded-t-lg h-32 overflow-hidden">
            <img
              className="object-cover object-top w-full"
              src="https://wallpapercave.com/wp/wp4041548.jpg"
              alt="Mountain"
            />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img
              className="object-cover object-center h-32"
              src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/14cb6b84808917.5d68451d7d126.gif"
              alt="Woman looking front"
            />
          </div>
          <div className="text-center mt-2">
            <form className="p-4">
              {/*Name input*/}
              <input
                type="text"
                id="name"
                value={name}
                disabled={!changeDetail}
                onChange={onChange}
                className={`mb-6 w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                  changeDetail && "bg-red-200 focus:bg-red-200"
                }`}
              />
              {/*Email input*/}
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="mb-6 w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out "
              />
            </form>
          </div>

          <div className="p-4 border-t mx-8 mt-1 text-center">
            <div className="flex flex-col  whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex text-center ">
                Change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className=" border mt-3  border-black rounded-xl bg-black text-white font-bold font-Lemon   transition duration-200 ease-in-out cursor-pointer"
              >
                Sign Out
              </p>
            </div>
          </div>
        </div>
      </div>
      <svg
        className="wave-bokkings"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#000b76"
          fill-opacity="1"
          d="M0,160L21.8,149.3C43.6,139,87,117,131,133.3C174.5,149,218,203,262,224C305.5,245,349,235,393,197.3C436.4,160,480,96,524,80C567.3,64,611,96,655,133.3C698.2,171,742,213,785,197.3C829.1,181,873,107,916,85.3C960,64,1004,96,1047,133.3C1090.9,171,1135,213,1178,234.7C1221.8,256,1265,256,1309,229.3C1352.7,203,1396,149,1418,122.7L1440,96L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"
        ></path>
      </svg>
    </>
  );
};

export default ProfileSection;
