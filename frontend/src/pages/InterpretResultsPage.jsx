import { useState } from 'react';
import TopBar from '../components/TopBar';
import SpecialisationCard from '../components/SpecialisationCard';

const message = "The percentage shown on each card on the results page represents the model's estimated fit for that particular specialisation based on the user's traits. Technically, these percentages form a probability distribution across all specialisations, meaning that higher values indicate a stronger alignment between the user's profile and the attributes of that specialisation. A 30% fit for 'Biomedical,' for example, suggests that out of all possible specialisations, Biomedical is moderately likely to match the user's strengths and preferences, but other specialisations may have higher or lower probabilities. These probabilities are relative, so they should be interpreted as comparative guidance rather than absolute certainty."

export default function InterpretResultsPage() {

  return (
    <div className="px-10 py-5 bg-gray-50 min-h-screen">
      <div className="pb-5">
        <TopBar />
      </div>

      <div className="flex flex-col bg-white rounded-2xl shadow-sm min-h-[300px] p-5">
        <div className="text-3xl font-semibold text-gray-800">Interpreting your results</div>
        <div className="flex flex-row mt-5">
          <SpecialisationCard name="Biomedical" prob="30" />
          <div className="px-5">{message}</div>
        </div>      
      </div>
    </div>
  );
}
