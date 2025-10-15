import React from "react";

const Row = ({ name, prob }) => (
  <div className={`w-full flex`} >
    <div className="bg-white border border-sky-700/25 rounded-2xl shadow-sm flex flex-row items-center p-4 w-full h-full hover:shadow-md transition-shadow box-border justify-between">
      {/* Name */}
      <div className="flex-1">
        <h5 className="text-sky-700 text-xs font-semibold mb-1 text-left">
          {name} Engineering
        </h5>
      </div>
      {/* Probability */}
      <div>
        <p className="text-gray-800 text-xs font-medium">{prob}% fit</p>
      </div>
    </div>
  </div>
);

export default Row;
