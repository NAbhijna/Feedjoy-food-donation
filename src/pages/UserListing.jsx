import React, { useState, useEffect } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { db } from './../firebase';
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";

const UserListing = () => {
  const auth = getAuth(); 
  const navigate = useNavigate();
  const { loggedIn, checkingStatus } = useAuthStatus();

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkingStatus && !loggedIn) {
      navigate("/sign-in");
      return;
    }
    if (loggedIn) {
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
    }
  }, [auth.currentUser, checkingStatus, loggedIn, navigate]);

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter((listing) => listing.id !== listingID);
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }

  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }

  if (checkingStatus || loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="max-w-6xl px-3 mt-4 sm:mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="font-bold text-xl sm:text-2xl text-center p-2 sm:p-4 mb-4 sm:mb-6 text-dark-olive">
              My Listings
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="[&_svg[class*=text-dark-olive]]:bg-white [&_svg[class*=text-dark-olive]]:rounded-full [&_svg[class*=text-dark-olive]]:p-1 [&_svg[class*=text-red-600]]:bg-white [&_svg[class*=text-red-600]]:rounded-full [&_svg[class*=text-red-600]]:p-1"
                >
                  <ListingItem
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                </div>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default UserListing;