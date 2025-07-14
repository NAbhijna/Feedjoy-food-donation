import React from "react";
import Explore from "../components/Explore";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Impact from "../components/Impact";
import Stats from "../components/Stats";
import CallToAction from "../components/CallToAction";

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <Impact />
      <Explore />
      <CallToAction />
      <Footer />
    </div>
  );
}
