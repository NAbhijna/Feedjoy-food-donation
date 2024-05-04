import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";
// import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Post = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsCollection = collection(db, "listings");
        const querySnapshot = await getDocs(listingsCollection);

        const listingsData = [];
        querySnapshot.forEach((doc) => {
          // Access each document's data and push it to the listingsData array
          listingsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Set the state with the fetched listings data
        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);
  console.log(listings);
  return (
   
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
            <div className="mx-auto max-w-md text-center lg:text-left">
              <header>
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                   Donation Post
                </h2>

                <p className="mt-4 text-gray-500">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
                  rerum quam amet provident nulla error!
                </p>
              </header>

              <a
                href="/Offers"
                className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
              >
                View All
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:py-8">
            <ul className="grid grid-cols-2 gap-4">
              {listings.slice(0, 2).map((listing) => (
                <Link  className="contents" to={`/category/${listing.type}/${listing.id}`}>
                  <li key={listing.id} className="border p-3">
                    <a href="/" className="group block">
                      <img
                       src={listing.imgUrls}
                        alt=""
                        className="aspect-square w-full rounded object-cover"
                      />

                      <div className="mt-3">
                        <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                          {listing.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-700">{listing.quantity}</p>
                      </div>
                    </a>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Post;
