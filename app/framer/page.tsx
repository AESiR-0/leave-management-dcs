"use client";
import { useState } from "react";
export default function Page() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="bg-[#1f1f1f] text-[#f0f0f0] h-screen w-screen flex justify-center items-center">
      <div
        onMouseEnter={(e) => {
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
        }}
        className="text-4xl w-48 overflow-hidden rounded-[0.4rem] text-center h-28 hover:cursor-pointer bg-[#0e0e0e]"
      >
        <div  className={`${
            hovered ? "-translate-y-28" : "translate-y-0"
          } transition-all duration-500  p-5 `}>
        <span
         
        >
          Hello, World!
        </span>
        <br />
        <br />
        <span> Welcome!</span>
      </div>
    </div>
    </div>
  );
}
