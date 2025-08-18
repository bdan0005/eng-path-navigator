import React from "react";
import Block from "./Block";

// import your icons here as in App.jsx
import biomedIcon from '../assets/specialisation_icons/biomed-ellipse-43.svg';
import chemIcon from '../assets/specialisation_icons/chem-ellipse-39.svg';
import civilIcon from '../assets/specialisation_icons/civil-ellipse-25.svg';
import electricalIcon from '../assets/specialisation_icons/electrical-ellipse-62.svg';
import enviroIcon from '../assets/specialisation_icons/enviro-ellipse-29.svg';
import materialsIcon from '../assets/specialisation_icons/materials-ellipse-48.svg';
import softwareIcon from '../assets/specialisation_icons/software-ellipse-14.svg';

const specialisations = [
  { icon: biomedIcon, name: "Biomedical Engineering", description: "Applies engineering principles to medicine and biology." },
  { icon: chemIcon, name: "Chemical Engineering", description: "Focuses on chemical processes and production." },
  { icon: civilIcon, name: "Civil Engineering", description: "Designs and builds infrastructure projects." },
  { icon: electricalIcon, name: "Electrical Engineering", description: "Works with electrical systems and technology." },
  { icon: enviroIcon, name: "Environmental Engineering", description: "Solves environmental problems using engineering." },
  { icon: materialsIcon, name: "Materials Engineering", description: "Develops and tests new materials." },
  { icon: softwareIcon, name: "Software Engineering", description: "Designs and builds software systems." },
];

const Specialisations = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
    {specialisations.map((spec) => (
      <Block
        key={spec.name}
        icon={spec.icon}
        name={spec.name}
        description={spec.description}
      />
    ))}
  </div>
);

export default Specialisations;