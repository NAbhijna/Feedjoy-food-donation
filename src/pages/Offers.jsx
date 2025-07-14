import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { haversineDistance } from "../utils/haversine";

const initialFilters = {
  foodType: {
    veg: false,
    nonVeg: false,
    animal: false,
  },
  posted: "all",
  distance: "all", // '5', '10', '25', '50', 'all'
};

const Offers = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'nearest'
  const [userLocation, setUserLocation] = useState(null);

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
    const fetchListings = async () => {
      setLoading(true);
      try {
        const listingsCollection = collection(db, "listings");
        // We fetch all listings and filter client-side for flexibility
        const q = query(listingsCollection, orderBy("timestamp", "desc"));

        const querySnapshot = await getDocs(q);
        const listingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        foodType: { ...prev.foodType, [name]: checked },
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    const isAnyFoodTypeSelected = Object.values(filters.foodType).some(
      (v) => v === true
    );

    let filtered = listings
      .filter((listing) => {
        // Exclude taken listings
        if (listing.status === "taken") return false;

        // Food Type Filter
        if (isAnyFoodTypeSelected) {
          const isAnimal = listing.animal && filters.foodType.animal;
          const isVeg =
            !listing.animal &&
            listing.dietary === "veg" &&
            filters.foodType.veg;
          const isNonVeg =
            !listing.animal &&
            listing.dietary === "non-veg" &&
            filters.foodType.nonVeg;
          if (!(isAnimal || isVeg || isNonVeg)) return false;
        }

        // Posted Date Filter
        if (filters.posted !== "all") {
          const now = new Date();
          let daysToGoBack = 0;
          if (filters.posted === "today") daysToGoBack = 1;
          if (filters.posted === "3days") daysToGoBack = 3;
          if (filters.posted === "7days") daysToGoBack = 7;
          const fromDate = new Date(now.setDate(now.getDate() - daysToGoBack));
          if (listing.timestamp.toDate() < fromDate) return false;
        }

        return true;
      })
      .map((listing) => ({
        ...listing,
        distance:
          userLocation && listing.latitude && listing.longitude
            ? haversineDistance(userLocation, {
                lat: listing.latitude,
                lng: listing.longitude,
              })
            : null,
      }));

    // Distance Filter
    if (filters.distance !== "all" && userLocation) {
      filtered = filtered.filter(
        (listing) =>
          listing.distance !== null &&
          listing.distance <= parseInt(filters.distance, 10)
      );
    }

    // Sorting
    if (sortBy === "nearest" && userLocation) {
      return filtered.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return filtered; // Already sorted by newest from Firestore query
  }, [listings, filters, sortBy, userLocation]);

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl text-center font-bold mb-6 text-dark-olive">
        All Donations
      </h1>

      {/* Filters Section */}
      <div className="p-4 bg-cream rounded-2xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Food Type */}
        <div>
          <p className="font-semibold text-dark-olive mb-2">Food Type</p>
          <div className="flex flex-col gap-2">
            {Object.keys(filters.foodType).map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={type}
                  checked={filters.foodType[type]}
                  onChange={handleFilterChange}
                  className="h-5 w-5 rounded border-gray-300 text-olive-green focus:ring-olive-green"
                />
                <span className="text-dark-olive capitalize">
                  {type === "nonVeg" ? "Non-Veg" : type}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Posted Within */}
        <div>
          <label
            className="font-semibold text-dark-olive mb-2 block"
            htmlFor="posted"
          >
            Posted Within
          </label>
          <select
            id="posted"
            name="posted"
            value={filters.posted}
            onChange={handleFilterChange}
            className="w-full p-2 border border-golden-yellow rounded-2xl bg-white text-dark-olive"
          >
            <option value="all">All Time</option>
            <option value="today">Last 24 hours</option>
            <option value="3days">Last 3 days</option>
            <option value="7days">Last 7 days</option>
          </select>
        </div>
        {/* Distance */}
        <div>
          <label
            className="font-semibold text-dark-olive mb-2 block"
            htmlFor="distance"
          >
            Distance
          </label>
          <select
            id="distance"
            name="distance"
            value={filters.distance}
            onChange={handleFilterChange}
            disabled={!userLocation}
            className="w-full p-2 border border-golden-yellow rounded-2xl bg-white text-dark-olive disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">Any Distance</option>
            <option value="5">Under 5 km</option>
            <option value="10">Under 10 km</option>
            <option value="25">Under 25 km</option>
            <option value="50">Under 50 km</option>
          </select>
        </div>
        {/* Sort & Reset */}
        <div>
          <p className="font-semibold text-dark-olive mb-2">Sort By</p>
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-golden-yellow">
            <button
              onClick={() => setSortBy("newest")}
              className={`w-full p-2 rounded-xl ${
                sortBy === "newest"
                  ? "bg-olive-green text-white"
                  : "text-dark-olive"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy("nearest")}
              disabled={!userLocation}
              className={`w-full p-2 rounded-xl ${
                sortBy === "nearest"
                  ? "bg-olive-green text-white"
                  : "text-dark-olive"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Nearest
            </button>
          </div>
          <button
            onClick={() => setFilters(initialFilters)}
            className="w-full mt-4 p-2 text-sm text-dark-olive hover:text-burnt-orange"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="mb-6 text-center text-dark-olive/80">
        <p>
          Showing {filteredAndSortedListings.length} of {listings.length}{" "}
          donations.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : filteredAndSortedListings.length > 0 ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredAndSortedListings.map((listing) => (
            <ListingItem
              key={listing.id}
              id={listing.id}
              listing={listing}
              distance={listing.distance}
            />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl font-semibold text-dark-olive">
            No donations match the selected filters.
          </p>
          <p className="text-dark-olive/80">
            Try adjusting your filters or reset them to see all available
            donations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Offers;