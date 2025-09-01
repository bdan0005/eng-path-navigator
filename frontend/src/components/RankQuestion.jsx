import { useState } from "react";

const RankQuestion = ({ text, options, maxRank = options.length, onChange }) => {
  const [ranks, setRanks] = useState({});

  const handleRankChange = (option, rank) => {
    const updatedRanks = { ...ranks };

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
    <div className="p-4 w-full max-w-3xl mx-auto space-y-4">
      <div className="text-2xl font-bold text-black mb-4">{text}</div>

      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-4">
            <span className="w-40 font-semibold">{option}</span>
            <select
              value={ranks[option] || ""}
              onChange={(e) => handleRankChange(option, Number(e.target.value))}
              className="border rounded px-2 py-1"
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

      <div className="text-sm text-gray-500">
        You can rank up to {maxRank} option{maxRank > 1 ? "s" : ""}.
      </div>
    </div>
  );
};

export default RankQuestion;