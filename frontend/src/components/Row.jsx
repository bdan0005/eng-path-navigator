import React from "react";

const Row = ({ iconSrc, name, description, prob, height = 120 }) => (
  <div className={`w-full`} style={{ minHeight: height, height }}>
    <div className="bg-white border border-sky-700/25 rounded-2xl shadow-sm flex flex-row items-center p-8 w-full h-full hover:shadow-md transition-shadow box-border">
      {/* Icon */}
      <div className="rounded-full p-0.5 flex items-center justify-center mr-6">
        <img
          src={iconSrc}
          alt={`${name} icon`}
          className="w-16 h-16 object-contain"
          draggable={false}
        />
      </div>
      {/* Name & Description */}
      <div className="flex-1">
        <h3 className="text-sky-700 text-lg font-semibold mb-1">
          {name} Engineering
        </h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      {/* Probability */}
      <div className="ml-6">
        <p className="text-gray-800 text-xs font-medium">{prob}% fit</p>
      </div>
    </div>
  </div>
);

export default Row;
