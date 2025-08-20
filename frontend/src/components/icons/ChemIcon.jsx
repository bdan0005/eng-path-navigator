import React from "react";
import Vector41 from "../../assets/specialisation_icons/vector-41.svg";
import ellipse from "../../assets/specialisation_icons/chem-ellipse-39.svg";

const ChemIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <img
      src={ellipse}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center"
      draggable={false}
    />
    <img
      src={Vector41}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
  </div>
);

export default ChemIcon;