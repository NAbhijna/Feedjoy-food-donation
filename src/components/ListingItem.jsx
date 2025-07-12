import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationPin } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="relative bg-cream flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-shadow duration-150 group">
      <Link className="w-full" to={`/category/${listing.type}/${id}`}>
        <div className="relative w-full">
          <img
            className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in"
            loading="lazy"
            src={listing.imgUrls[0]}
            alt={listing.name}
          />
          <Moment
            className="absolute top-2 left-2 bg-burnt-orange text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
            fromNow
          >
            {listing.timestamp?.toDate()}
          </Moment>
        </div>
        <div className="w-full p-4 space-y-2">
          <p className="font-semibold text-lg text-dark-olive truncate">
            {listing.name}
          </p>
          <div className="flex items-center space-x-1">
            <MdLocationPin className="h-4 w-4 text-olive-green" />
            <p className="font-semibold text-sm text-dark-olive/80 truncate">
              {listing.address}
            </p>
          </div>
          <div className="flex items-center justify-between text-dark-olive">
            <p className="font-bold text-sm">
              {listing.quantity > 1 ? `${listing.quantity} kgs` : "1 kg"}
            </p>
            <p className="font-bold text-sm bg-golden-yellow text-dark-olive px-2 py-1 rounded-md">
              Use by: {listing.expiry}
            </p>
          </div>
        </div>
      </Link>
      {(onDelete || onEdit) && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {onEdit && (
            <MdEdit
              className="h-5 w-5 cursor-pointer text-dark-olive hover:text-burnt-orange"
              onClick={() => onEdit(id)}
            />
          )}
          {onDelete && (
            <FaTrash
              className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-800"
              onClick={() => onDelete(id)}
            />
          )}
        </div>
      )}
    </li>
  );
}
