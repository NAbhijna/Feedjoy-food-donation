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
    <div className="bg-gray-100">
      <div className="bg-indigo-600 px-4 py-3 text-white">
        <p className="text-center text-sm font-medium">
          Latest!!
          <p  className="inline-block underline">
          Donations for Your Association
          </p>
        </p>
      </div>
      <div>
        <section className="bg-gray-100">
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Trusted by Top Donations Associations
              </h2>

              <p className="mt-4 text-gray-500 sm:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                dolores laborum labore provident impedit esse recusandae facere
                libero harum sequi.
              </p>
            </div>
          </div>
        </section>
      <hr/>
      </div>
      <ul className=" m-2 sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {listings.map((listing) => (
          <ListingItem key={listing.id} id={listing.id} listing={listing} />
        ))}
      </ul>
    </div>
  );
};

export default Offers;
