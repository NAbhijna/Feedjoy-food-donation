import React, { useState, useEffect } from "react";
import { collection,  deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import { useNavigate } from 'react-router-dom';
import { getAuth,  } from "firebase/auth";
import { db } from './../firebase';

const UserListing = () => {
  const auth = getAuth(); 
  const navigate = useNavigate();

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="w-full px-3 mt-6">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="font-bold text-2xl text-center p-4 mb-6 text-dark-olive">
              My Listings
            </h2>
            <ul className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default UserListing;