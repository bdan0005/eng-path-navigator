import { useState } from "react";

const CheckboxQuestion = ({ text, options, maxSelectable = options.length, onChange }) => {
  const [selected, setSelected] = useState([]);

  const handleToggle = (option) => {
    let updatedSelected;

    if (selected.includes(option)) {
      updatedSelected = selected.filter((item) => item !== option);
    } else {
      if (selected.length < maxSelectable) {
        updatedSelected = [...selected, option];
      } else {
        return;
      }
    }

    setSelected(updatedSelected);
    if (onChange) onChange(updatedSelected);
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto space-y-4">
      <div className="text-3xl font-bold text-black mb-6 text-center">{text}</div>
      {maxSelectable < options.length && (
        <div className="text-sm text-gray-500">
          You can select up to {maxSelectable} option{maxSelectable > 1 ? "s" : ""}.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center space-x-2 p-2 border rounded cursor-pointer ${
              selected.includes(option) ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-5 h-5 accent-blue-600"
            />
            <span className="font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxQuestion;