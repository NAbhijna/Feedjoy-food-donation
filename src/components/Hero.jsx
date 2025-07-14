import React from "react";

const Hero = () => {
  const navigate = require("react-router-dom").useNavigate();
  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <section className="bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-12 py-20 sm:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold sm:text-6xl text-white">
            Welcome to FeedJoy
            <strong className="block font-extrabold text-golden-yellow">
              Reduce Waste, End Hunger.
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed max-w-xl text-white">
            Your food donation can help feed families in need. Join our mission
            to support our cause and be a part of the change.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              className="block w-full rounded-2xl bg-olive-green px-12 py-3 text-sm font-medium text-white shadow hover:bg-dark-olive focus:outline-none focus:ring active:bg-dark-olive sm:w-auto"
              onClick={() => navigate("/create-listing")}
            >
              Donate
            </button>

            <a
              className="block w-full rounded-2xl bg-cream px-12 py-3 text-sm font-medium text-burnt-orange shadow hover:bg-golden-yellow hover:text-white focus:outline-none focus:ring active:bg-dark-olive sm:w-auto"
              href="#explore"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cream to-transparent" />
    </div>
  );
};

export default Hero;
