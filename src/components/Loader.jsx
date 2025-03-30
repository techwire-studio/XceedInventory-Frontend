import { RiLoaderLine } from "@remixicon/react";
import React from "react";

const Loader = ({ containerClass, text = "Loading..." }) => {
  return (
    <div className={`flex justify-center items-center ${containerClass || "h-64 w-full"}`}>
      <div className="text-center">
        <div className="animate-spin inline-block mb-3">
          <RiLoaderLine size={40} color="#3B82F6" />
        </div>
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Loader;