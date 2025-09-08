import React from "react";
import Block from "./Block";
import BiomedIcon from "../assets/specialisation_icons/Biomedical.svg";
import ChemIcon from "../assets/specialisation_icons/Chemical.svg";
import CivilIcon from "../assets/specialisation_icons/Civil.svg";
import ElecIcon from "../assets/specialisation_icons/Electrical.svg";
import EnviroIcon from "../assets/specialisation_icons/Environmental.svg";
import MatIcon from "../assets/specialisation_icons/Materials.svg";
import SoftwareIcon from "../assets/specialisation_icons/Software.svg";

const specialisations = [
  { iconSrc: BiomedIcon, name: "Biomedical Engineering", description: "Applies engineering principles to medicine and biology." },
  { iconSrc: ChemIcon, name: "Chemical Engineering", description: "Focuses on chemical processes and production." },
  { iconSrc: CivilIcon, name: "Civil Engineering", description: "Designs and builds infrastructure projects." },
  { iconSrc: ElecIcon, name: "Electrical Engineering", description: "Works with electrical systems and technology." },
  { iconSrc: EnviroIcon, name: "Environmental Engineering", description: "Solves environmental problems using engineering." },
  { iconSrc: MatIcon, name: "Materials Engineering", description: "Develops and tests new materials." },
  { iconSrc: SoftwareIcon, name: "Software Engineering", description: "Designs and builds software systems." },
];

const Specialisations = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
    {specialisations.map((spec) => (
      <Block
        key={spec.name}
        iconSrc={spec.iconSrc}
        name={spec.name}
        description={spec.description}
      />
    ))}
  </div>
);

export default Specialisations;