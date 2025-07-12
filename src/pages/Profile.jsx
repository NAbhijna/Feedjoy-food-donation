import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function Profile() {
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    avatarUrl: auth.currentUser.photoURL,
  });
  const { name, email, avatarUrl } = formData;
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().avatarUrl) {
        setFormData((prevState) => ({
          ...prevState,
          avatarUrl: docSnap.data().avatarUrl,
        }));
      }
    }
    fetchUser();
  }, [auth.currentUser.uid]);

  function onChange(e) {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  }

  async function onSubmit() {
    try {
      let newAvatarUrl = avatarUrl;

      if (avatarFile) {
        const storage = getStorage();
        const fileName = `avatars/${auth.currentUser.uid}/${avatarFile.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, avatarFile);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              reject(error);
            },
            async () => {
              try {
                newAvatarUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      if (
        auth.currentUser.displayName !== name ||
        auth.currentUser.photoURL !== newAvatarUrl
      ) {
        // Update display name and photo in Firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: newAvatarUrl,
        });

        // Update name and avatarUrl in the Firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
          avatarUrl: newAvatarUrl,
        });
        setFormData((prevState) => ({ ...prevState, avatarUrl: newAvatarUrl }));
        setAvatarFile(null);
        setAvatarPreview(null);
      }
      toast.success("Profile details updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update the profile details");
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl text-center mt-6 font-bold text-dark-olive">
        My Profile
      </h1>
      <div className="flex flex-col items-center gap-4 my-6">
        <img
          src={avatarPreview || avatarUrl || "/default-avatar.png"}
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />
        {changeDetail && (
          <input
            type="file"
            id="avatar"
            accept=".jpg,.jpeg,.png"
            onChange={onChange}
            className="text-sm text-dark-olive/80 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-golden-yellow file:text-white file:cursor-pointer hover:file:bg-burnt-orange"
          />
        )}
      </div>
      <div className="w-full">
        <form>
          <input
            type="text"
            id="name"
            value={name}
            disabled={!changeDetail}
            onChange={onChange}
            className={`mb-6 w-full px-4 py-2 text-xl text-dark-olive bg-cream border border-golden-yellow rounded-2xl transition ease-in-out ${
              changeDetail && "bg-white focus:bg-white"
            }`}
          />
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="mb-6 w-full px-4 py-2 text-xl text-dark-olive bg-cream border border-golden-yellow rounded-2xl transition ease-in-out"
          />

          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
            <p className="text-dark-olive">
              Want to change your details?
              <span
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
                className="text-golden-yellow hover:text-burnt-orange transition ease-in-out duration-200 ml-1 cursor-pointer"
              >
                {changeDetail ? "Apply changes" : "Edit"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
  
