import React from "react";
import Vector46 from "../../assets/specialisation_icons/vector-46.svg";
import ellipse from "../../assets/specialisation_icons/biomed-ellipse-43.svg";

const BiomedIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <img
      src={ellipse}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center"
      draggable={false}
    />
    <img
      src={Vector46}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
  </div>
);

export default BiomedIcon;