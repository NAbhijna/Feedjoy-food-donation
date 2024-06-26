import React from "react";

export default function Spinner() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="loader"></div>
      </div>
    </>
  );
}
