import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../components/LocationPicker";

export default function CreateListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "get",
    name: "",
    quantity: 1,
    expiry: "",
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
    description,
    images,
  } = formData;
  const today = new Date().toISOString().split("T")[0];
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
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}/${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                // no-op
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
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
      status: "available",
    };
    delete formDataCopy.images;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/listing/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="w-full p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-dark-olive text-center sm:text-left">
          Create a Listing
        </h1>
        <button
          type="submit"
          form="create-listing-form"
          className="px-5 py-2 sm:px-7 sm:py-3 bg-green-500 text-white font-medium text-xs sm:text-sm uppercase rounded-2xl hover:bg-green-600"
        >
          Create Listing
        </button>
      </div>
      <form
        id="create-listing-form"
        onSubmit={onSubmit}
        className="bg-cream p-4 sm:p-6 rounded-2xl shadow-lg"
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="text-lg font-semibold block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Item name"
              maxLength="32"
              minLength="5"
              required
              className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl"
            />
          </div>
          <div>
            <label
              htmlFor="images"
              className="text-lg font-semibold block mb-1"
            >
              Images
            </label>
            <p className="text-dark-olive/80 text-sm">
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
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <label
                  htmlFor="quantity"
                  className="text-lg font-semibold block mb-1"
                >
                  Quantity (kgs)
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl text-center"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="expiry"
                  className="text-lg font-semibold block mb-1"
                >
                  Use By
                </label>
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

            <div>
              <p className="text-lg font-semibold mb-1">Dietary</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  id="dietary"
                  value="veg"
                  onClick={onChange}
                  className={`px-7 py-3 w-full border rounded-2xl ${
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
                  className={`px-7 py-3 w-full border rounded-2xl ${
                    dietary === "non-veg"
                      ? "bg-olive-green text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Non-Veg
                </button>
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold mb-1">Condition</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  id="condition"
                  value={true}
                  onClick={onChange}
                  className={`px-7 py-3 w-full border rounded-2xl ${
                    !condition
                      ? "bg-white text-black"
                      : "bg-olive-green text-white"
                  }`}
                >
                  Fresh
                </button>
                <button
                  type="button"
                  id="condition"
                  value={false}
                  onClick={onChange}
                  className={`px-7 py-3 w-full border rounded-2xl ${
                    condition
                      ? "bg-white text-black"
                      : "bg-olive-green text-white"
                  }`}
                >
                  Cooked
                </button>
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold mb-1">For Animals?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  id="animal"
                  value={true}
                  onClick={onChange}
                  className={`px-7 py-3 w-full border rounded-2xl ${
                    !animal
                      ? "bg-white text-black"
                      : "bg-olive-green text-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="animal"
                  value={false}
                  onClick={onChange}
                  className={`px-7 py-3 w-full border rounded-2xl ${
                    animal
                      ? "bg-white text-black"
                      : "bg-olive-green text-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="address"
                className="text-lg font-semibold block mb-1"
              >
                Address
              </label>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>
            <div>
              <label
                htmlFor="description"
                className="text-lg font-semibold block mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={onChange}
                placeholder="Item description"
                required
                className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
