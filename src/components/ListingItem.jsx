import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useAuthStatus } from "../hooks/useAuthStatus";

export default function ListingItem({
  listing,
  id,
  onEdit,
  onDelete,
  distance,
}) {
  const { loggedIn } = useAuthStatus();
  const navigate = useNavigate();

  const handleClick = () => {
    if (loggedIn) {
      navigate(`/listing/${id}`);
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <li
      className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-shadow duration-150 m-[10px] cursor-pointer"
      onClick={handleClick}
    >
      <img
        className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
        loading="lazy"
        src={listing.imgUrls[0]}
        alt={listing.name}
      />
      <Moment
        className="absolute top-2 left-2 bg-olive-green text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
        fromNow
      >
        {listing.timestamp?.toDate()}
      </Moment>
      <div className="w-full p-[10px]">
        <div className="flex items-center space-x-1">
          <MdLocationOn className="h-4 w-4 text-green-600" />
          <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
            {listing.address}
          </p>
        </div>
        <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
        <p className="text-burnt-orange mt-2 font-semibold">
          {listing.quantity} Kgs
        </p>
        <div className="flex items-center mt-[10px] space-x-3">
          <div className="flex items-center space-x-1">
            <p className="font-bold text-xs">
              {listing.dietary === "veg" ? "Veg" : "Non-Veg"}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <p className="font-bold text-xs">
              {listing.condition ? "Fresh" : "Cooked"}
            </p>
          </div>
          {typeof distance === "number" && (
            <p className="font-bold text-xs">{distance.toFixed(1)} km away</p>
          )}
        </div>
      </div>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(listing.id);
          }}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer text-dark-olive"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(listing.id);
          }}
        />
      )}
    </li>
  );
}
