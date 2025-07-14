import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { FaWeightScale } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { getAuth } from "firebase/auth";
import { FaBackward } from "react-icons/fa";
import Moment from "react-moment";
import { haversineDistance } from "../utils/haversine";
import PickupRequestModal from "../components/PickupRequestModal";
import { toast } from "react-toastify";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "1rem",
  marginTop: "1.5rem",
};

function DonationMap({ listing }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const center = {
    lat: listing.latitude,
    lng: listing.longitude,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [donor, setDonor] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const listingData = docSnap.data();
        setListing(listingData);

        // Fetch donor info
        const donorRef = doc(db, "users", listingData.userRef);
        const donorSnap = await getDoc(donorRef);
        if (donorSnap.exists()) {
          setDonor(donorSnap.data());
        }
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  const handleRequestSubmit = async ({ reason, preferredTime }) => {
    setRequestLoading(true);
    if (!listing) {
      console.error("[Listing] No listing loaded, cannot submit request.");
      toast.error("Listing not loaded. Please try again.");
      setRequestLoading(false);
      return;
    }
    if (!listing.userRef) {
      console.warn("[Listing] listing.userRef is missing!", listing);
      toast.error("Donor information missing. Cannot send request.");
      setRequestLoading(false);
      return;
    }
    try {
      console.log("[Listing] Creating pickup request with:", {
        listingId: params.listingId,
        donorId: listing.userRef,
        userId: auth.currentUser?.uid,
        reason,
        preferredTime,
      });
      await addDoc(collection(db, "pickupRequests"), {
        listingId: params.listingId,
        donorId: listing.userRef,
        userId: auth.currentUser.uid,
        reason,
        preferredTime,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Pickup request sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("[Listing] Error sending pickup request:", error);
      toast.error("Failed to send pickup request.");
    } finally {
      setRequestLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <button
        className="fixed left-4 top-20 bg-cream text-black rounded-full p-3 shadow-lg z-10"
        onClick={goBack}
      >
        <FaBackward />
      </button>
      <button
        className="fixed right-4 top-20 bg-cream text-black rounded-full p-3 shadow-lg z-10"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare />
      </button>
      {shareLinkCopied && (
        <p className="fixed top-32 right-4 font-semibold border-2 border-gray-400 rounded-md bg-cream z-10 p-2">
          Link Copied
        </p>
      )}

      <div className="mt-10 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={listing.imgUrls[0]}
            alt={listing.name}
            className="w-full h-auto object-cover rounded-2xl shadow-lg"
          />
          <p className="text-gray-700 mt-4">{listing.description}</p>
        </div>
        <div className="md:w-1/2 flex flex-col">
          <div className="p-4 bg-cream rounded-2xl shadow-md flex-grow">
            <h1 className="text-3xl font-bold mb-4 text-dark-olive">
              {listing.name}
            </h1>
            {donor && (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={donor.avatarUrl || "/default-avatar.png"}
                  alt="donor avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-dark-olive/80">Donated by</p>
                  <p className="font-semibold text-dark-olive">{donor.name}</p>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <span className="bg-golden-yellow text-dark-olive px-3 py-1 rounded-full">
                Type: {listing.type}
              </span>
              <span className="bg-golden-yellow text-dark-olive px-3 py-1 rounded-full">
                For: {listing.animal ? "Animal" : "Human"}
              </span>
              {listing.dietary && (
                <span className="bg-golden-yellow text-dark-olive px-3 py-1 rounded-full capitalize">
                  {listing.dietary}
                </span>
              )}
              <span className="bg-burnt-orange text-white px-3 py-1 rounded-full">
                Use By: <Moment format="MMM D, YYYY">
                  {listing.expiry && listing.expiry.toDate ? listing.expiry.toDate() : new Date(listing.expiry)}
                </Moment>
              </span>
            </div>
            
            <div className="flex items-center mb-2">
              <MdLocationPin className="h-6 w-6 text-olive-green mr-2" />
              <p className="font-semibold text-dark-olive">{listing.address}</p>
              {userLocation && listing.latitude && listing.longitude && (
                <span className="ml-2 text-sm text-dark-olive/80">
                  (
                  {haversineDistance(userLocation, {
                    lat: listing.latitude,
                    lng: listing.longitude,
                  }).toFixed(1)}{" "}
                  km away)
                </span>
              )}
            </div>
            <div className="flex items-center">
              <FaWeightScale className="h-6 w-6 text-olive-green mr-2" />
              <p className="font-semibold text-dark-olive">
                {listing.quantity > 1 ? `${listing.quantity} kgs` : "1 kg"}
              </p>
            </div>
          </div>

          {auth.currentUser?.uid &&
            listing.userRef !== auth.currentUser.uid && listing.status !== "taken" && (
              <div className="mt-6">
                {listing.latitude && listing.longitude && (
                  <DonationMap listing={listing} />
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-olive-green px-7 py-3 text-white font-medium text-sm uppercase rounded-2xl shadow-md hover:bg-dark-olive mt-6"
                >
                  Request Pickup
                </button>
                <button
                  onClick={() => navigate(`/chat/${listing.userRef}`)}
                  className="w-full bg-golden-yellow px-7 py-3 text-dark-olive font-medium text-sm uppercase rounded-2xl shadow-md hover:bg-burnt-orange mt-4"
                >
                  Chat with Donor
                </button>
              </div>
            )}
            {listing.status === "taken" && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-2xl text-center font-semibold">
                This donation has already been taken.
              </div>
            )}
        </div>
      </div>
      <PickupRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRequestSubmit}
        loading={requestLoading}
      />
    </main>
  );
}