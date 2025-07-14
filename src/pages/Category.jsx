import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

export default function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          where("status", "!=", "taken"),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnap = await getDocs(q);
        const fetchedListings = [];
        querySnap.forEach((doc) => {
          fetchedListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(fetchedListings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings.");
        console.error(error);
      }
    }

    fetchListings();
  }, [params.categoryName]);

  return (
    <div className="max-w-6xl mx-auto px-3 py-6">
      <h1 className="text-3xl text-center font-bold mb-6 text-dark-olive">
        {params.categoryName === "donate"
          ? "Items Available for Donation"
          : "Items Being Requested"}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center text-dark-olive/80">
          There are no current listings in this category.
        </p>
      )}
    </div>
  );
}
