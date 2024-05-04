import React from "react";
import Explore from "../components/Explore";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Section from "../components/Section";
import Post from "../components/Post";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <Explore />
      <Section />
      <Post />
      <Footer />
    </div>
  );
}
