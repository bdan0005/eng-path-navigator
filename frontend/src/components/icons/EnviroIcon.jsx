import React from "react";
import Vector32 from "../../assets/specialisation_icons/vector-32.svg";
import Vector33 from "../../assets/specialisation_icons/vector-33.svg";
import Vector34 from "../../assets/specialisation_icons/vector-34.svg";
import Vector35 from "../../assets/specialisation_icons/vector-35.svg";
import Vector36 from "../../assets/specialisation_icons/vector-36.svg";
import Vector37 from "../../assets/specialisation_icons/vector-37.svg";
import ellipse from "../../assets/specialisation_icons/enviro-ellipse-29.svg";

const EnviroIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <img
      src={ellipse}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center"
      draggable={false}
    />
    <img
      src={Vector32}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
    <img
      src={Vector33}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
    <img
      src={Vector35}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
    <img
      src={Vector37}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
    <img
      src={Vector34}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
    <img
      src={Vector36}
      alt=""
      className="absolute inset-0 w-full h-full object-contain object-center p-1"
      draggable={false}
    />
  </div>
);

export default EnviroIcon;