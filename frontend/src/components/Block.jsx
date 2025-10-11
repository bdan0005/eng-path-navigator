import React from "react";

const Block = ({ iconSrc, name, description, prob }) => (
  <div className="w-60 min-h-72 rounded-2xl ">
    <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center p-6 w-full h-full hover:shadow-md transition-shadow box-border">
      {/* Icon */}
      <div className="rounded-full p-1 flex items-center justify-center mb-4">
        <img
          src={iconSrc}
          alt={`${name} icon`}
          className="w-16 h-16 object-contain"
          draggable={false}
        />
      </div>
      {/* Name */}
      <h3 className="text-sky-700 text-lg font-semibold text-center mb-2">{name}<br /> Engineering</h3>
      {/* Description */}
      <p className="text-gray-500 text-center text-sm">{description}</p>
      {/* Probability */}
      <p className="text-gray-800 text-center text-xs font-medium mt-3">{prob}% fit</p>
    </div>
  </div>
);

export default Block;
