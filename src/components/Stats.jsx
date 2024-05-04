import React, { useEffect,useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "../utils/motion";
import CountUp from 'react-countup'
const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, options);

    const target = document.querySelector('.section-id');  // Corrected selector
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);


  return (
    <section className="section-id">
      <svg
        className="wave-bokkings"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#111827"
          fill-opacity="1"
          d="M0,192L48,165.3C96,139,192,85,288,90.7C384,96,480,160,576,181.3C672,203,768,181,864,181.3C960,181,1056,203,1152,181.3C1248,160,1344,96,1392,64L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className=" font-Bungee text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Generous Donors
          </h2>

          <p className="mt-4 font-Pacifico  text-gray-500 sm:text-xl">
            Joined us in our mission to alleviate hunger and make a positive
            impact on communities. Your contributions help provide nutritious
            meals for those in need. Together, we can make a difference and
            bring smiles to faces.
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">
                Total Donations
              </dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
              {isVisible && <CountUp start={0} end={100} duration={2} separator="," />}M
              </dd>
            </div>

            <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">
                Animal Donation
              </dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
              {isVisible && <CountUp start={0} end={51} duration={2} separator="," />}M
              </dd>
            </div>

            <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">
                Total Doners
              </dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
              {isVisible && <CountUp start={0} end={81} duration={2} separator="," />}M
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Stats;
