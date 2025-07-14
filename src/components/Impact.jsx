import React from "react";

const impactHighlights = [
  {
    title: "Every Meal Counts",
    description:
      "Your simple act of donating surplus food can mean a nutritious meal for a struggling family. It’s more than food — it’s dignity, hope, and health.",
    imgUrl: "need.jpg",
  },
  {
    title: "Voices of the Voiceless",
    description:
      "Animals in shelters and streets rely on kind souls like you. Your donation helps them survive and thrive, one bowl at a time.",
    imgUrl: "strays.jpeg",
  },
];

export default function Impact() {
  return (
    <div className="py-12 sm:py-16 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-dark-olive">
          Why It Matters
        </h2>
        <div className="space-y-12">
          {impactHighlights.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-dark-olive mb-4">
                  {item.title}
                </h3>
                <p className="text-lg text-dark-olive/90">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
