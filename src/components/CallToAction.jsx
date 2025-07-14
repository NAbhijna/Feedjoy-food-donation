import React from "react";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-burnt-orange/70 p-8 rounded-2xl shadow-lg">
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src="/begin.png"
              alt="A person giving food to another"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <p className="text-2xl sm:text-3xl font-semibold text-dark-olive mb-6">
              "Begin your journey of giving — your first donation could be
              someone's first meal today."
            </p>
            <button
              onClick={() => navigate("/create-listing")}
              className="inline-block rounded-2xl bg-olive-green px-12 py-3 text-sm font-medium text-white shadow hover:bg-dark-olive focus:outline-none focus:ring active:bg-dark-olive"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
