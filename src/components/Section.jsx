import React from "react";

const Section = () => {
  return (
    <section>
      <div class=" bg-gray-900 mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div class=" m-3 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
            <img
              alt=""
              src="https://img.freepik.com/free-photo/close-up-people-holding-apples-bag_23-2149182018.jpg?size=626&ext=jpg&ga=GA1.1.1247198137.1697257699&semt=ais"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div class="lg:py-24">
            <h2 class="text-3xl text-white font-bold font-Lemon sm:text-4xl">
              Grow your audience
            </h2>

            <p class="mt-4 text-gray-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui
              hic atque tenetur quis eius quos ea neque sunt, accusantium soluta
              minus veniam tempora deserunt? Molestiae eius quidem quam
              repellat.
            </p>

            <a
              href="/alllisting"
              class="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Buy Donations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;
