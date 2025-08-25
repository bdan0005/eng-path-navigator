import React from "react";
import Block from "./Block";
import SoftwareIcon from "./icons/SoftwareIcon";
import CivilIcon from "./icons/CivilIcon";
import EnviroIcon from "./icons/EnviroIcon";
import ChemIcon from "./icons/ChemIcon";
import BiomedIcon from "./icons/BiomedIcon";
import MatIcon from "./icons/MatIcon";
import ElecIcon from "./icons/ElecIcon"; // Make sure this file exists

const specialisations = [
  { icon: BiomedIcon, name: "Biomedical Engineering", description: "Applies engineering principles to medicine and biology." },
  { icon: ChemIcon, name: "Chemical Engineering", description: "Focuses on chemical processes and production." },
  { icon: CivilIcon, name: "Civil Engineering", description: "Designs and builds infrastructure projects." },
  { icon: ElecIcon, name: "Electrical Engineering", description: "Works with electrical systems and technology." },
  { icon: EnviroIcon, name: "Environmental Engineering", description: "Solves environmental problems using engineering." },
  { icon: MatIcon, name: "Materials Engineering", description: "Develops and tests new materials." },
  { icon: SoftwareIcon, name: "Software Engineering", description: "Designs and builds software systems." },
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