import React from "react";
import Vector67 from "../../assets/specialisation_icons/vector-67.svg";
import ellipse from "../../assets/specialisation_icons/electrical-ellipse-62.svg";

const ElecIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <img
      src={ellipse}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center"
      draggable={false}
    />
    <img
      src={Vector67}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1.5"
      draggable={false}
    />
  </div>
);

export default ElecIcon;