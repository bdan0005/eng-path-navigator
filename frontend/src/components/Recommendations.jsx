import SpecialisationCard from "./SpecialisationCard";
import SpecialisationRow from "./SpecialisationRow";

const Recommendations = ({ specialisations }) => {
  if (!specialisations || specialisations.length === 0) return null;

  const top3 = specialisations.slice(0, 3);
  const rest = specialisations.slice(3);

  return (
    <div className="p-4 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {top3.map(({ specialisation, probability }, idx) => (
          <SpecialisationCard key={idx} name={specialisation} prob={probability} />
        ))}
      </div>

      <div className="grid grid-rows-7 gap-2 sm:p-1 md:p-5">
        {rest.map(([spec, prob], idx) => (
          <SpecialisationRow key={idx} name={spec} prob={prob} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;