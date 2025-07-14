import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const stats = [
  {
    label: "People facing hunger in 2023",
    value: 733000000,
    caption: "That’s ~1 in 11 people around the world",
  },
  {
    label: "Food wasted annually",
    value: 1050000000,
    caption: "Over 1 billion tonnes—~20% of all food produced",
  },
  {
    label: "Global volunteers in 2024",
    value: 970000000,
    caption: "Nearly 1 billion caring individuals stepping up",
  },
];

function formatNumber(num) {
  if (num >= 1000000000) {
    return { value: num / 1000000000, suffix: "B+" };
  }
  if (num >= 1000000) {
    return { value: num / 1000000, suffix: "M+" };
  }
  if (num >= 1000) {
    return { value: num / 1000, suffix: "K+" };
  }
  return { value: num, suffix: "" };
}

function AnimatedCounter({ to, suffix }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (to % 1 !== 0) {
      return latest.toFixed(2);
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [to, count]);

  return (
    <span>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="py-12 sm:py-16 bg-cream">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => {
            const formatted = formatNumber(stat.value);
            return (
              <div key={index} className="flex flex-col items-center">
                <p
                  className="text-4xl sm:text-5xl font-bold text-burnt-orange"
                  aria-live="polite"
                >
                  {inView ? (
                    <AnimatedCounter
                      to={formatted.value}
                      suffix={formatted.suffix}
                    />
                  ) : (
                    "0"
                  )}
                </p>
                <p className="mt-2 text-lg font-semibold text-dark-olive">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm text-dark-olive/80">
                  {stat.caption}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
