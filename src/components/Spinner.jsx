import React from "react";
import spinner from "../assets/svg/spinner.svg";

export default function Spinner() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-cream bg-opacity-50 z-50 flex justify-center items-center">
        <img src={spinner} alt="Loading..." className="h-24 w-24" />
      </div>
    </>
  );
}
