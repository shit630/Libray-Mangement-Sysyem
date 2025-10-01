import React from "react";

const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`animate-pulse bg-gray-200 rounded-lg ${
        type === "card"
          ? "h-80"
          : type === "text"
          ? "h-4"
          : type === "image"
          ? "h-48"
          : "h-24"
      }`}
    ></div>
  ));
  return <>{skeletons}</>;
};

export default LoadingSkeleton;
