import { useState } from "react";

const RankQuestion = ({ text, options, maxRank = options.length, onChange }) => {
  const [ranks, setRanks] = useState({});

  const handleRankChange = (option, rank) => {
    const updatedRanks = { ...ranks };

    // Remove any option that already has the same rank
    for (let key in updatedRanks) {
      if (updatedRanks[key] === rank) {
        delete updatedRanks[key];
      }
    }

    if (rank === "") {
      delete updatedRanks[option];
    } else {
      updatedRanks[option] = rank;
    }

    if (Object.keys(updatedRanks).length <= maxRank) {
      setRanks(updatedRanks);
      if (onChange) onChange(updatedRanks);
    }
  };

  const rankOptions = Array.from({ length: maxRank }, (_, i) => i + 1);

  return (
    <div className="p-4 w-full max-w-3xl mx-auto space-y-6">
      <div className="text-3xl font-bold text-black mb-6 text-center">{text}</div>
      <div className="text-sm text-gray-700 text-center">
        You can rank up to {maxRank} option{maxRank > 1 ? "s" : ""}.
      </div>

      {/* Grid layout for 2 columns */}
      <div className="grid sm:grid-cols-2 gap-6">
        {options.map((option) => (
          <div
            key={option}
            className="flex justify-center items-center space-x-4"
          >
            <span className="w-40 text-center font-semibold">{option}</span>
            <select
              value={ranks[option] || ""}
              onChange={(e) => handleRankChange(option, Number(e.target.value))}
              className="border border-gray-800 rounded px-2 py-1"
            >
              <option value="">-</option>
              {rankOptions.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankQuestion;