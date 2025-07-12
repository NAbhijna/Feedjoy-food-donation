import React from "react";

const helpTopics = [
	{
		title: "Donate Food",
		description:
			"Have surplus food? List your donation and connect with someone who needs it.",
		imgUrl: "/D (1).jpeg",
	},
	{
		title: "Help Our Furry Friends",
		description:
			"We welcome pet food donations to support local animal shelters and pet owners in need.",
		imgUrl: "/D (2).jpeg",
	},
	{
		title: "Receive Support",
		description:
			"Find fresh and nutritious meals from donations made by people in your community.",
		imgUrl: "D (3).jpeg",
	},
];

export default function Explore() {
	return (
		<div className="py-16 bg-cream" id="explore">
			<h2 className="text-center text-3xl font-bold mb-8 text-dark-olive">
				How You Can Help
			</h2>
			<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center px-4">
				{helpTopics.map((topic, index) => (
					<div
						key={index}
						className="p-6 border border-golden-yellow rounded-2xl shadow-lg bg-cream transform hover:scale-105 transition-transform duration-300"
					>
						<img
							src={topic.imgUrl}
							alt={topic.title}
							className="w-full h-48 object-cover rounded-2xl mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2 text-dark-olive">
							{topic.title}
						</h3>
						<p className="text-dark-olive">{topic.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}

