import React from "react";

const Block = ({ icon: Icon, name, description }) => (
  <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-6 w-72 hover:shadow-lg transition-shadow">
    {/* Icon */}
    <div className="bg-blue-100 rounded-full p-4 mb-4 flex items-center justify-center">
      <Icon />
    </div>
    {/* Name */}
    <h3 className="text-lg font-semibold text-center mb-2">{name}</h3>
    {/* Description */}
    <p className="text-gray-500 text-center text-sm">{description}</p>
  </div>
);

export default Block;