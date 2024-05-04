import React, { useEffect } from "react";
import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import PofileLayout from "../components/styles/PofileLayout";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Navigate, useNavigate, useParams } from "react-router-dom";
export default function CreateListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  /* const [geolocationEnabled, setGeolocationEnabled] = useState(true);*/
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "get",
    name: "",
    quantity: 1,
    expiry: 1,
    condition: false,
    animal: false,
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
    address,
    description,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

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
  }, [Navigate, params.listingId]);

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
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }
    /*let geolocation = {};
    let location;*/
    /* if (geolocationEnabled) {
            }*/
    async function storeImage(image) {
      try {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        const snapshot = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress tracking logic if needed
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              resolve(uploadTask.snapshot);
            }
          );
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Re-throw the error to be caught in the calling function
      }
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      /*geolocation,*/
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    /* !formDataCopy.offer && delete formDataCopy.discountedPrice;*/
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Edited");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <PofileLayout>
      <main className="max-w-md px-4 mx-auto border bg-gray-50 ">
        <h1 className=" border bg-slate-400 font-Lemon rounded-xl p-4 text-3xl text-center mt-6 font-bold">
          {" "}
          Edit Listing
        </h1>
        <form onSubmit={onSubmit}>
          <p className="text-lg mt-6 font-semibold">Donate / Get</p>
          <div className="flex">
            <button
              type="button"
              id="type"
              value="donate"
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                type === "get"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              Donate
            </button>
            <button
              type="button"
              id="type"
              value="get"
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                type === "donate"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              Get
            </button>
          </div>
          <p className="text-lg mt-6 font-semibold">Name</p>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            maxLength="32"
            minLength="5"
            required
            className="w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <div className="flex space-x-6 mb-6">
            <div>
              <p className="text-lg font-semibold ">Quantity (in kgs)</p>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={onChange}
                required
                className="w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out  focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold ">Expiry</p>
              <input
                type="text"
                id="expiry"
                value={expiry}
                onChange={onChange}
                required
                className="w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out  focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
            </div>
          </div>
          <p className="text-lg mt-6 font-semibold">Condition</p>
          <div className="flex">
            <button
              type="button"
              id="condition"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                !condition ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Fresh
            </button>
            <button
              type="button"
              id="condition"
              value={false}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                condition ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Cooked
            </button>
          </div>
          <p className="text-lg mt-6 font-semibold">Animal food?</p>
          <div className="flex">
            <button
              type="button"
              id="animal"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                !animal ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="animal"
              value={false}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                animal ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
          <p className="text-lg mt-6 font-semibold">Address</p>
          <textarea
            type="text"
            id="address"
            value={address}
            onChange={onChange}
            placeholder="Address"
            required
            className="w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <div className="flex space-x-6 justify-start mb-6">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
          </div>
          <p className="text-lg font-semibold">Description</p>
          <textarea
            type="text"
            id="description"
            value={description}
            onChange={onChange}
            placeholder="Description"
            required
            className="w-full px-4 py-2 text-x0 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <div className="mb-6">
            <p className="text-lg font-semibold">Images</p>
            <p className="text-gray-600">
              The first image will be the cover (max 6)
            </p>
            <input
              type="file"
              id="images"
              onChange={onChange}
              accept=".jpg,.png,.jpeg"
              multiple
              required
              className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
            />
          </div>
          <button
            type="submit"
            className="mb-6 w-full px-7 py-3 bg-blue-800 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-900 hover:shadow-lg focus:bg-blue-950 focus:shadow-lg active:bg-blue-950 active:shadow-lg transition duration-150 ease-in-out"
          >
            Edit Listing
          </button>
        </form>
      </main>
      <svg  className="wave-bokkings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#000b76"
          fill-opacity="1"
          d="M0,192L6.2,197.3C12.3,203,25,213,37,186.7C49.2,160,62,96,74,69.3C86.2,43,98,53,111,85.3C123.1,117,135,171,148,160C160,149,172,75,185,53.3C196.9,32,209,64,222,101.3C233.8,139,246,181,258,186.7C270.8,192,283,160,295,165.3C307.7,171,320,213,332,208C344.6,203,357,149,369,138.7C381.5,128,394,160,406,154.7C418.5,149,431,107,443,85.3C455.4,64,468,64,480,80C492.3,96,505,128,517,138.7C529.2,149,542,139,554,128C566.2,117,578,107,591,85.3C603.1,64,615,32,628,64C640,96,652,192,665,208C676.9,224,689,160,702,149.3C713.8,139,726,181,738,202.7C750.8,224,763,224,775,234.7C787.7,245,800,267,812,261.3C824.6,256,837,224,849,197.3C861.5,171,874,149,886,138.7C898.5,128,911,128,923,154.7C935.4,181,948,235,960,229.3C972.3,224,985,160,997,165.3C1009.2,171,1022,245,1034,272C1046.2,299,1058,277,1071,256C1083.1,235,1095,213,1108,202.7C1120,192,1132,192,1145,165.3C1156.9,139,1169,85,1182,101.3C1193.8,117,1206,203,1218,213.3C1230.8,224,1243,160,1255,117.3C1267.7,75,1280,53,1292,58.7C1304.6,64,1317,96,1329,112C1341.5,128,1354,128,1366,128C1378.5,128,1391,128,1403,128C1415.4,128,1428,128,1434,128L1440,128L1440,320L1433.8,320C1427.7,320,1415,320,1403,320C1390.8,320,1378,320,1366,320C1353.8,320,1342,320,1329,320C1316.9,320,1305,320,1292,320C1280,320,1268,320,1255,320C1243.1,320,1231,320,1218,320C1206.2,320,1194,320,1182,320C1169.2,320,1157,320,1145,320C1132.3,320,1120,320,1108,320C1095.4,320,1083,320,1071,320C1058.5,320,1046,320,1034,320C1021.5,320,1009,320,997,320C984.6,320,972,320,960,320C947.7,320,935,320,923,320C910.8,320,898,320,886,320C873.8,320,862,320,849,320C836.9,320,825,320,812,320C800,320,788,320,775,320C763.1,320,751,320,738,320C726.2,320,714,320,702,320C689.2,320,677,320,665,320C652.3,320,640,320,628,320C615.4,320,603,320,591,320C578.5,320,566,320,554,320C541.5,320,529,320,517,320C504.6,320,492,320,480,320C467.7,320,455,320,443,320C430.8,320,418,320,406,320C393.8,320,382,320,369,320C356.9,320,345,320,332,320C320,320,308,320,295,320C283.1,320,271,320,258,320C246.2,320,234,320,222,320C209.2,320,197,320,185,320C172.3,320,160,320,148,320C135.4,320,123,320,111,320C98.5,320,86,320,74,320C61.5,320,49,320,37,320C24.6,320,12,320,6,320L0,320Z"
        ></path>
      </svg>
    </PofileLayout>
  );
}
