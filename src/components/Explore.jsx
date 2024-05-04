import React, { useState } from "react";
import { staggerContainer } from "../utils/motion";
import { motion } from "framer-motion";
import TypingText from "./styles/TypingText";
import ExploreCard from "./styles/ExploreCard";
import { exploreWorlds } from "./constants";

const Explore = () => {
  const [active, setActive] = useState("world-3");
  return (
    <>
    <section className="sm:p-16 xs:p-8 px-6 py-4 top-0 " id="explore">
   
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="2xl:max-w-[1280px] w-full  flex flex-col"
      >
        <TypingText  title="| Types Of Donations" textStyles="text-center  " />
      
        <div className="mt-[2px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
          {exploreWorlds.map((world, index) => (
            <ExploreCard
              key={world.id}
              {...world}
              index={index}
              active={active}
              handleClick={setActive}
            />
          ))}
        </div>
      </motion.div>
     
    </section>
    <svg className="down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#111827" fill-opacity="1" d="M0,288L1440,256L1440,320L0,320Z"></path></svg>
    </>
  );
};

export default Explore;
