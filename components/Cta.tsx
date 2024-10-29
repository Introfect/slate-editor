"use client";
import { useRouter } from "next/navigation";
import React from "react";

function Cta() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/editor");
  };
  return (
    <button
      title=""
      className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg sm:mt-16 hover:bg-blue-700 focus:bg-blue-700"
      onClick={handleClick}
    >
      Explore Now
      <svg
        className="w-6 h-6 ml-8 -mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
}

export default Cta;
