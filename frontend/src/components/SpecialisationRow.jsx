import React from "react";
import { specialisations } from "./SpecialisationCard";
import Row from "./Row";

const SpecialisationCard = ({ name, prob }) => {
  const spec = specialisations.find(s => s.name === name);

  if (!spec) return null;

  return (
    <div className="flex justify-center">
      <Row
        iconSrc={spec.iconSrc}
        name={spec.name}
        description={spec.description}
        prob={prob}
      />
    </div>
  );
};

export default SpecialisationCard;