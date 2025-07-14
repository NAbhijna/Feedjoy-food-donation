import React from "react";

const helpTopics = [
	{
		title: "Donate Food",
		description:
			"Have surplus food? List your donation and connect with someone who needs it.",
		imgUrl: "share.jpg",
	},
	{
		title: "Help Our Furry Friends",
		description:
			"We welcome pet food donations to support local animal shelters and pet owners in need.",
		imgUrl: "stray.jpeg",
	},
	{
		title: "Receive Support",
		description:
			"Find fresh and nutritious meals from donations made by people in your community.",
		imgUrl: "help.jpg",
	},
];

export default function Explore() {
	return (
		<div className="py-12 sm:py-16 bg-cream" id="explore">
			<div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-12">
				<h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-dark-olive">
					How You Can Help
				</h2>
				<div className="w-full mx-auto grid md:grid-cols-3 gap-8 text-center">
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
		</div>
	);
}


