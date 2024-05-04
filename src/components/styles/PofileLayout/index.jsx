import React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2";
import { db } from "../../../firebase";

const Index = ({ children }) => {
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
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

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
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid xs={3}>
          <div className=" border fixed flex h-screen flex-col justify-between border-e bg-gray-900">
            <div className="px-4 py-6">
              <span className="grid h-30 w-32 place-content-center rounded-lg bg-gray-900 text-xs text-gray-600">
                <div class="spinner"></div>
              </span>

              <ul className="mt-6 space-y-1">
                <li>
                  <a
                    href="/profile"
                    className="block rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white"
                  >
                    Profile
                  </a>
                </li>

                <li>
                  <a
                    href="/create-listing"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 "
                  >
                    Post Donation
                  </a>
                </li>

                <li>
                  <a
                    href="View-listing"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    View Donation
                  </a>
                </li>
             
              </ul>
            </div>

            <div className=" bg-gray-800 sticky inset-x-0 bottom-0 border-t border-gray-100">
              <a
                href="/"
                className="flex items-center gap-2 bg-gray-100 p-4 hover:bg-gray-300"
              >
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  className="size-10 rounded-full object-cover"
                />

                <div>
                  <p className="text-xs">
                    <strong className="block font-medium">{name}</strong>

                    <span> {email} </span>
                  </p>
                </div>
              </a>
            </div>
          </div>
        </Grid>
        <Grid xs={8}>
          <div>{children}</div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Index;
