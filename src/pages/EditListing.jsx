import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db, auth } from "../firebase"; // Import auth from firebase.js
import { useNavigate, useParams } from "react-router-dom";
import LocationPicker from "../components/LocationPicker";

export default function EditListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "get",
    name: "",
    quantity: 1,
    expiry: 1,
    condition: false,
    animal: false,
    dietary: "veg",
    address: "",
    description: "",
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    quantity,
    expiry,
    condition,
    animal,
    dietary,
    address,
    description,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("you cannot Eddit this Listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing Does not Exist");
      }
    }
    fetchListing();
  }, [params.listingId, navigate]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  function handleLocationSelect(location) {
    setFormData((prevState) => ({
      ...prevState,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }
    async function storeImage(image) {
      try {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}/${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        const snapshot = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              reject(error);
            },
            () => {
              resolve(uploadTask.snapshot);
            }
          );
        });

        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    if (imgUrls === undefined) {
      return;
    }

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Edited");
    navigate(`/listing/${params.listingId}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <main className="w-full px-4">
        <h1 className="text-2xl sm:text-3xl text-center mt-4 sm:mt-6 font-bold text-dark-olive">
          Edit Listing
        </h1>
        <form onSubmit={onSubmit}>
          <p className="text-lg mt-4 sm:mt-6 font-semibold text-dark-olive">
            Donate / Get
          </p>
          <div className="flex">
            <button
              type="button"
              id="type"
              value="donate"
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                type === "get"
                  ? "bg-white text-black"
                  : "bg-olive-green text-white"
              }`}
            >
              Donate
            </button>
            <button
              type="button"
              id="type"
              value="get"
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                type === "donate"
                  ? "bg-white text-black"
                  : "bg-olive-green text-white"
              }`}
            >
              Get
            </button>
          </div>
          <p className="text-lg mt-4 sm:mt-6 font-semibold text-dark-olive">Name</p>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            maxLength="32"
            minLength="5"
            required
            className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl mb-6"
          />
          <div className="flex space-x-6 mb-6">
            <div>
              <p className="text-lg font-semibold text-dark-olive">
                Quantity (in kgs)
              </p>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={onChange}
                required
                className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-dark-olive">Expiry</p>
              <input
                type="date"
                id="expiry"
                value={expiry}
                onChange={onChange}
                required
                min={today}
                className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl text-center"
              />
            </div>
          </div>
          <p className="text-lg mt-4 sm:mt-6 font-semibold text-dark-olive">Dietary</p>
          <div className="flex">
            <button
              type="button"
              id="dietary"
              value="veg"
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                dietary !== "non-veg"
                  ? "bg-olive-green text-white"
                  : "bg-white text-black"
              }`}
            >
              Veg
            </button>
            <button
              type="button"
              id="dietary"
              value="non-veg"
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                dietary === "non-veg"
                  ? "bg-olive-green text-white"
                  : "bg-white text-black"
              }`}
            >
              Non-Veg
            </button>
          </div>
          <p className="text-lg mt-4 sm:mt-6 font-semibold text-dark-olive">Condition</p>
          <div className="flex">
            <button
              type="button"
              id="condition"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                !condition ? "bg-white text-black" : "bg-olive-green text-white"
              }`}
            >
              Fresh
            </button>
            <button
              type="button"
              id="condition"
              value={false}
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                condition ? "bg-white text-black" : "bg-olive-green text-white"
              }`}
            >
              Cooked
            </button>
          </div>
          <p className="text-lg mt-4 sm:mt-6 font-semibold text-dark-olive">
            Animal food?
          </p>
          <div className="flex">
            <button
              type="button"
              id="animal"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                !animal ? "bg-white text-black" : "bg-olive-green text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="animal"
              value={false}
              onClick={onChange}
              className={`mr-3 px-7 py-3 w-full border rounded-2xl ${
                animal ? "bg-white text-black" : "bg-olive-green text-white"
              }`}
            >
              No
            </button>
          </div>
          <p className="text-lg mt-4 sm:mt-6 font-semibold text-dark-olive">Address</p>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialData={{ address, latitude, longitude }}
          />
          <p className="text-lg font-semibold text-dark-olive">Description</p>
          <textarea
            type="text"
            id="description"
            value={description}
            onChange={onChange}
            placeholder="Description"
            required
            className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl mb-6"
          />
          <div className="mb-6">
            <p className="text-lg font-semibold text-dark-olive">Images</p>
            <p className="text-dark-olive/80">
              The first image will be the cover (max 6)
            </p>
            <input
              type="file"
              id="images"
              onChange={onChange}
              accept=".jpg,.png,.jpeg"
              multiple
              required
              className="w-full px-3 py-1.5 text-dark-olive bg-white border border-golden-yellow rounded-2xl"
            />
          </div>
          <button
            type="submit"
            className="mb-6 w-full px-7 py-3 bg-olive-green text-white font-medium text-sm uppercase rounded-2xl hover:bg-dark-olive"
          >
            Edit Listing
          </button>
        </form>
      </main>
    </>
  );
}