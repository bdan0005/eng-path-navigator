import React from "react";
import Block from "./Block";
import BiomedIcon from "../assets/specialisation_icons/Biomedical.svg";
import ChemIcon from "../assets/specialisation_icons/Chemical.svg";
import CivilIcon from "../assets/specialisation_icons/Civil.svg";
import ElecIcon from "../assets/specialisation_icons/Electrical.svg";
import EnviroIcon from "../assets/specialisation_icons/Environmental.svg";
import MatIcon from "../assets/specialisation_icons/Materials.svg";
import SoftwareIcon from "../assets/specialisation_icons/Software.svg";
import AeroIcon from "../assets/specialisation_icons/Aerospace.svg";
import MechIcon from "../assets/specialisation_icons/Mechanical.svg";
import TrcIcon from "../assets/specialisation_icons/Mechatronics.svg";

const specialisations = [
  { iconSrc: BiomedIcon, name: "Biomedical Engineering", description: "Applies engineering principles to medicine and biology." },
  { iconSrc: ChemIcon, name: "Chemical Engineering", description: "Focuses on chemical processes and production." },
  { iconSrc: CivilIcon, name: "Civil Engineering", description: "Designs and builds infrastructure projects." },
  { iconSrc: ElecIcon, name: "Electrical Engineering", description: "Works with electrical systems and technology." },
  { iconSrc: EnviroIcon, name: "Environmental Engineering", description: "Solves environmental problems using engineering." },
  { iconSrc: MatIcon, name: "Materials Engineering", description: "Develops and tests new materials." },
  { iconSrc: SoftwareIcon, name: "Software Engineering", description: "Designs and builds software systems." },
  { iconSrc: AeroIcon, name: "Aerospace Engineering", description: "Design and develop flight vehicles." },
  { iconSrc: MechIcon, name: "Mechanical Engineering", description: "Utilise motion and energy to create, manufacture and assemble designs." },
  { iconSrc: TrcIcon, name: "Mechatronics Engineering", description: "Employ computer control systems to make devices smarter and more efficient." }
];

const SpecialisationCard = ({ name, prob }) => {
  const fullName = `${name} Engineering`;
  const spec = specialisations.find(s => s.name === fullName);

  if (!spec) return null;

  return (
    <div className="flex justify-center">
      <Block
        iconSrc={spec.iconSrc}
        name={spec.name}
        description={spec.description}
        prob={prob}
      />
    </div>
  );
};

export default SpecialisationCard;