import React from "react";

const Hero = () => {
  return (
    <div
      className="bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-image.jpg')" }}
    >
      <section className="bg-black bg-opacity-50">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex flex-col items-center text-center">
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
            <a
              className="block w-full rounded-2xl bg-olive-green px-12 py-3 text-sm font-medium text-white shadow hover:bg-dark-olive focus:outline-none focus:ring active:bg-dark-olive sm:w-auto"
              href="/profile"
            >
              Donate
            </a>

            <a
              className="block w-full rounded-2xl px-12 py-3 text-sm font-medium text-golden-yellow shadow hover:text-white focus:outline-none focus:ring active:text-blue-500 sm:w-auto"
              href="#explore"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
