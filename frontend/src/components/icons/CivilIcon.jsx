import React from "react";
import Vector27 from "../../assets/specialisation_icons/vector-27.svg";
import ellipse from "../../assets/specialisation_icons/civil-ellipse-25.svg";

const CivilIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <img
      src={ellipse}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center"
      draggable={false}
    />
    <img
      src={Vector27}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
  </div>
);

export default CivilIcon; 