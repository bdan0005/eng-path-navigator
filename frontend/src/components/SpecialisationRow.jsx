import React from "react";
import { specialisations } from "./SpecialisationCard";
import Row from "./Row";

const SpecialisationRow = ({ name, prob }) => {
  const spec = specialisations.find(
    s => s.name.toLowerCase() === name.toLowerCase()
  );

  if (!spec) return null;

  return (
    <div className="flex justify-center">
      <Row
        name={spec.name}
        prob={prob}
      />
    </div>
  );
};

export default SpecialisationRow;