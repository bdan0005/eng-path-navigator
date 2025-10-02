import SpecialisationCard from "./SpecialisationCard";

const Recommendations = ({ specialisations }) => {
  if (!specialisations || specialisations.length === 0) return null;

  const top3 = specialisations.slice(0, 3);

  return (
    <div className="p-4 w-full max-w-5xl mx-auto">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {top3.map(([spec, prob], idx) => (
          <SpecialisationCard key={idx} name={spec} prob={prob} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
