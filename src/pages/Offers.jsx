import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsCollection = collection(db, "listings");
        const querySnapshot = await getDocs(listingsCollection);

        const listingsData = [];
        querySnapshot.forEach((doc) => {
          listingsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  console.log(listings);

  return (
    <div className="max-w-6xl mx-auto px-3 py-6">
      <h1 className="text-3xl text-center font-bold mb-6 text-dark-olive">
        All Donations
      </h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing.id} id={listing.id} listing={listing} />
        ))}
      </ul>
    </div>
  );
};

export default Offers;
